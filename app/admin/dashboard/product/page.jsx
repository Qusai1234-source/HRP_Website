"use client";
// ─── app/admin/dashboard/products/page.jsx ───────────────────────────────────
// Complete CRUD: category tabs → subcategory chips → product table
// Drawer: name/slug, category, subcategory (from DB), brand/model,
//         description, image upload, gallery, specs builder, featured toggle
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/lib/supabase";
import * as XLSX from "xlsx";

/* ─── helpers ───────────────────────────────────────────────────────────────── */
function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const EMPTY = {
  name: "", slug: "", category_slug: "", subcategory_id: "",
  subcategory_name: "", description: "", brand: "", model_number: "",
  image_url: "", gallery_urls: [], specs: [], is_featured: false, sort_order: 0,
};

/* ─── S (styles object) — DARK ADMIN THEME ──────────────────────────────────── */
const S = {
  page: { padding: "28px 28px 60px", fontFamily: "'Inter',sans-serif", minHeight: "100vh" },
  h1: { fontSize: 22, fontWeight: 700, color: "#ffffff", margin: 0 },
  sub: { fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 3 },
  row: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  btnPri: { background: "#2B7EA1", color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  btnSec: { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "rgba(255,255,255,0.06)", color: "#fff" },
  select: { padding: "9px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, fontSize: 13, outline: "none", background: "#1a2535", color: "#fff", cursor: "pointer", fontFamily: "inherit" },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { padding: "11px 14px", textAlign: "left", fontWeight: 600, color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" },
  td: { padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "middle" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 1000 },
  drawer: { position: "fixed", right: 0, top: 0, bottom: 0, width: "min(660px,100vw)", background: "#0E1520", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "-8px 0 48px rgba(0,0,0,0.5)", zIndex: 1001, overflowY: "auto", display: "flex", flexDirection: "column" },
  dHead: { padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0E1520", zIndex: 10 },
  dBody: { padding: "24px", flex: 1 },
  dFoot: { padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, position: "sticky", bottom: 0, background: "#0E1520" },
  fg: { marginBottom: 18 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 },
  chip: (active) => ({
    padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    cursor: "pointer", border: active ? "1px solid #2B7EA1" : "1px solid rgba(255,255,255,0.1)",
    background: active ? "#2B7EA1" : "rgba(255,255,255,0.04)", color: active ? "#fff" : "rgba(255,255,255,0.5)",
    transition: "all 0.15s", whiteSpace: "nowrap",
  }),
  badge: (color) => ({
    display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600,
    background: color === "green" ? "rgba(76,175,80,0.15)" : color === "blue" ? "rgba(43,126,161,0.15)" : "rgba(255,255,255,0.06)",
    color: color === "green" ? "#4CAF50" : color === "blue" ? "#2B7EA1" : "rgba(255,255,255,0.4)",
    border: color === "green" ? "1px solid rgba(76,175,80,0.3)" : color === "blue" ? "1px solid rgba(43,126,161,0.3)" : "1px solid rgba(255,255,255,0.1)",
  }),
};

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════════ */
export default function AdminProductsPage() {
  /* ── data ── */
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // all subcats
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── filters ── */
  const [activeCat, setActiveCat] = useState("all");
  const [activeSubcat, setActiveSubcat] = useState("all");
  const [search, setSearch] = useState("");

  /* ── drawer ── */
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");

  /* ── subcat drawer ── */
  const [subcatDrawerOpen, setSubcatDrawerOpen] = useState(false);
  const [subcatForm, setSubcatForm] = useState({ name: "", category_slug: "" });
  const [subcatSaving, setSubcatSaving] = useState(false);
  const [subcatErr, setSubcatErr] = useState("");
  const [editSubcatId, setEditSubcatId] = useState(null);

  /* ── delete ── */
  const [deletePending, setDeletePending] = useState(null);
  const delTimer = useRef(null);

  /* ── image upload ── */
  const [imgUploading, setImgUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const imgRef = useRef(null);
  const galleryRef = useRef(null);

  /* ── specs import ── */
  const [specImport, setSpecImport] = useState(null); // { rows: [{key,value}], source: 'csv'|'excel'|'image' }
  const [specImporting, setSpecImporting] = useState(false); // image scan in progress
  const [specImportErr, setSpecImportErr] = useState("");
  const csvSpecRef = useRef(null);
  const xlsxSpecRef = useRef(null);
  const imgSpecRef = useRef(null);

  /* ─── fetch all data ─── */
  async function fetchAll() {
    setLoading(true);
    const [{ data: cats }, { data: subcats }, { data: prods }] = await Promise.all([
      supabase.from("categories").select("id,name,slug").order("sort_order"),
      supabase.from("subcategories").select("id,name,category_slug").order("name"),
      supabase.from("products").select("id,name,slug,category_slug,subcategory_id,subcategory_name,brand,is_featured,image_url,created_at,sort_order").order("sort_order").order("created_at", { ascending: false }),
    ]);
    setCategories(cats || []);
    setSubcategories(subcats || []);
    setProducts(prods || []);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  /* ─── derived data ─── */
  const filteredSubcats = subcategories.filter((sc) => activeCat === "all" || sc.category_slug === activeCat);

  const filtered = products.filter((p) => {
    const catMatch = activeCat === "all" || p.category_slug === activeCat;
    const subcatMatch = activeSubcat === "all" || p.subcategory_id === activeSubcat;
    const q = search.toLowerCase();
    const searchMatch = !q || p.name.toLowerCase().includes(q) || (p.brand || "").toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    return catMatch && subcatMatch && searchMatch;
  });

  const catName = (slug) => categories.find((c) => c.slug === slug)?.name || slug;

  /* ─── drawer helpers ─── */
  function openAdd() {
    setForm({ ...EMPTY, category_slug: activeCat === "all" ? "" : activeCat });
    setEditId(null); setSlugManual(false); setSaveErr(""); setOpen(true);
  }

  async function openEdit(prod) {
    const { data } = await supabase.from("products").select("*").eq("id", prod.id).single();
    if (!data) return;
    setForm({
      name: data.name || "", slug: data.slug || "", category_slug: data.category_slug || "",
      subcategory_id: data.subcategory_id || "", subcategory_name: data.subcategory_name || "",
      description: data.description || "", brand: data.brand || "", model_number: data.model_number || "",
      image_url: data.image_url || "", gallery_urls: data.gallery_urls || [],
      specs: data.specs ? Object.entries(data.specs).map(([k, v]) => ({ key: k, value: String(v) })) : [],
      is_featured: data.is_featured || false, sort_order: data.sort_order || 0,
    });
    setEditId(data.id); setSlugManual(true); setSaveErr(""); setOpen(true);
  }

  function setF(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  /* ─── subcategory picker inside drawer ─── */
  const drawerSubcats = subcategories.filter((sc) => sc.category_slug === form.category_slug);

  function handleCatChange(slug) {
    setF("category_slug", slug);
    setF("subcategory_id", "");
    setF("subcategory_name", "");
  }

  function handleSubcatChange(id) {
    const sc = subcategories.find((s) => s.id === id);
    setF("subcategory_id", id);
    setF("subcategory_name", sc?.name || "");
  }

  /* ─── save product ─── */
  async function handleSave() {
    setSaveErr("");
    if (!form.name.trim()) { setSaveErr("Product name is required."); return; }
    if (!form.slug.trim()) { setSaveErr("Slug is required."); return; }
    if (!form.category_slug) { setSaveErr("Please select a category."); return; }

    const specs = {};
    form.specs.forEach(({ key, value }) => { if (key.trim()) specs[key.trim()] = value; });

    const payload = {
      name: form.name.trim(), slug: form.slug.trim(), category_slug: form.category_slug,
      subcategory_id: form.subcategory_id || null, subcategory_name: form.subcategory_name || null,
      description: form.description.trim() || null, brand: form.brand.trim() || null,
      model_number: form.model_number.trim() || null, image_url: form.image_url || null,
      gallery_urls: form.gallery_urls.length ? form.gallery_urls : null,
      specs: Object.keys(specs).length ? specs : null,
      is_featured: form.is_featured, sort_order: Number(form.sort_order) || 0,
    };

    setSaving(true);
    const { error } = editId
      ? await supabase.from("products").update(payload).eq("id", editId)
      : await supabase.from("products").insert([payload]);
    setSaving(false);

    if (error) { setSaveErr(error.code === "23505" ? "A product with this slug already exists." : error.message); return; }
    setOpen(false); fetchAll();
  }

  /* ─── delete product ─── */
  function handleDelete(id) {
    if (deletePending === id) {
      clearTimeout(delTimer.current); setDeletePending(null);
      supabase.from("products").delete().eq("id", id).then(() => fetchAll());
    } else {
      setDeletePending(id);
      delTimer.current = setTimeout(() => setDeletePending(null), 3000);
    }
  }

  /* ─── image upload ─── */
  async function uploadImg(file, isGallery = false) {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    if (isGallery) setGalleryUploading(true); else setImgUploading(true);
    const { data, error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { setSaveErr("Upload failed: " + error.message); if (isGallery) setGalleryUploading(false); else setImgUploading(false); return null; }
    const { data: u } = supabase.storage.from("product-images").getPublicUrl(data.path);
    if (isGallery) setGalleryUploading(false); else setImgUploading(false);
    return u.publicUrl;
  }

  async function handleImgSelect(e) {
    const file = e.target.files?.[0]; if (!file) return;
    const url = await uploadImg(file); if (url) setF("image_url", url); e.target.value = "";
  }

  async function handleGallerySelect(e) {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    for (const file of files) { const url = await uploadImg(file, true); if (url) setForm((p) => ({ ...p, gallery_urls: [...p.gallery_urls, url] })); }
    e.target.value = "";
  }

  /* ─── specs ─── */
  const addSpec = () => setForm((p) => ({ ...p, specs: [...p.specs, { key: "", value: "" }] }));
  const updateSpec = (i, field, val) => setForm((p) => { const s = [...p.specs]; s[i] = { ...s[i], [field]: val }; return { ...p, specs: s }; });
  const removeSpec = (i) => setForm((p) => ({ ...p, specs: p.specs.filter((_, idx) => idx !== i) }));
  const moveSpec = (i, dir) => setForm((p) => { const s = [...p.specs]; const j = i + dir; if (j < 0 || j >= s.length) return p;[s[i], s[j]] = [s[j], s[i]]; return { ...p, specs: s }; });

  /* ─── specs import helpers ─── */

  // Commit the previewed rows into the form
  function commitSpecImport(mode) {
    if (!specImport) return;
    const rows = specImport.rows.filter((r) => r.key.trim());
    setForm((p) => ({
      ...p,
      specs: mode === "replace" ? rows : [...p.specs, ...rows],
    }));
    setSpecImport(null);
    setSpecImportErr("");
  }

  // CSV / TSV parser — handles comma, semicolon, tab delimiters
  function parseCSVText(text) {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    // Auto-detect delimiter from first line
    const first = lines[0] || "";
    const delim = first.includes("\t") ? "\t" : first.includes(";") ? ";" : ",";

    return lines
      .map((line) => {
        // Handle quoted fields
        const cols = [];
        let cur = "";
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if ((ch === '"' || ch === "'") && !inQuote) { inQuote = ch; continue; }
          if (ch === inQuote) { inQuote = false; continue; }
          if (ch === delim && !inQuote) { cols.push(cur.trim()); cur = ""; continue; }
          cur += ch;
        }
        cols.push(cur.trim());
        return cols;
      })
      .filter((cols) => cols.length >= 2 && cols[0])
      .map(([key, value]) => ({ key: key.trim(), value: (value || "").trim() }));
  }

  // CSV file handler
  function handleCSVImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setSpecImportErr("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = parseCSVText(ev.target.result);
        if (!rows.length) { setSpecImportErr("No valid rows found. Make sure the file has two columns: Key and Value."); return; }
        setSpecImport({ rows, source: "csv" });
      } catch {
        setSpecImportErr("Could not parse the CSV file.");
      }
    };
    reader.readAsText(file);
  }

  // Excel file handler — uses xlsx package
  function handleExcelImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setSpecImportErr("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // sheet_to_json with header:1 gives [[col1,col2],...] rows
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" })
          .filter((row) => row.length >= 2 && String(row[0]).trim())
          .map((row) => ({ key: String(row[0]).trim(), value: String(row[1] ?? "").trim() }));
        if (!rows.length) { setSpecImportErr("No valid rows found. Make sure column A = Key, column B = Value."); return; }
        setSpecImport({ rows, source: "excel" });
      } catch {
        setSpecImportErr("Could not read the Excel file. Make sure it's a valid .xlsx or .xls file.");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Image handler — sends to /api/extract-specs (Anthropic vision)
  async function handleImageImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setSpecImportErr("");
    setSpecImporting(true);

    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = (ev) => {
          // ev.target.result is "data:image/jpeg;base64,XXXX"
          const b64 = ev.target.result.split(",")[1];
          res(b64);
        };
        r.onerror = rej;
        r.readAsDataURL(file);
      });

      const resp = await fetch("/api/extract-specs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType: file.type }),
      });

      const json = await resp.json();
      if (!resp.ok || json.error) {
        setSpecImportErr(json.error || "Image scan failed.");
        setSpecImporting(false);
        return;
      }

      if (!json.specs?.length) {
        setSpecImportErr("No specifications could be extracted from this image. Try a clearer photo of a spec table.");
        setSpecImporting(false);
        return;
      }

      setSpecImport({ rows: json.specs, source: "image" });
    } catch {
      setSpecImportErr("Failed to reach the image scan service. Check your network.");
    }
    setSpecImporting(false);
  }

  /* ─── subcat management ─── */
  function openAddSubcat() {
    setSubcatForm({ name: "", category_slug: activeCat === "all" ? (categories[0]?.slug || "") : activeCat });
    setEditSubcatId(null); setSubcatErr(""); setSubcatDrawerOpen(true);
  }

  function openEditSubcat(sc) {
    setSubcatForm({ name: sc.name, category_slug: sc.category_slug });
    setEditSubcatId(sc.id); setSubcatErr(""); setSubcatDrawerOpen(true);
  }

  async function saveSubcat() {
    if (!subcatForm.name.trim()) { setSubcatErr("Name is required."); return; }
    if (!subcatForm.category_slug) { setSubcatErr("Category is required."); return; }
    setSubcatSaving(true);
    const payload = { name: subcatForm.name.trim(), category_slug: subcatForm.category_slug };
    const { error } = editSubcatId
      ? await supabase.from("subcategories").update(payload).eq("id", editSubcatId)
      : await supabase.from("subcategories").insert([payload]);
    setSubcatSaving(false);
    if (error) { setSubcatErr(error.message); return; }
    setSubcatDrawerOpen(false); fetchAll();
  }

  async function deleteSubcat(id) {
    await supabase.from("subcategories").delete().eq("id", id);
    fetchAll();
  }

  /* ────────────────────────────────────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────────────────────────────────────── */
  return (
    <div style={S.page}>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={S.h1}>Products</h1>
          <p style={S.sub}>{products.length} total &nbsp;·&nbsp; {filtered.length} shown</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ ...S.btnSec, fontSize: 12 }} onClick={openAddSubcat}>
            + Subcategory
          </button>
          <button style={S.btnPri} onClick={openAdd}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Product
          </button>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 0, overflowX: "auto" }}>
        {[{ slug: "all", name: "All" }, ...categories].map((cat) => {
          const isActive = activeCat === cat.slug;
          const count = cat.slug === "all" ? products.length : products.filter((p) => p.category_slug === cat.slug).length;
          return (
            <button
              key={cat.slug}
              onClick={() => { setActiveCat(cat.slug); setActiveSubcat("all"); }}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: 600, border: "none", background: "none",
                color: isActive ? "#2B7EA1" : "rgba(255,255,255,0.4)", cursor: "pointer", whiteSpace: "nowrap",
                borderBottom: isActive ? "2.5px solid #2B7EA1" : "2.5px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {cat.name}
              <span style={{ marginLeft: 6, fontSize: 11, padding: "1px 6px", borderRadius: 20, background: isActive ? "#2B7EA1" : "rgba(255,255,255,0.07)", color: isActive ? "#fff" : "rgba(255,255,255,0.35)" }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Subcategory chips (only when a category is selected) ── */}
      {activeCat !== "all" && (
        <div style={{ display: "flex", gap: 8, padding: "12px 0", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 0 }}>
          <button style={S.chip(activeSubcat === "all")} onClick={() => setActiveSubcat("all")}>All subcategories</button>
          {filteredSubcats.map((sc) => (
            <div key={sc.id} style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <button style={S.chip(activeSubcat === sc.id)} onClick={() => setActiveSubcat(activeSubcat === sc.id ? "all" : sc.id)}>
                {sc.name}
                <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.7 }}>
                  {products.filter((p) => p.subcategory_id === sc.id).length}
                </span>
              </button>
              <button
                onClick={() => openEditSubcat(sc)}
                title="Edit subcategory"
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", padding: "0 2px", fontSize: 11 }}
              >
                ✎
              </button>
            </div>
          ))}
          {filteredSubcats.length === 0 && (
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", alignSelf: "center" }}>No subcategories yet — click "+ Subcategory" to add.</span>
          )}
        </div>
      )}

      {/* ── Search ── */}
      <div style={{ padding: "12px 0", marginBottom: 4 }}>
        <div style={{ position: "relative", maxWidth: 340 }}>
          <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#AAA" }} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            style={{ ...S.input, paddingLeft: 34, width: 340, boxSizing: "border-box" }}
            placeholder="Search name, brand or slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#CCC" }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", border: "2.5px solid #2B7EA1", borderTopColor: "transparent", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, margin: 0 }}>Loading…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, margin: 0 }}>
              {search ? `No products match "${search}"` : "No products in this view. Click \"Add Product\" to get started."}
            </p>
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Product</th>
                <th style={S.th}>Category</th>
                <th style={S.th}>Subcategory</th>
                <th style={S.th}>Brand</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Added</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod, idx) => (
                <tr key={prod.id}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(43,126,161,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)")}
                  style={{ transition: "background 0.12s", background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)" }}
                >
                  {/* Name + thumb */}
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {prod.image_url ? (
                          <img src={prod.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 2, maxWidth: 200 }}>{prod.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{prod.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge("blue")}>{catName(prod.category_slug)}</span>
                  </td>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{prod.subcategory_name || "—"}</td>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{prod.brand || "—"}</td>
                  <td style={S.td}>
                    {prod.is_featured ? <span style={S.badge("green")}>Featured</span> : <span style={S.badge("none")}>Standard</span>}
                  </td>
                  <td style={{ ...S.td, color: "rgba(255,255,255,0.25)", fontSize: 12 }}>{timeAgo(prod.created_at)}</td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "5px 11px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid rgba(43,126,161,0.3)", background: "rgba(43,126,161,0.12)", color: "#2B7EA1" }} onClick={() => openEdit(prod)}>Edit</button>
                      <button
                        style={{ padding: "5px 11px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: deletePending === prod.id ? "1px solid #ef4444" : "1px solid rgba(239,68,68,0.25)", background: deletePending === prod.id ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.08)", color: "#ef4444", transition: "all 0.2s" }}
                        onClick={() => handleDelete(prod.id)}
                      >
                        {deletePending === prod.id ? "Confirm?" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRODUCT DRAWER
      ═══════════════════════════════════════════════════════════════════════ */}
      {open && (
        <>
          <div style={S.overlay} onClick={() => setOpen(false)} />
          <div style={S.drawer}>

            {/* Header */}
            <div style={S.dHead}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{editId ? "Edit Product" : "Add Product"}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{editId ? "Update product details" : "Add a new product to the catalogue"}</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Body */}
            <div style={S.dBody}>
              {saveErr && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 18 }}>{saveErr}</div>
              )}

              {/* Name */}
              <div style={S.fg}>
                <label style={S.label}>Product Name *</label>
                <input style={S.input} placeholder="e.g. Double Acting Pneumatic Cylinder" value={form.name}
                  onChange={(e) => { const v = e.target.value; setForm((p) => ({ ...p, name: v, slug: slugManual ? p.slug : slugify(v) })); }} />
              </div>

              {/* Slug */}
              <div style={S.fg}>
                <label style={S.label}>URL Slug *</label>
                <input style={{ ...S.input, fontFamily: "monospace", fontSize: 12 }} placeholder="auto-generated" value={form.slug}
                  onChange={(e) => { setSlugManual(true); setF("slug", slugify(e.target.value)); }} />
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>URL: /products/item/<strong style={{ color: "rgba(255,255,255,0.5)" }}>{form.slug || "slug"}</strong></div>
              </div>

              {/* Category + Subcategory */}
              <div style={S.row2}>
                <div>
                  <label style={S.label}>Category *</label>
                  <select style={{ ...S.select, width: "100%", boxSizing: "border-box" }} value={form.category_slug} onChange={(e) => handleCatChange(e.target.value)}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>
                    Subcategory
                    {form.category_slug && (
                      <button
                        onClick={() => { setSubcatForm({ name: "", category_slug: form.category_slug }); setEditSubcatId(null); setSubcatErr(""); setSubcatDrawerOpen(true); }}
                        style={{ marginLeft: 8, fontSize: 10, color: "#2B7EA1", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                      >+ New</button>
                    )}
                  </label>
                  <select
                    style={{ ...S.select, width: "100%", boxSizing: "border-box" }}
                    value={form.subcategory_id}
                    onChange={(e) => handleSubcatChange(e.target.value)}
                    disabled={!form.category_slug}
                  >
                    <option value="">None</option>
                    {drawerSubcats.map((sc) => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                  </select>
                  {form.category_slug && drawerSubcats.length === 0 && (
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>No subcategories yet. Click "+ New" above.</div>
                  )}
                </div>
              </div>

              {/* Brand + Model */}
              <div style={S.row2}>
                <div>
                  <label style={S.label}>Brand</label>
                  <input style={S.input} placeholder="e.g. SMC, Festo, Parker" value={form.brand} onChange={(e) => setF("brand", e.target.value)} />
                </div>
                <div>
                  <label style={S.label}>Model Number</label>
                  <input style={{ ...S.input, fontFamily: "monospace", fontSize: 12 }} placeholder="e.g. CDJ2B16-100" value={form.model_number} onChange={(e) => setF("model_number", e.target.value)} />
                </div>
              </div>

              {/* Description */}
              <div style={S.fg}>
                <label style={S.label}>Description</label>
                <textarea style={{ ...S.input, resize: "vertical", minHeight: 80 }} placeholder="Brief product description…" value={form.description} onChange={(e) => setF("description", e.target.value)} />
              </div>

              {/* ── Specs Builder ── */}
              <div style={S.fg}>

                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                  <label style={{ ...S.label, margin: 0 }}>Specifications</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>

                    {/* CSV import */}
                    <button
                      onClick={() => { setSpecImport(null); setSpecImportErr(""); csvSpecRef.current?.click(); }}
                      title="Import from CSV or TSV file"
                      style={{ background: "rgba(141,198,63,0.1)", color: "#8DC63F", border: "1px solid rgba(141,198,63,0.3)", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      CSV
                    </button>

                    {/* Excel import */}
                    <button
                      onClick={() => { setSpecImport(null); setSpecImportErr(""); xlsxSpecRef.current?.click(); }}
                      title="Import from Excel (.xlsx / .xls)"
                      style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
                      Excel
                    </button>

                    {/* Image scan */}
                    <button
                      onClick={() => { setSpecImport(null); setSpecImportErr(""); imgSpecRef.current?.click(); }}
                      disabled={specImporting}
                      title="Scan a datasheet image with AI"
                      style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: specImporting ? "default" : "pointer", opacity: specImporting ? 0.7 : 1, display: "flex", alignItems: "center", gap: 5 }}
                    >
                      {specImporting ? (
                        <>
                          <svg style={{ animation: "spin 0.8s linear infinite" }} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Scanning…
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                          Scan Image
                        </>
                      )}
                    </button>

                    {/* Manual add */}
                    <button
                      onClick={addSpec}
                      style={{ background: "rgba(43,126,161,0.12)", color: "#2B7EA1", border: "1px solid rgba(43,126,161,0.3)", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >
                      + Row
                    </button>
                  </div>
                </div>

                {/* Hidden file inputs */}
                <input ref={csvSpecRef} type="file" accept=".csv,.tsv,.txt" style={{ display: "none" }} onChange={handleCSVImport} />
                <input ref={xlsxSpecRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={handleExcelImport} />
                <input ref={imgSpecRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageImport} />

                {/* Import error */}
                {specImportErr && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#f87171", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <svg width="14" height="14" style={{ flexShrink: 0, marginTop: 1 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {specImportErr}
                    <button onClick={() => setSpecImportErr("")} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", flexShrink: 0 }}>×</button>
                  </div>
                )}

                {/* ── Import preview panel ── */}
                {specImport && (
                  <div style={{ background: "rgba(43,126,161,0.07)", border: "1px solid rgba(43,126,161,0.25)", borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
                    {/* Preview header */}
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(43,126,161,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#2B7EA1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {specImport.source === "csv" ? "📄 CSV" : specImport.source === "excel" ? "📊 Excel" : "🤖 AI Scan"} — {specImport.rows.length} rows detected
                        </span>
                        {specImport.source === "image" && (
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Review before importing</span>
                        )}
                      </div>
                      <button onClick={() => setSpecImport(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
                    </div>

                    {/* Scrollable preview rows */}
                    <div style={{ maxHeight: 220, overflowY: "auto", padding: "8px 0" }}>
                      {specImport.rows.map((row, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "5px 14px" }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", paddingRight: 8 }}>{row.key}</span>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(43,126,161,0.2)", display: "flex", gap: 8, alignItems: "center" }}>
                      {form.specs.length > 0 ? (
                        <>
                          <button
                            onClick={() => commitSpecImport("append")}
                            style={{ background: "#2B7EA1", color: "#fff", border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          >
                            ＋ Append to existing
                          </button>
                          <button
                            onClick={() => commitSpecImport("replace")}
                            style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          >
                            Replace all
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => commitSpecImport("replace")}
                          style={{ background: "#2B7EA1", color: "#fff", border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          Import {specImport.rows.length} rows
                        </button>
                      )}
                      <button onClick={() => setSpecImport(null)} style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Discard
                      </button>
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                        {form.specs.length > 0 ? `${form.specs.length} existing rows` : "No existing rows"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Manual spec rows */}
                {form.specs.length === 0 && !specImport ? (
                  <div style={{ border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 10, padding: "20px 18px", textAlign: "center" }}>
                    <svg width="22" height="22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 8px", display: "block" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>No specs yet</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.12)" }}>Import from CSV / Excel / datasheet image, or click + Row</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {form.specs.map((sp, i) => (
                      <div key={i} style={{ display: "flex", gap: 7, alignItems: "center" }}>
                        <input style={{ ...S.input, flex: 1 }} placeholder="Key (e.g. Bore Size)" value={sp.key} onChange={(e) => updateSpec(i, "key", e.target.value)} />
                        <input style={{ ...S.input, flex: 1 }} placeholder="Value (e.g. 32 mm)" value={sp.value} onChange={(e) => updateSpec(i, "value", e.target.value)} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button onClick={() => moveSpec(i, -1)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 5, width: 24, height: 21, cursor: "pointer", fontSize: 9 }}>▲</button>
                          <button onClick={() => moveSpec(i, 1)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 5, width: 24, height: 21, cursor: "pointer", fontSize: 9 }}>▼</button>
                        </div>
                        <button onClick={() => removeSpec(i)} style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 7, width: 30, height: 36, cursor: "pointer", color: "#f87171", fontSize: 14, flexShrink: 0 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Main Image ── */}
              <div style={S.fg}>
                <label style={S.label}>Main Image</label>
                <div
                  onClick={() => imgRef.current?.click()}
                  style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 12, padding: "18px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2B7EA1")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                >
                  {form.image_url ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img src={form.image_url} alt="" style={{ width: 110, height: 110, objectFit: "cover", borderRadius: 10 }} />
                      <button onClick={(e) => { e.stopPropagation(); setF("image_url", ""); }}
                        style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", background: "#DC2626", border: "none", color: "#fff", fontSize: 12, cursor: "pointer" }}>×</button>
                    </div>
                  ) : imgUploading ? (
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Uploading…</div>
                  ) : (
                    <div>
                      <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 8px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Click to upload main image</div>
                    </div>
                  )}
                </div>
                <input ref={imgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImgSelect} />
                <input style={{ ...S.input, marginTop: 7, fontSize: 11, fontFamily: "monospace" }} placeholder="Or paste image URL…" value={form.image_url} onChange={(e) => setF("image_url", e.target.value)} />
              </div>

              {/* ── Gallery ── */}
              <div style={S.fg}>
                <label style={S.label}>Gallery Images (optional)</label>
                {form.gallery_urls?.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    {form.gallery_urls.map((url, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={url} alt="" style={{ width: 68, height: 68, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} />
                        <button onClick={() => setForm((p) => ({ ...p, gallery_urls: p.gallery_urls.filter((_, idx) => idx !== i) }))}
                          style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#DC2626", border: "none", color: "#fff", fontSize: 10, cursor: "pointer" }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => galleryRef.current?.click()}
                  style={{ ...S.btnSec, fontSize: 12 }}>
                  {galleryUploading ? "Uploading…" : "+ Add Gallery Images"}
                </button>
                <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleGallerySelect} />
              </div>

              {/* Sort + Featured */}
              <div style={S.row2}>
                <div>
                  <label style={S.label}>Sort Order</label>
                  <input style={S.input} type="number" min="0" value={form.sort_order} onChange={(e) => setF("sort_order", e.target.value)} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
                    <div onClick={() => setF("is_featured", !form.is_featured)}
                      style={{ width: 44, height: 24, borderRadius: 12, position: "relative", background: form.is_featured ? "#8DC63F" : "#E5E7EB", transition: "background 0.2s", cursor: "pointer", flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: 2, left: form.is_featured ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Featured</div>
                      <div style={{ fontSize: 11, color: "#AAA" }}>Show on homepage</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={S.dFoot}>
              <button onClick={() => setOpen(false)} style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "9px 22px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#2B7EA1", color: "#fff", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : editId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SUBCATEGORY DRAWER
      ═══════════════════════════════════════════════════════════════════════ */}
      {subcatDrawerOpen && (
        <>
          <div style={{ ...S.overlay, zIndex: 1100 }} onClick={() => setSubcatDrawerOpen(false)} />
          <div style={{ ...S.drawer, width: "min(440px,100vw)", zIndex: 1101 }}>
            <div style={S.dHead}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{editSubcatId ? "Edit Subcategory" : "Add Subcategory"}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Subcategories help customers filter within a category</div>
              </div>
              <button onClick={() => setSubcatDrawerOpen(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={S.dBody}>
              {subcatErr && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 18 }}>{subcatErr}</div>
              )}
              <div style={S.fg}>
                <label style={S.label}>Category *</label>
                <select style={{ ...S.select, width: "100%", boxSizing: "border-box" }} value={subcatForm.category_slug} onChange={(e) => setSubcatForm((p) => ({ ...p, category_slug: e.target.value }))}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div style={S.fg}>
                <label style={S.label}>Subcategory Name *</label>
                <input style={S.input} placeholder="e.g. Cylinders, Ball Valves, Hoses…" value={subcatForm.name} onChange={(e) => setSubcatForm((p) => ({ ...p, name: e.target.value }))} />
              </div>

              {/* List of existing subcats for this category */}
              {subcatForm.category_slug && (
                <div>
                  <label style={{ ...S.label, marginBottom: 10 }}>
                    Existing in {catName(subcatForm.category_slug)}
                  </label>
                  {subcategories.filter((sc) => sc.category_slug === subcatForm.category_slug).length === 0 ? (
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>None yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {subcategories.filter((sc) => sc.category_slug === subcatForm.category_slug).map((sc) => (
                        <div key={sc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{sc.name}</span>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => openEditSubcat(sc)} style={{ background: "rgba(43,126,161,0.12)", border: "1px solid rgba(43,126,161,0.3)", borderRadius: 6, padding: "4px 9px", fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#2B7EA1" }}>Edit</button>
                            <button onClick={() => deleteSubcat(sc.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, padding: "4px 9px", fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#f87171" }}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={S.dFoot}>
              <button onClick={() => setSubcatDrawerOpen(false)} style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>Cancel</button>
              <button onClick={saveSubcat} disabled={subcatSaving} style={{ padding: "9px 22px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#2B7EA1", color: "#fff", opacity: subcatSaving ? 0.7 : 1 }}>
                {subcatSaving ? "Saving…" : editSubcatId ? "Update" : "Add Subcategory"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
