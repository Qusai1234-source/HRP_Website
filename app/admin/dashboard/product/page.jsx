"use client";
// ─── app/admin/dashboard/products/page.jsx ───────────────────────────────────
// Admin Products CRUD — mirrors categories page style (100% inline styles).
// Features: table, slide-in drawer, specs builder, image + gallery upload,
//           category dropdown, featured toggle, double-tap delete.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

/* ────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────── */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/* ────────────────────────────────────────────
   EMPTY FORM STATE
──────────────────────────────────────────── */
const EMPTY_FORM = {
  name: "",
  slug: "",
  category_slug: "",
  subcategory: "",
  description: "",
  brand: "",
  model_number: "",
  image_url: "",
  gallery_urls: [],
  specs: [],       // [{ key: "", value: "" }]
  is_featured: false,
  sort_order: 0,
};

/* ────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────── */
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Delete state
  const [deletePending, setDeletePending] = useState(null);
  const deleteTimer = useRef(null);

  // Image upload state
  const [imageUploading, setImageUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const imageInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  /* ── Fetch data ── */
  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("id, name, slug, category_slug, brand, is_featured, image_url, created_at, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("sort_order", { ascending: true });
    setCategories(data || []);
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /* ── Filtered list ── */
  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q);
    const matchCat = filterCat === "all" || p.category_slug === filterCat;
    return matchSearch && matchCat;
  });

  /* ── Drawer helpers ── */
  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSlugManual(false);
    setSaveError("");
    setDrawerOpen(true);
  }

  function openEdit(product) {
    // Fetch full product details for editing
    supabase
      .from("products")
      .select("*")
      .eq("id", product.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          category_slug: data.category_slug || "",
          subcategory: data.subcategory || "",
          description: data.description || "",
          brand: data.brand || "",
          model_number: data.model_number || "",
          image_url: data.image_url || "",
          gallery_urls: data.gallery_urls || [],
          specs: data.specs ? Object.entries(data.specs).map(([k, v]) => ({ key: k, value: String(v) })) : [],
          is_featured: data.is_featured || false,
          sort_order: data.sort_order || 0,
        });
        setEditingId(data.id);
        setSlugManual(true);
        setSaveError("");
        setDrawerOpen(true);
      });
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingId(null);
    setSaveError("");
  }

  /* ── Form field helpers ── */
  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(val) {
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug && slugManual ? prev.slug : slugify(val),
    }));
  }

  /* ── Specs builder ── */
  function addSpec() {
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] }));
  }

  function updateSpec(i, field, val) {
    setForm((prev) => {
      const specs = [...prev.specs];
      specs[i] = { ...specs[i], [field]: val };
      return { ...prev, specs };
    });
  }

  function removeSpec(i) {
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== i) }));
  }

  function moveSpec(i, dir) {
    setForm((prev) => {
      const specs = [...prev.specs];
      const j = i + dir;
      if (j < 0 || j >= specs.length) return prev;
      [specs[i], specs[j]] = [specs[j], specs[i]];
      return { ...prev, specs };
    });
  }

  /* ── Image upload ── */
  async function uploadImage(file, isGallery = false) {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    if (isGallery) setGalleryUploading(true);
    else setImageUploading(true);

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: false });

    if (error) {
      setSaveError("Image upload failed: " + error.message);
      if (isGallery) setGalleryUploading(false);
      else setImageUploading(false);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    if (isGallery) setGalleryUploading(false);
    else setImageUploading(false);

    return urlData.publicUrl;
  }

  async function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, false);
    if (url) setField("image_url", url);
    e.target.value = "";
  }

  async function handleGallerySelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = [];
    for (const file of files) {
      const url = await uploadImage(file, true);
      if (url) urls.push(url);
    }
    setForm((prev) => ({ ...prev, gallery_urls: [...(prev.gallery_urls || []), ...urls] }));
    e.target.value = "";
  }

  function removeGalleryImage(idx) {
    setForm((prev) => ({
      ...prev,
      gallery_urls: (prev.gallery_urls || []).filter((_, i) => i !== idx),
    }));
  }

  /* ── Save ── */
  async function handleSave() {
    setSaveError("");
    if (!form.name.trim()) { setSaveError("Product name is required."); return; }
    if (!form.slug.trim()) { setSaveError("Slug is required."); return; }
    if (!form.category_slug) { setSaveError("Please select a category."); return; }

    // Build specs JSONB
    const specs = {};
    form.specs.forEach(({ key, value }) => {
      if (key.trim()) specs[key.trim()] = value;
    });

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_slug: form.category_slug,
      subcategory: form.subcategory.trim() || null,
      description: form.description.trim() || null,
      brand: form.brand.trim() || null,
      model_number: form.model_number.trim() || null,
      image_url: form.image_url || null,
      gallery_urls: form.gallery_urls.length ? form.gallery_urls : null,
      specs: Object.keys(specs).length ? specs : null,
      is_featured: form.is_featured,
      sort_order: Number(form.sort_order) || 0,
    };

    setSaving(true);
    let error;
    if (editingId) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("products").insert([payload]));
    }
    setSaving(false);

    if (error) {
      if (error.code === "23505") setSaveError("A product with this slug already exists.");
      else setSaveError(error.message);
      return;
    }

    closeDrawer();
    fetchProducts();
  }

  /* ── Delete ── */
  function handleDelete(id) {
    if (deletePending === id) {
      clearTimeout(deleteTimer.current);
      setDeletePending(null);
      supabase.from("products").delete().eq("id", id).then(() => fetchProducts());
    } else {
      setDeletePending(id);
      deleteTimer.current = setTimeout(() => setDeletePending(null), 3000);
    }
  }

  /* ────────────────────────────────────────────
     STYLES
  ──────────────────────────────────────────── */
  const S = {
    page: { padding: "28px 28px 48px", fontFamily: "'Inter', sans-serif" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
    heading: { fontSize: 22, fontWeight: 700, color: "#1A2533", margin: 0 },
    subheading: { fontSize: 13, color: "#888", marginTop: 3 },
    btnPrimary: {
      background: "#2B7EA1", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px",
      fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
    },
    searchRow: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" },
    searchInput: {
      flex: 1, minWidth: 200, padding: "9px 14px 9px 36px", border: "1px solid #E5E7EB",
      borderRadius: 9, fontSize: 13, outline: "none", background: "#fff",
    },
    select: {
      padding: "9px 14px", border: "1px solid #E5E7EB", borderRadius: 9,
      fontSize: 13, outline: "none", background: "#fff", cursor: "pointer",
    },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: { padding: "11px 14px", textAlign: "left", fontWeight: 600, color: "#555", borderBottom: "1px solid #F0F0F0", background: "#FAFAFA" },
    td: { padding: "13px 14px", borderBottom: "1px solid #F7F7F7", verticalAlign: "middle" },
    badge: (color) => ({
      display: "inline-block", padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: color === "green" ? "#DCFCE7" : color === "amber" ? "#FEF9C3" : "#F3F4F6",
      color: color === "green" ? "#15803D" : color === "amber" ? "#92400E" : "#555",
    }),
    actionBtn: (variant) => ({
      padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
      cursor: "pointer", border: "none",
      background: variant === "danger" ? "#FEE2E2" : "#EFF6FF",
      color: variant === "danger" ? "#DC2626" : "#2563EB",
    }),

    // Drawer
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)", zIndex: 1000 },
    drawer: {
      position: "fixed", right: 0, top: 0, bottom: 0, width: "min(640px, 100vw)",
      background: "#fff", boxShadow: "-4px 0 40px rgba(0,0,0,0.15)", zIndex: 1001,
      overflowY: "auto", display: "flex", flexDirection: "column",
    },
    drawerHead: {
      padding: "20px 24px", borderBottom: "1px solid #F0F0F0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, background: "#fff", zIndex: 10,
    },
    drawerBody: { padding: "24px", flex: 1 },
    label: { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 },
    input: {
      width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 9,
      fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    },
    textarea: {
      width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 9,
      fontSize: 13, outline: "none", resize: "vertical", minHeight: 90,
      boxSizing: "border-box", fontFamily: "inherit",
    },
    formGroup: { marginBottom: 18 },
    formRow2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 },
    drawerFoot: {
      padding: "16px 24px", borderTop: "1px solid #F0F0F0",
      display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
      position: "sticky", bottom: 0, background: "#fff",
    },
    btnCancel: {
      padding: "9px 18px", borderRadius: 9, border: "1px solid #E5E7EB",
      fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#fff", color: "#555",
    },
    btnSave: {
      padding: "9px 22px", borderRadius: 9, border: "none",
      fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#2B7EA1", color: "#fff",
    },
  };

  /* ────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────── */
  const catName = (slug) => categories.find((c) => c.slug === slug)?.name || slug;

  return (
    <div style={S.page}>
      {/* ── Header ── */}
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Products</h1>
          <p style={S.subheading}>{products.length} product{products.length !== 1 ? "s" : ""} total</p>
        </div>
        <button style={S.btnPrimary} onClick={openAdd}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* ── Search + category filter ── */}
      <div style={S.searchRow}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#aaa" }}
            width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            style={S.searchInput}
            placeholder="Search by name, brand, or slug…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select style={S.select} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0F0F0", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 }}>Loading products…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
              {searchQuery || filterCat !== "all" ? "No products match your filters." : "No products yet. Click \"Add Product\" to get started."}
            </p>
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Product</th>
                <th style={S.th}>Category</th>
                <th style={S.th}>Brand</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Added</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} style={{ transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}>

                  {/* Product name + thumbnail */}
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 10, overflow: "hidden",
                        background: "#F5F5F5", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {product.image_url ? (
                          <img src={product.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <svg width="18" height="18" fill="none" stroke="#DDD" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1A2533", marginBottom: 2 }}>{product.name}</div>
                        <div style={{ fontSize: 11, color: "#AAA", fontFamily: "monospace" }}>{product.slug}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={S.td}>
                    <span style={{
                      display: "inline-block", padding: "4px 10px", borderRadius: 20,
                      fontSize: 11, fontWeight: 600, background: "#EFF6FF", color: "#2563EB",
                    }}>
                      {catName(product.category_slug)}
                    </span>
                  </td>

                  {/* Brand */}
                  <td style={{ ...S.td, color: "#555" }}>{product.brand || "—"}</td>

                  {/* Featured */}
                  <td style={S.td}>
                    {product.is_featured ? (
                      <span style={S.badge("green")}>Featured</span>
                    ) : (
                      <span style={S.badge("none")}>Standard</span>
                    )}
                  </td>

                  {/* Date */}
                  <td style={{ ...S.td, color: "#999", fontSize: 12 }}>{timeAgo(product.created_at)}</td>

                  {/* Actions */}
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 7 }}>
                      <button style={S.actionBtn("edit")} onClick={() => openEdit(product)}>Edit</button>
                      <button
                        style={{
                          ...S.actionBtn("danger"),
                          background: deletePending === product.id ? "#DC2626" : "#FEE2E2",
                          color: deletePending === product.id ? "#fff" : "#DC2626",
                        }}
                        onClick={() => handleDelete(product.id)}
                      >
                        {deletePending === product.id ? "Confirm?" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          DRAWER — ADD / EDIT PRODUCT
      ═══════════════════════════════════════════ */}
      {drawerOpen && (
        <>
          <div style={S.overlay} onClick={closeDrawer} />
          <div style={S.drawer}>

            {/* Drawer header */}
            <div style={S.drawerHead}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A2533" }}>
                  {editingId ? "Edit Product" : "Add Product"}
                </div>
                <div style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>
                  {editingId ? "Update product details" : "Add a new product to the catalogue"}
                </div>
              </div>
              <button
                onClick={closeDrawer}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer body */}
            <div style={S.drawerBody}>

              {/* Error */}
              {saveError && (
                <div style={{
                  background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 9,
                  padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 18,
                }}>
                  {saveError}
                </div>
              )}

              {/* Name + Slug */}
              <div style={S.formGroup}>
                <label style={S.label}>Product Name *</label>
                <input
                  style={S.input}
                  placeholder="e.g. Double Acting Pneumatic Cylinder"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Slug *</label>
                <input
                  style={{ ...S.input, fontFamily: "monospace", fontSize: 12 }}
                  placeholder="auto-generated-from-name"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); setField("slug", slugify(e.target.value)); }}
                />
                <div style={{ fontSize: 11, color: "#AAA", marginTop: 4 }}>
                  URL: /products/<strong>{form.slug || "slug"}</strong>
                </div>
              </div>

              {/* Category + Subcategory */}
              <div style={S.formRow2}>
                <div>
                  <label style={S.label}>Category *</label>
                  <select
                    style={{ ...S.select, width: "100%", boxSizing: "border-box" }}
                    value={form.category_slug}
                    onChange={(e) => setField("category_slug", e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Subcategory</label>
                  <input
                    style={S.input}
                    placeholder="e.g. Cylinders"
                    value={form.subcategory}
                    onChange={(e) => setField("subcategory", e.target.value)}
                  />
                </div>
              </div>

              {/* Brand + Model Number */}
              <div style={S.formRow2}>
                <div>
                  <label style={S.label}>Brand</label>
                  <input
                    style={S.input}
                    placeholder="e.g. SMC, Festo"
                    value={form.brand}
                    onChange={(e) => setField("brand", e.target.value)}
                  />
                </div>
                <div>
                  <label style={S.label}>Model Number</label>
                  <input
                    style={{ ...S.input, fontFamily: "monospace", fontSize: 12 }}
                    placeholder="e.g. CDJ2B16-100"
                    value={form.model_number}
                    onChange={(e) => setField("model_number", e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={S.formGroup}>
                <label style={S.label}>Description</label>
                <textarea
                  style={S.textarea}
                  placeholder="Brief product description for the catalogue listing…"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </div>

              {/* ── SPECIFICATIONS BUILDER ── */}
              <div style={S.formGroup}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ ...S.label, margin: 0 }}>Specifications</label>
                  <button
                    onClick={addSpec}
                    style={{
                      background: "#EFF6FF", color: "#2B7EA1", border: "1px solid #BFDBFE",
                      borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    + Add Row
                  </button>
                </div>

                {form.specs.length === 0 ? (
                  <div style={{
                    border: "1px dashed #E5E7EB", borderRadius: 10, padding: "20px",
                    textAlign: "center", fontSize: 12, color: "#BBB",
                  }}>
                    No specs yet. Click "Add Row" to add key-value pairs like "Bore Size" → "32 mm"
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {form.specs.map((spec, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          style={{ ...S.input, flex: 1 }}
                          placeholder="Key (e.g. Bore Size)"
                          value={spec.key}
                          onChange={(e) => updateSpec(i, "key", e.target.value)}
                        />
                        <input
                          style={{ ...S.input, flex: 1 }}
                          placeholder="Value (e.g. 32 mm)"
                          value={spec.value}
                          onChange={(e) => updateSpec(i, "value", e.target.value)}
                        />
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button onClick={() => moveSpec(i, -1)}
                            style={{ background: "#F5F5F5", border: "none", borderRadius: 5, width: 24, height: 22, cursor: "pointer", fontSize: 10 }}>
                            ▲
                          </button>
                          <button onClick={() => moveSpec(i, 1)}
                            style={{ background: "#F5F5F5", border: "none", borderRadius: 5, width: 24, height: 22, cursor: "pointer", fontSize: 10 }}>
                            ▼
                          </button>
                        </div>
                        <button
                          onClick={() => removeSpec(i)}
                          style={{ background: "#FEE2E2", border: "none", borderRadius: 7, width: 32, height: 36, cursor: "pointer", color: "#DC2626", fontSize: 14, flexShrink: 0 }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── MAIN IMAGE ── */}
              <div style={S.formGroup}>
                <label style={S.label}>Main Image</label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  style={{
                    border: "2px dashed #E5E7EB", borderRadius: 12, padding: "20px",
                    textAlign: "center", cursor: "pointer", transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2B7EA1")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                >
                  {form.image_url ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img
                        src={form.image_url}
                        alt="Preview"
                        style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10 }}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); setField("image_url", ""); }}
                        style={{
                          position: "absolute", top: -8, right: -8, width: 22, height: 22,
                          borderRadius: "50%", background: "#DC2626", border: "none",
                          color: "#fff", fontSize: 12, cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : imageUploading ? (
                    <div style={{ color: "#AAA", fontSize: 13 }}>Uploading…</div>
                  ) : (
                    <div>
                      <svg width="28" height="28" fill="none" stroke="#CCC" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 8px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div style={{ fontSize: 13, color: "#AAA" }}>Click to upload main image</div>
                      <div style={{ fontSize: 11, color: "#CCC", marginTop: 3 }}>JPG, PNG, WebP — max 5MB</div>
                    </div>
                  )}
                </div>
                <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />

                {/* Manual URL fallback */}
                <input
                  style={{ ...S.input, marginTop: 8, fontSize: 11, fontFamily: "monospace" }}
                  placeholder="Or paste image URL…"
                  value={form.image_url}
                  onChange={(e) => setField("image_url", e.target.value)}
                />
              </div>

              {/* ── GALLERY IMAGES ── */}
              <div style={S.formGroup}>
                <label style={S.label}>Gallery Images (optional)</label>

                {/* Existing gallery */}
                {form.gallery_urls?.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    {form.gallery_urls.map((url, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img
                          src={url}
                          alt={`Gallery ${i + 1}`}
                          style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid #EEE" }}
                        />
                        <button
                          onClick={() => removeGalleryImage(i)}
                          style={{
                            position: "absolute", top: -6, right: -6, width: 18, height: 18,
                            borderRadius: "50%", background: "#DC2626", border: "none",
                            color: "#fff", fontSize: 11, cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => galleryInputRef.current?.click()}
                  style={{
                    background: "#F5F5F5", border: "1px solid #E5E7EB", borderRadius: 9,
                    padding: "9px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#555",
                  }}
                >
                  {galleryUploading ? "Uploading…" : "+ Add Gallery Images"}
                </button>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleGallerySelect}
                />
              </div>

              {/* ── Sort Order + Featured ── */}
              <div style={S.formRow2}>
                <div>
                  <label style={S.label}>Sort Order</label>
                  <input
                    style={S.input}
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(e) => setField("sort_order", e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
                    <div
                      onClick={() => setField("is_featured", !form.is_featured)}
                      style={{
                        width: 44, height: 24, borderRadius: 12, position: "relative",
                        background: form.is_featured ? "#8DC63F" : "#E5E7EB", transition: "background 0.2s",
                        cursor: "pointer", flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: "absolute", top: 2, left: form.is_featured ? 22 : 2,
                        width: 20, height: 20, borderRadius: "50%", background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s",
                      }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A2533" }}>Featured</div>
                      <div style={{ fontSize: 11, color: "#AAA" }}>Show on homepage</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div style={S.drawerFoot}>
              <button style={S.btnCancel} onClick={closeDrawer}>Cancel</button>
              <button style={S.btnSave} onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}