import { redirect } from "next/navigation";

export default async function LegacySubcategoryRedirect({ params }) {
    const { category, subcategory } = await params;
    redirect(`/products/${category}?sub=${subcategory}`);
}
