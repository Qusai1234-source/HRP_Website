// app/api/admin/users/route.js
// GET  /api/admin/users        → list all admin users
// POST /api/admin/users        → create a new admin user
//
// Admin auth operations require the service_role key, which bypasses all
// security and must NEVER reach the browser. So this runs server-side only,
// and every request is gated by verifying the caller's own login JWT first.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service-role client — full admin powers (auth.admin.*). Server-side only.
const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

// Anon client — used ONLY to validate the caller's JWT.
const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getAuthUser(request) {
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return null;
    const { data: { user }, error } = await anonClient.auth.getUser(token);
    return error ? null : user;
}

function ensureConfigured() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json(
            { error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server." },
            { status: 500 }
        );
    }
    return null;
}

// ── GET — list users ─────────────────────────────────────────────────────────
export async function GET(request) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const configErr = ensureConfigured();
    if (configErr) return configErr;

    const { data, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) {
        console.error("[admin/users] list error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return only what the UI needs — never leak tokens or metadata internals.
    const users = (data?.users || [])
        .map((u) => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at,
        }))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return NextResponse.json({ users, currentUserId: user.id });
}

// ── POST — create a user ─────────────────────────────────────────────────────
export async function POST(request) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const configErr = ensureConfigured();
    if (configErr) return configErr;

    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // no confirmation email — user can log in immediately
    });

    if (error) {
        console.error("[admin/users] create error:", error);
        const msg = /already/i.test(error.message)
            ? "A user with this email already exists."
            : error.message;
        return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json({
        ok: true,
        user: { id: data.user.id, email: data.user.email, created_at: data.user.created_at },
    });
}
