import { useEffect, useState } from "react";
import { createCategory, getCategories, deleteCategory } from "../../services/adminApi.js";
import { useToast } from "../../contexts/ToastContext.jsx";
import { ConfirmModal } from "../../components/ui/ConfirmModal.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

export function AdminCategoriesPage() {
  useDocumentTitle("Admin  Categories");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();
  
  const [confirmModalState, setConfirmModalState] = useState({ isOpen: false, categoryId: null });

  function loadCategories() {
    setLoading(true);
    getCategories()
      .then((res) => {
        if (res?.categories) setCategories(res.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await createCategory(name.trim(), slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"));
      showSuccess("Service category created successfully");
      setName("");
      setSlug("");
      loadCategories();
    } catch (err) {
      showError(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setConfirmModalState({ isOpen: true, categoryId: id });
  }

  async function executeDelete(id) {
    try {
      await deleteCategory(id);
      showSuccess("Category deleted successfully");
      loadCategories();
    } catch (err) {
      showError(err.message || "Failed to delete category");
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Service Categories</h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Manage structured categories for service discovery and provider classification
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create Category Form */}
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl space-y-4 h-fit"
        >
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Create Category
          </h2>

          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 space-y-1">
            Category Name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Appliance Repair"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0066FF]"
            />
          </label>

          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 space-y-1">
            Slug (Optional)
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. appliance-repair"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0066FF]"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#0066FF] py-2.5 text-xs font-bold text-slate-900 dark:text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Add Category"}
          </button>
        </form>

        {/* Category List */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
            Active Categories
          </h2>

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-[#0066FF]" />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((c) => (
                <div
                  key={c._id || c.slug}
                  className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{c.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                      ACTIVE
                    </span>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="rounded bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState({ isOpen: false, categoryId: null })}
        onConfirm={() => executeDelete(confirmModalState.categoryId)}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete Category"
        isDestructive={true}
      />
    </div>
  );
}
