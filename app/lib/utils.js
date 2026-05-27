/**
 * Build full Supabase storage image URL from a stored path
 */
export function getImageUrl(path) {
    if (!path) return "/images/placeholder.jpg";
    if (path.startsWith("http")) return path;
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${base}/storage/v1/object/public/product-images/${path}`;
}

/**
 * Build a WhatsApp wa.me link with a pre-filled message
 */
export function getWhatsAppUrl(
    message = "Hello! I found your website and would like to make an enquiry."
) {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919014538495";
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Truncate a string to a given length
 */
export function truncate(str, length = 120) {
    if (!str) return "";
    return str.length > length ? str.slice(0, length) + "…" : str;
}

/**
 * Slugify a string for URL use
 */
export function slugify(str) {
    return (str || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}