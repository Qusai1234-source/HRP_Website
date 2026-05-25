// app/products/item/[id]/layout.jsx — server layout for product detail pages
import { supabase } from "@/app/lib/supabase";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const { data: product } = await supabase
        .from("products")
        .select("name,description,brand")
        .eq("slug", id)
        .single();

    if (!product) {
        return { title: "Product | HRP Industrial Products" };
    }

    const desc = product.description
        ? product.description.slice(0, 155)
        : `${product.name} — quality industrial product from HRP, available across India.`;

    return {
        title: `${product.name} | HRP`,
        description: desc,
    };
}

export default function ProductItemLayout({ children }) {
    return children;
}
