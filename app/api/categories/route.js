// app/api/categories/route.js
// GET /api/categories — returns all categories ordered by sort_order
// Used by the contact form dropdown; runs server-side so env vars are always available.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const FALLBACK = [
    { slug: "hydraulics",      name: "Hydraulic Hoses & Fittings" },
    { slug: "pneumatics",      name: "Pneumatic Hoses & Fittings" },
    { slug: "bellows",         name: "SS Bellows & Hoses" },
    { slug: "instrumentation", name: "Instrumentation & Valves" },
    { slug: "vacuum",          name: "Vacuum Components" },
    { slug: "compressors",     name: "Compressors & Accessories" },
    { slug: "rubber",          name: "Rubber Products" },
    { slug: "power-tools",     name: "Power Tools & Tools" },
    { slug: "paint",           name: "Paint Equipment" },
    { slug: "lifting",         name: "Tackles & Lifting" },
    { slug: "other",           name: "Other / Not Listed" },
];

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("categories")
            .select("id, name, slug")
            .order("sort_order", { ascending: true });

        if (error || !data?.length) {
            return NextResponse.json(FALLBACK);
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(FALLBACK);
    }
}
