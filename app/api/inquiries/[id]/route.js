// app/api/inquiries/[id]/route.js
// DELETE /api/inquiries/[id]  — permanently removes an inquiry
// PATCH  /api/inquiries/[id]  — updates the inquiry status { status: "new"|"read"|"resolved" }
//
// Both routes require a valid Supabase admin session passed as:
//   Authorization: Bearer <access_token>
//
// Uses the service role key to bypass RLS — the anon key cannot delete/update rows.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses all RLS policies
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/** Returns the authenticated Supabase user or null. */
async function getAuthUser(request) {
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return null;

    const { data: { user }, error } = await supabase.auth.getUser(token);
    return error ? null : user;
}

// ── DELETE /api/inquiries/[id] ────────────────────────────────────────────────
export async function DELETE(request, ctx) {
    const user = await getAuthUser(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;

    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) {
        console.error("[inquiries] Delete error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}

// ── PATCH /api/inquiries/[id] ─────────────────────────────────────────────────
export async function PATCH(request, ctx) {
    const user = await getAuthUser(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { status } = body;
    const VALID_STATUSES = ["new", "read", "resolved"];
    if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
            { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
            { status: 400 }
        );
    }

    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) {
        console.error("[inquiries] Update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
