"use client";
// src/app/products/item/[id]/page.jsx
// Product detail page. [id] param is the product SLUG.
// Route: /products/item/:slug
// Breadcrumb: Products → Category → Subcategory → Product Name

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

const slugify = (s) => s?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "";

/* ─── Loading Skeleton ─────────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f18]" style={{ paddingTop: "6rem" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-3.5 w-64 bg-white/[0.06] rounded-full mb-10 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-white/[0.04] rounded-2xl animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3].map(i => <div key={i} className="w-20 h-20 bg-white/[0.04] rounded-xl animate-pulse" />)}
            </div>
          </div>
          <div className="space-y-5 pt-2">
            <div className="h-4 w-24 bg-white/[0.06] rounded-full animate-pulse" />
            <div className="h-10 w-3/4 bg-white/[0.06] rounded-xl animate-pulse" />
            <div className="h-4 w-1/2 bg-white/[0.06] rounded-full animate-pulse" />
            <div className="w-12 h-0.5 bg-white/[0.06] animate-pulse" />
            <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-4 bg-white/[0.06] rounded-full animate-pulse" />)}</div>
            <div className="h-40 bg-white/[0.04] rounded-xl animate-pulse" />
            <div className="flex gap-3">
              <div className="h-12 flex-1 bg-white/[0.06] rounded-xl animate-pulse" />
              <div className="h-12 w-32 bg-white/[0.06] rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Related Card — dark ──────────────────────────────────────────────────── */
function RelatedCard({ product, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.07 }}>
      <Link
        href={`/products/item/${product.slug}`}
        className="group block rounded-xl overflow-hidden border border-white/[0.07] hover:border-brand-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        style={{ background: "linear-gradient(160deg, rgba(43,126,161,0.06) 0%, #0e1820 100%)" }}
      >
        <div className="relative w-full h-40 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          {product.subcategory && (
            <span className="text-[10px] font-bold font-body uppercase tracking-wide text-brand-primary">{product.subcategory}</span>
          )}
          <h3 className="font-heading font-bold text-white text-sm leading-snug mt-1 line-clamp-2 group-hover:text-brand-accent transition-colors duration-200">
            {product.name}
          </h3>
          {product.brand && <p className="text-[11px] font-body text-white/30 mt-1">{product.brand}</p>}
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.id;

  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      const { data: prod, error } = await supabase.from("products").select("*").eq("slug", slug).single();
      if (error || !prod) { setNotFound(true); setLoading(false); return; }
      setProduct(prod);
      setActiveImage(prod.image_url || null);

      const { data: cat } = await supabase.from("categories").select("name").eq("slug", prod.category_slug).single();
      setCategoryName(cat?.name || prod.category_slug);

      const { data: related } = await supabase
        .from("products")
        .select("id,name,slug,image_url,subcategory,brand")
        .eq("category_slug", prod.category_slug)
        .neq("id", prod.id)
        .limit(4);
      setRelatedProducts(related || []);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <LoadingSkeleton />;

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0f18] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="w-20 h-20 rounded-2xl border border-white/10 flex items-center justify-center" style={{ background: "rgba(43,126,161,0.07)" }}>
          <svg className="w-9 h-9 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
          </svg>
        </div>
        <h1 className="font-heading font-bold text-white text-2xl">Product Not Found</h1>
        <p className="font-body text-white/35 max-w-xs">This product may have been removed or the link is invalid.</p>
        <Link href="/products" className="flex items-center gap-2 text-brand-primary font-semibold font-body text-sm hover:gap-3 transition-all">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const allImages = [
    ...(product.image_url ? [product.image_url] : []),
    ...(Array.isArray(product.gallery_urls) ? product.gallery_urls.filter(Boolean) : []),
  ];
  const specsEntries = product.specs ? Object.entries(product.specs) : [];
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${product.name}${product.model_number ? ` (${product.model_number})` : ""}. Please share pricing and availability.`
  );
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappMessage}`;
  const inquiryUrl = `/contact?product=${encodeURIComponent(product.name)}&category=${product.category_slug}`;

  // Subcategory slug for breadcrumb
  const subSlug = slugify(product.subcategory || "");

  return (
    <>
      {/* ── Breadcrumb — dark ── */}
      <div className="bg-brand-dark border-b border-white/[0.06]" style={{ paddingTop: "5rem" }}>
        <div className="max-w-7xl mx-auto px-6 py-3.5">
          <nav className="flex items-center flex-wrap gap-1.5 text-xs font-body text-white/30">
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <svg className="w-3 h-3 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link href="/products" className="hover:text-white/60 transition-colors">Products</Link>
            {product.category_slug && (
              <>
                <svg className="w-3 h-3 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                <Link href={`/products/${product.category_slug}`} className="hover:text-white/60 transition-colors">{categoryName}</Link>
              </>
            )}
            {product.subcategory && (
              <>
                <svg className="w-3 h-3 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                <Link href={`/products/${product.category_slug}/${subSlug}`} className="hover:text-white/60 transition-colors">{product.subcategory}</Link>
              </>
            )}
            <svg className="w-3 h-3 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-white/60 max-w-[200px] truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main Detail ── */}
      <section className="bg-[#0a0f18] py-12 md:py-16">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

            {/* ── LEFT: Image Gallery ── */}
            <div className="space-y-4">
              <div
                className="relative w-full aspect-square rounded-2xl overflow-hidden group border border-white/[0.07]"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <AnimatePresence mode="wait">
                  {activeImage ? (
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={product.name}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.01 }}
                      transition={{ duration: 0.28 }}
                      className="w-full h-full object-contain p-6"
                    />
                  ) : (
                    <motion.div key="no-image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/10">
                      <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-white/20 font-body">Image coming soon</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {product.is_featured && (
                  <span className="absolute top-4 right-4 bg-brand-accent text-white text-[10px] font-bold font-body tracking-wider uppercase px-3 py-1.5 rounded-full z-10">✦ Featured</span>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                        activeImage === img ? "border-brand-primary shadow-md shadow-brand-primary/20 scale-105" : "border-white/10 hover:border-brand-primary/40"
                      }`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Mobile CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 lg:hidden pt-2">
                <Link href={inquiryUrl} className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold font-body py-3.5 rounded-xl hover:bg-brand-primary/90 transition-all hover:shadow-lg hover:shadow-brand-primary/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  Send Inquiry
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold font-body px-6 py-3.5 rounded-xl hover:bg-[#20bc5c] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.526 5.855L.092 23.093a.75.75 0 00.815.815l5.238-1.434A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.86 0-3.619-.476-5.147-1.313l-.37-.214-3.856 1.054 1.054-3.856-.214-.37A9.94 9.94 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

            {/* ── RIGHT: Details ── */}
            <div className="space-y-6">
              {/* Pills */}
              <div className="flex flex-wrap gap-2">
                {product.subcategory && (
                  <Link
                    href={`/products/${product.category_slug}/${subSlug}`}
                    className="text-xs font-bold font-body uppercase tracking-wide px-3 py-1.5 rounded-full bg-brand-primary/[0.1] text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors"
                  >
                    {product.subcategory}
                  </Link>
                )}
                {product.category_slug && (
                  <Link
                    href={`/products/${product.category_slug}`}
                    className="text-xs font-semibold font-body px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:border-white/25 hover:text-white/60 transition-colors"
                  >
                    {categoryName}
                  </Link>
                )}
              </div>

              {/* Product Name */}
              <h1 className="font-heading font-black text-white leading-tight" style={{ fontSize: "clamp(1.7rem, 3vw, 2.6rem)" }}>
                {product.name}
              </h1>

              {/* Brand & Model */}
              {(product.brand || product.model_number) && (
                <div className="flex flex-wrap items-center gap-5 font-body text-sm">
                  {product.brand && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/30">Brand</span>
                      <span className="font-bold text-white border border-white/10 bg-white/[0.05] px-2.5 py-1 rounded-lg">{product.brand}</span>
                    </div>
                  )}
                  {product.model_number && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/30">Model</span>
                      <code className="font-mono text-xs bg-brand-primary/[0.08] text-brand-primary px-2.5 py-1 rounded-lg border border-brand-primary/20 font-bold">{product.model_number}</code>
                    </div>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="w-14 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full" />

              {/* Description */}
              {product.description && (
                <p className="font-body text-white/50 leading-relaxed">{product.description}</p>
              )}

              {/* Specifications — dark table */}
              {specsEntries.length > 0 && (
                <div>
                  <h2 className="font-heading font-bold text-white text-base mb-3">Specifications</h2>
                  <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                    {specsEntries.map(([key, value], i) => (
                      <div
                        key={key}
                        className="grid grid-cols-5 text-sm font-body border-b border-white/[0.05] last:border-0"
                        style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)" }}
                      >
                        <div className="col-span-2 px-4 py-3 text-white/35 font-medium border-r border-white/[0.05]">{key}</div>
                        <div className="col-span-3 px-4 py-3 text-white/80 font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Desktop CTAs */}
              <div className="hidden lg:flex flex-col sm:flex-row gap-3 pt-2">
                <Link href={inquiryUrl} className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold font-body py-4 rounded-xl hover:bg-brand-primary/90 transition-all hover:shadow-xl hover:shadow-brand-primary/25 group">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  Send Inquiry
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold font-body px-7 py-4 rounded-xl hover:bg-[#20bc5c] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.526 5.855L.092 23.093a.75.75 0 00.815.815l5.238-1.434A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.86 0-3.619-.476-5.147-1.313l-.37-.214-3.856 1.054 1.054-3.856-.214-.37A9.94 9.94 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Products — dark ── */}
      {relatedProducts.length > 0 && (
        <section className="bg-brand-dark py-14 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-body text-brand-primary text-xs tracking-[0.2em] uppercase mb-1.5 flex items-center gap-2">
                  <span className="w-6 h-px bg-brand-primary/50" />
                  Same Category
                </p>
                <h2 className="font-heading font-bold text-white text-2xl">Related Products</h2>
              </div>
              <Link href={`/products/${product.category_slug}`} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold font-body text-brand-primary hover:gap-2.5 transition-all">
                View all in {categoryName}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((rp, i) => <RelatedCard key={rp.id} product={rp} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
