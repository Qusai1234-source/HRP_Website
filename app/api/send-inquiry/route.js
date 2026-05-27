// app/api/send-inquiry/route.js
// POST /api/send-inquiry
// 1. Saves the inquiry to Supabase
// 2. Sends a notification email via Resend
// Requires env var: RESEND_API_KEY
// Optional env var: INQUIRY_RECIPIENT (defaults to info@hrpvizag.com)

import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function buildEmailHtml({ name, company, phone, email, category, message }) {
    return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1A2533;padding:28px 36px;">
            <p style="margin:0;color:#2B7EA1;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;">HRP Industrial Products</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">New Inquiry Received</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">

              <tr>
                <td style="padding-bottom:20px;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Full Name</p>
                  <p style="margin:0;font-size:16px;color:#1A2533;font-weight:600;">${name}</p>
                </td>
              </tr>

              ${company ? `
              <tr>
                <td style="padding:20px 0;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Company</p>
                  <p style="margin:0;font-size:15px;color:#1A2533;">${company}</p>
                </td>
              </tr>` : ""}

              <tr>
                <td style="padding:20px 0;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Phone</p>
                  <p style="margin:0;font-size:15px;color:#1A2533;"><a href="tel:${phone}" style="color:#2B7EA1;text-decoration:none;">${phone}</a></p>
                </td>
              </tr>

              ${email ? `
              <tr>
                <td style="padding:20px 0;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Email</p>
                  <p style="margin:0;font-size:15px;color:#1A2533;"><a href="mailto:${email}" style="color:#2B7EA1;text-decoration:none;">${email}</a></p>
                </td>
              </tr>` : ""}

              ${category ? `
              <tr>
                <td style="padding:20px 0;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Product Category</p>
                  <p style="margin:0;font-size:15px;color:#1A2533;text-transform:capitalize;">${category.replace(/-/g, " ")}</p>
                </td>
              </tr>` : ""}

              <tr>
                <td style="padding:20px 0;">
                  <p style="margin:0 0 8px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Inquiry Message</p>
                  <div style="background:#f8f9fb;border-left:3px solid #2B7EA1;border-radius:4px;padding:16px 20px;">
                    <p style="margin:0;font-size:15px;color:#1A2533;line-height:1.6;white-space:pre-wrap;">${message}</p>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Reply CTAs -->
        <tr>
          <td style="padding:0 36px 32px;">
            <a href="https://wa.me/919014538495?text=${encodeURIComponent(`Hi, responding to inquiry from ${name}${phone ? ` (${phone})` : ""}.`)}"
               style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;margin-right:12px;">
              Reply on WhatsApp
            </a>
            ${email ? `<a href="mailto:${email}" style="display:inline-block;background:#2B7EA1;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;">Reply by Email</a>` : ""}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fb;padding:20px 36px;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#aaa;">
              Sent automatically by the HRP Industrial Products website ·
              <a href="https://hrpindustrial.in/contact" style="color:#2B7EA1;text-decoration:none;">hrpindustrial.in</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, company, phone, email, category, message } = body;

        // Basic validation
        if (!name?.trim() || !phone?.trim() || !message?.trim()) {
            return NextResponse.json(
                { error: "Name, phone, and message are required." },
                { status: 400 }
            );
        }

        // ── 1. Save to Supabase ────────────────────────────────────────────────
        const { error: dbError } = await supabase.from("inquiries").insert([{
            name: name.trim(),
            company: company?.trim() || null,
            phone: phone.trim(),
            email: email?.trim() || null,
            category: category || null,
            message: message.trim(),
        }]);

        if (dbError) {
            console.error("[send-inquiry] Supabase error:", dbError);
            // Don't block — still attempt to send email
        }

        // ── 2. Send email via Resend ───────────────────────────────────────────
        if (!process.env.RESEND_API_KEY) {
            console.warn("[send-inquiry] RESEND_API_KEY not set — skipping email.");
            return NextResponse.json({ ok: true, emailSent: false });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const recipient = process.env.INQUIRY_RECIPIENT || "info@hrpvizag.com";
        const subject   = `New Inquiry from ${name.trim()}${company ? ` — ${company.trim()}` : ""}`;

        const { error: emailError } = await resend.emails.send({
            from: "HRP Website <onboarding@resend.dev>",
            to: [recipient],
            replyTo: email || undefined,
            subject,
            html: buildEmailHtml({ name, company, phone, email, category, message }),
        });

        if (emailError) {
            console.error("[send-inquiry] Resend error:", emailError);
            return NextResponse.json({ ok: true, emailSent: false });
        }

        return NextResponse.json({ ok: true, emailSent: true });

    } catch (err) {
        console.error("[send-inquiry]", err);
        return NextResponse.json(
            { error: err?.message || "Failed to send inquiry." },
            { status: 500 }
        );
    }
}
