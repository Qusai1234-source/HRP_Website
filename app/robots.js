const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hrpvizag.com";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/admin/"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
