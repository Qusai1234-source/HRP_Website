// app/products/[category]/layout.jsx — server layout for dynamic category pages
import { supabase } from "@/app/lib/supabase";

export async function generateMetadata({ params }) {
    const { category } = await params;
    const { data: cat } = await supabase
        .from("categories")
        .select("name,description")
        .eq("slug", category)
        .single();

    const name = cat?.name || category;
    return {
        title: `${name} | HRP Products`,
        description: cat?.description || `Browse ${name} products from HRP Industrial Products — quality assured, pan-India delivery.`,
    };
}

export default function CategoryLayout({ children }) {
    return children;
}
