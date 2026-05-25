const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hrpindustrial.in";

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
