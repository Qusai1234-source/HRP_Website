import { supabase } from "@/app/lib/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hrpvizag.com";

export default async function sitemap() {
    const now = new Date();

    // ── Static routes ──────────────────────────────────────────────────────────
    const staticRoutes = [
        { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
        { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
        { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ];

    // ── Category pages ─────────────────────────────────────────────────────────
    let categoryRoutes = [];
    try {
        const { data: categories } = await supabase
            .from("categories")
            .select("slug,updated_at")
            .order("sort_order");

        if (categories?.length) {
            categoryRoutes = categories.map((cat) => ({
                url: `${BASE_URL}/products/${cat.slug}`,
                lastModified: cat.updated_at ? new Date(cat.updated_at) : now,
                changeFrequency: "weekly",
                priority: 0.8,
            }));
        }
    } catch {
        // Non-fatal — sitemap degrades gracefully
    }

    // ── Product pages ──────────────────────────────────────────────────────────
    let productRoutes = [];
    try {
        // NOTE: products has no `updated_at` column — selecting it made PostgREST
        // error out and silently drop every product page from the sitemap.
        const { data: products } = await supabase
            .from("products")
            .select("slug,created_at")
            .not("slug", "is", null);

        if (products?.length) {
            productRoutes = products.map((p) => ({
                url: `${BASE_URL}/products/item/${p.slug}`,
                lastModified: p.created_at ? new Date(p.created_at) : now,
                changeFrequency: "weekly",
                priority: 0.7,
            }));
        }
    } catch {
        // Non-fatal
    }

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
