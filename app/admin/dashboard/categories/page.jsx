"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase";

// ─── Helpers ────────────────────────────────────────────────────────────────
function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Drawer Component ────────────────────────────────────────────────────────
function Drawer({ open, onClose, title, children }) {
    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        zIndex: 100,
                    }}
                />
            )}
            {/* Drawer */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "440px",
                    maxWidth: "100vw",
                    height: "100vh",
                    backgroundColor: "#1E2D3D",
                    borderLeft: "1px solid rgba(255,255,255,0.08)",
                    zIndex: 101,
                    transform: open ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                }}
            >
                {/* Drawer header */}
                <div
                    style={{
                        padding: "24px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "var(--font-syne, Syne, sans-serif)",
                            fontWeight: 700,
                            fontSize: "18px",
                            color: "#ffffff",
                        }}
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "none",
                            borderRadius: "6px",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                            color: "rgba(255,255,255,0.6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                        }}
                    >
                        ×
                    </button>
                </div>
                <div style={{ padding: "24px", flex: 1 }}>{children}</div>
            </div>
        </>
    );
}

// ─── Form Field ──────────────────────────────────────────────────────────────
function Field({ label, children, hint }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <label
                style={{
                    display: "block",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: "8px",
                    letterSpacing: "0.02em",
                }}
            >
                {label}
            </label>
            {children}
            {hint && (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "5px" }}>
                    {hint}
                </p>
            )}
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CategoriesPage() {


    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState(null); // null = add mode, obj = edit mode
    const [deleteConfirm, setDeleteConfirm] = useState(null); // id to confirm delete
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [search, setSearch] = useState("");
    const fileRef = useRef();

    // Form state
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        icon: "",
        image_url: "",
        sort_order: 0,
    });

    // ── Fetch ──
    async function fetchCategories() {
        setLoading(true);
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("sort_order", { ascending: true });
        if (!error) setCategories(data || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    // ── Toast ──
    function showToast(msg, type = "success") {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }

    // ── Open drawer ──
    function openAdd() {
        setEditing(null);
        setForm({ name: "", slug: "", description: "", icon: "", image_url: "", sort_order: categories.length });
        setDrawerOpen(true);
    }

    function openEdit(cat) {
        setEditing(cat);
        setForm({
            name: cat.name || "",
            slug: cat.slug || "",
            description: cat.description || "",
            icon: cat.icon || "",
            image_url: cat.image_url || "",
            sort_order: cat.sort_order || 0,
        });
        setDrawerOpen(true);
    }

    function closeDrawer() {
        setDrawerOpen(false);
        setEditing(null);
    }

    // ── Auto-slug ──
    function handleNameChange(val) {
        setForm((f) => ({
            ...f,
            name: val,
            slug: editing ? f.slug : slugify(val),
        }));
    }

    // ── Image Upload ──
    async function handleImageUpload(file) {
        if (!file) return;
        setImageUploading(true);
        const ext = file.name.split(".").pop();
        const path = `categories/${Date.now()}.${ext}`;
        const { error } = await supabase.storage
            .from("category-images")
            .upload(path, file, { upsert: true });
        if (error) {
            showToast("Image upload failed: " + error.message, "error");
        } else {
            const { data: urlData } = supabase.storage
                .from("category-images")
                .getPublicUrl(path);
            setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
            showToast("Image uploaded");
        }
        setImageUploading(false);
    }

    // ── Save (add or edit) ──
    async function handleSave() {
        if (!form.name.trim() || !form.slug.trim()) {
            showToast("Name and slug are required", "error");
            return;
        }
        setSaving(true);
        const payload = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            description: form.description.trim(),
            icon: form.icon.trim(),
            image_url: form.image_url.trim(),
            sort_order: Number(form.sort_order) || 0,
        };
        let error;
        if (editing) {
            ({ error } = await supabase.from("categories").update(payload).eq("id", editing.id));
        } else {
            ({ error } = await supabase.from("categories").insert(payload));
        }
        if (error) {
            showToast(error.message, "error");
        } else {
            showToast(editing ? "Category updated" : "Category added");
            closeDrawer();
            fetchCategories();
        }
        setSaving(false);
    }

    // ── Delete ──
    async function handleDelete(id) {
        if (deleteConfirm !== id) {
            setDeleteConfirm(id);
            setTimeout(() => setDeleteConfirm(null), 3000);
            return;
        }
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) {
            showToast(error.message, "error");
        } else {
            showToast("Category deleted");
            fetchCategories();
        }
        setDeleteConfirm(null);
    }

    const filtered = categories.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.slug || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ maxWidth: "900px", fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
            {/* Toast */}
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        right: "24px",
                        zIndex: 200,
                        background: toast.type === "error" ? "#7f1d1d" : "#14532d",
                        border: `1px solid ${toast.type === "error" ? "#ef4444" : "#22c55e"}44`,
                        color: toast.type === "error" ? "#fca5a5" : "#86efac",
                        padding: "12px 20px",
                        borderRadius: "10px",
                        fontSize: "14px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                >
                    {toast.msg}
                </div>
            )}

            {/* Page header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "28px",
                    flexWrap: "wrap",
                    gap: "12px",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontFamily: "var(--font-syne, Syne, sans-serif)",
                            fontWeight: 700,
                            fontSize: "26px",
                            color: "#ffffff",
                            marginBottom: "4px",
                        }}
                    >
                        Categories
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                        {categories.length} categories · manage what appears on the website
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        background: "#2B7EA1",
                        border: "none",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "var(--font-syne, Syne, sans-serif)",
                    }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M12 4v16m8-8H4" strokeLinecap="round" />
                    </svg>
                    Add Category
                </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
                <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={2}
                    style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search categories…"
                    style={{
                        ...inputStyle,
                        paddingLeft: "40px",
                    }}
                />
            </div>

            {/* Table */}
            <div
                style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                {/* Table header */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "56px 1fr 140px 60px 120px",
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                    }}
                >
                    <span>Image</span>
                    <span>Name / Slug</span>
                    <span>Description</span>
                    <span>Order</span>
                    <span style={{ textAlign: "right" }}>Actions</span>
                </div>

                {/* Rows */}
                {loading ? (
                    <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                        Loading…
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                        {search ? "No categories match your search" : "No categories yet — add one above"}
                    </div>
                ) : (
                    filtered.map((cat, i) => (
                        <div
                            key={cat.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "56px 1fr 140px 60px 120px",
                                padding: "14px 16px",
                                borderBottom:
                                    i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                alignItems: "center",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "transparent")
                            }
                        >
                            {/* Image */}
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    background: "rgba(43,126,161,0.15)",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "18px",
                                }}
                            >
                                {cat.image_url ? (
                                    <img
                                        src={cat.image_url}
                                        alt={cat.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <span>{cat.icon || "📦"}</span>
                                )}
                            </div>

                            {/* Name + slug */}
                            <div style={{ paddingLeft: "0", overflow: "hidden" }}>
                                <p
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        color: "#ffffff",
                                        marginBottom: "3px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {cat.name}
                                </p>
                                <p
                                    style={{
                                        fontSize: "12px",
                                        color: "rgba(255,255,255,0.3)",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    /{cat.slug}
                                </p>
                            </div>

                            {/* Description */}
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: "rgba(255,255,255,0.35)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {cat.description || "—"}
                            </p>

                            {/* Sort order */}
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                                {cat.sort_order}
                            </p>

                            {/* Actions */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <button
                                    onClick={() => openEdit(cat)}
                                    style={{
                                        padding: "6px 14px",
                                        background: "rgba(43,126,161,0.15)",
                                        border: "1px solid rgba(43,126,161,0.3)",
                                        borderRadius: "6px",
                                        color: "#2B7EA1",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    style={{
                                        padding: "6px 14px",
                                        background:
                                            deleteConfirm === cat.id
                                                ? "rgba(239,68,68,0.2)"
                                                : "rgba(239,68,68,0.08)",
                                        border: `1px solid ${deleteConfirm === cat.id ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.2)"}`,
                                        borderRadius: "6px",
                                        color: "#f87171",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {deleteConfirm === cat.id ? "Confirm?" : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add / Edit Drawer */}
            <Drawer
                open={drawerOpen}
                onClose={closeDrawer}
                title={editing ? `Edit: ${editing.name}` : "Add Category"}
            >
                <Field label="Category Name *">
                    <input
                        style={inputStyle}
                        value={form.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Pneumatics"
                    />
                </Field>

                <Field label="Slug *" hint="Used in URLs — auto-generated from name">
                    <input
                        style={{ ...inputStyle, fontFamily: "monospace", fontSize: "13px" }}
                        value={form.slug}
                        onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                        placeholder="e.g. pneumatics"
                    />
                </Field>

                <Field label="Description">
                    <textarea
                        style={{
                            ...inputStyle,
                            minHeight: "80px",
                            resize: "vertical",
                            lineHeight: 1.5,
                        }}
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Short description for this category…"
                    />
                </Field>

                <Field label="Icon (emoji)" hint="Shown as fallback when no image is set">
                    <input
                        style={inputStyle}
                        value={form.icon}
                        onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                        placeholder="e.g. 🔧"
                    />
                </Field>

                <Field label="Category Image">
                    {/* Upload zone */}
                    <div
                        onClick={() => fileRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) handleImageUpload(file);
                        }}
                        style={{
                            border: "2px dashed rgba(43,126,161,0.3)",
                            borderRadius: "10px",
                            padding: "20px",
                            textAlign: "center",
                            cursor: "pointer",
                            background: "rgba(43,126,161,0.05)",
                            transition: "background 0.15s",
                            marginBottom: "10px",
                        }}
                    >
                        {imageUploading ? (
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                                Uploading…
                            </p>
                        ) : (
                            <>
                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "4px" }}>
                                    Drag & drop or click to upload
                                </p>
                                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>
                                    JPG, PNG, WebP — 800×500px recommended
                                </p>
                            </>
                        )}
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                    />

                    {/* Image URL input */}
                    <input
                        style={{ ...inputStyle, fontSize: "12px", fontFamily: "monospace" }}
                        value={form.image_url}
                        onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                        placeholder="or paste image URL…"
                    />

                    {/* Preview */}
                    {form.image_url && (
                        <div
                            style={{
                                marginTop: "10px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                height: "120px",
                                background: "rgba(0,0,0,0.3)",
                            }}
                        >
                            <img
                                src={form.image_url}
                                alt="preview"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    )}
                </Field>

                <Field label="Sort Order" hint="Lower numbers appear first">
                    <input
                        type="number"
                        style={inputStyle}
                        value={form.sort_order}
                        onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                    />
                </Field>

                {/* Save button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        width: "100%",
                        padding: "13px",
                        background: saving ? "rgba(43,126,161,0.4)" : "#2B7EA1",
                        border: "none",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: 600,
                        cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-syne, Syne, sans-serif)",
                        marginTop: "8px",
                    }}
                >
                    {saving ? "Saving…" : editing ? "Save Changes" : "Add Category"}
                </button>

                {editing && (
                    <button
                        onClick={closeDrawer}
                        style={{
                            width: "100%",
                            padding: "11px",
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "14px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            marginTop: "10px",
                        }}
                    >
                        Cancel
                    </button>
                )}
            </Drawer>

            <style>{`
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        input:focus, textarea:focus { border-color: rgba(43,126,161,0.5) !important; }
      `}</style>
        </div>
    );
}
