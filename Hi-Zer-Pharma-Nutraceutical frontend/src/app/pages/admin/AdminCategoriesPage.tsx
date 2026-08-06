import { useEffect, useState } from "react";
import { Edit, Plus, X } from "lucide-react";
import { ff } from "../../lib/constants";
import { categoriesApi } from "../../api/categories";
import { ApiClientError } from "../../api/client";
import type { Category } from "../../types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [subName, setSubName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("🏥");

  function load() {
    setLoading(true);
    categoriesApi
      .list()
      .then(setCategories)
      .catch(() => setError("Could not load categories"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await categoriesApi.create({ name: newCategoryName.trim(), icon: newCategoryIcon });
      setNewCategoryName("");
      setShowNewCategory(false);
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not create category");
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      await categoriesApi.remove(id);
      load();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Could not delete category");
    }
  }

  async function handleAddSub(id: string) {
    if (!subName.trim()) return;
    try {
      await categoriesApi.addSubcategory(id, subName.trim());
      setSubName("");
      setAddingSubFor(null);
      load();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Could not add subcategory");
    }
  }

  async function handleRemoveSub(id: string, name: string) {
    await categoriesApi.removeSubcategory(id, name);
    load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900" style={ff}>Categories</h1>
        <button
          onClick={() => setShowNewCategory((s) => !s)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0c3f35] text-white rounded-lg text-sm font-semibold"
          style={ff}
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      {showNewCategory && (
        <form onSubmit={handleCreateCategory} className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <input
            value={newCategoryIcon}
            onChange={(e) => setNewCategoryIcon(e.target.value)}
            className="w-full sm:w-16 px-3 py-2 rounded-lg border border-gray-200 text-sm text-center"
            style={ff}
          />
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
            style={ff}
          />
          <button type="submit" className="px-4 py-2 bg-[#0c3f35] text-white rounded-lg text-sm font-semibold" style={ff}>
            Create
          </button>
        </form>
      )}

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-sm text-gray-400" style={ff}>Loading…</p>}

      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {categories.map((cat) => (
          <div key={cat._id} className="p-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-sm font-bold text-gray-900" style={ff}>{cat.icon} {cat.name}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAddingSubFor(addingSubFor === cat._id ? null : cat._id)}
                  className="p-1.5 text-gray-400 hover:text-[#0c3f35] rounded-lg transition-colors"
                >
                  <Edit size={12} />
                </button>
                <button onClick={() => handleDeleteCategory(cat._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                  <X size={12} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-3">
              {cat.subcategories.map((sub) => (
                <span key={sub.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600" style={ff}>
                  → {sub.name}
                  <button onClick={() => handleRemoveSub(cat._id, sub.name)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={9} />
                  </button>
                </span>
              ))}
              {addingSubFor === cat._id ? (
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSub(cat._id)}
                    placeholder="New subcategory"
                    className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs"
                    style={ff}
                  />
                  <button onClick={() => handleAddSub(cat._id)} className="text-xs text-[#0c3f35] font-semibold">Add</button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingSubFor(cat._id)}
                  className="px-2.5 py-1 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-[#0c3f35]/35 hover:text-[#0c3f35] transition-colors"
                  style={ff}
                >
                  + Add
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
