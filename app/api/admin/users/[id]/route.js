// app/api/admin/users/[id]/route.js
// DELETE /api/admin/users/:id  → delete a user
//
// Server-side only (service_role). Every request verifies the caller's JWT,
// and a guard prevents an admin from deleting their own account and locking
// themselves out.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

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

export async function DELETE(request, ctx) {
    const caller = await getAuthUser(request);
    if (!caller) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json(
            { error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server." },
            { status: 500 }
        );
    }

    const { id } = await ctx.params;

    // Guard: never let an admin delete their own account.
    if (id === caller.id) {
        return NextResponse.json(
            { error: "You cannot delete your own account." },
            { status: 400 }
        );
    }

    const { error } = await adminClient.auth.admin.deleteUser(id);
    if (error) {
        console.error("[admin/users] delete error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
