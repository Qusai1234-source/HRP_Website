// app/api/inquiries/[id]/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses all RLS policies (DB operations only)
const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Anon client — used ONLY to verify the caller's JWT
const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getAuthUser(request) {
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return null;

    // Must use anon client — service role client cannot validate user JWTs
    const { data: { user }, error } = await anonClient.auth.getUser(token);
    return error ? null : user;
}

export async function DELETE(request, ctx) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    const { error } = await adminClient.from("inquiries").delete().eq("id", id);
    if (error) {
        console.error("[inquiries] Delete error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
}

export async function PATCH(request, ctx) {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;

    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

    const { status } = body;
    const VALID_STATUSES = ["new", "read", "resolved"];
    if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
            { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
            { status: 400 }
        );
    }

    const { error } = await adminClient.from("inquiries").update({ status }).eq("id", id);
    if (error) {
        console.error("[inquiries] Update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
}