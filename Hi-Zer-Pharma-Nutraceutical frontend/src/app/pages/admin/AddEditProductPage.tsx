import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Upload } from "lucide-react";
import { ff } from "../../lib/constants";
import { categoriesApi } from "../../api/categories";
import { productsApi } from "../../api/products";
import { uploadApi } from "../../api/upload";
import { ApiClientError } from "../../api/client";
import type { Category, ProductImage } from "../../types";

interface FormState {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  discountPrice: string;
  stock: string;
  dosage: string;
  rx: boolean;
  featured: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  discountPrice: "",
  stock: "",
  dosage: "",
  rx: false,
  featured: false,
};

export default function AddEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    productsApi
      .get(id)
      .then((p) => {
        setForm({
          name: p.name,
          description: p.description,
          category: typeof p.category === "string" ? p.category : p.category._id,
          subcategory: p.subcategory,
          price: String(p.price),
          discountPrice: p.discountPrice ? String(p.discountPrice) : "",
          stock: String(p.stock),
          dosage: p.dosage || "",
          rx: p.rx,
          featured: p.featured,
        });
        setImages(p.images || []);
      })
      .catch(() => setError("Could not load product"))
      .finally(() => setLoading(false));
  }, [id]);

  const selectedCategory = categories.find((c) => c._id === form.category);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const result = await uploadApi.productImage(file);
      setImages([{ url: result.url, publicId: result.publicId }]);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description || !form.category || !form.subcategory || !form.price || !form.stock) {
      setError("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        subcategory: form.subcategory,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock: Number(form.stock),
        dosage: form.dosage,
        rx: form.rx,
        featured: form.featured,
        images,
      };
      if (isEdit && id) {
        await productsApi.update(id, payload);
      } else {
        await productsApi.create(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-sm text-gray-400" style={ff}>Loading…</div>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => navigate("/admin/products")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6 transition-colors" style={ff}>
        ← Back to Products
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-6" style={ff}>{isEdit ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={ff}>Product Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. OvaBoost PCOS Support"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={ff}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Product description..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18 resize-none"
              style={ff}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={ff}>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18 bg-white"
              style={ff}
            >
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={ff}>Subcategory</label>
            {selectedCategory && selectedCategory.subcategories.length > 0 ? (
              <select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18 bg-white"
                style={ff}
              >
                <option value="">Select subcategory</option>
                {selectedCategory.subcategories.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            ) : (
              <input
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                placeholder="e.g. PCOS"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
                style={ff}
              />
            )}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={ff}>Price (Rs.)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={ff}>Discount Price (Rs.)</label>
            <input
              type="number"
              min="0"
              value={form.discountPrice}
              onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={ff}>Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
            />
          </div>
          <div className="flex items-center gap-3 self-end pb-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={ff}>Prescription Required</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, rx: !form.rx })}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.rx ? "bg-[#0c3f35]" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.rx ? "translate-x-5" : ""}`} />
            </button>
            {form.rx && <span className="text-xs font-bold text-[#b4502a]">Rx</span>}
          </div>
          <div className="flex items-center gap-3 self-end pb-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={ff}>Featured on Homepage</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-[#0c3f35]" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={ff}>Dosage / Usage Instructions</label>
            <textarea
              value={form.dosage}
              onChange={(e) => setForm({ ...form, dosage: e.target.value })}
              rows={2}
              placeholder="e.g. Take 2 capsules daily with meals."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18 resize-none"
              style={ff}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={ff}>Product Image</label>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#0c3f35]/30 hover:bg-gray-50 transition-colors">
              {images[0] ? (
                <img src={images[0].url} alt="Preview" className="w-20 h-20 object-cover rounded-lg mb-1" />
              ) : (
                <Upload size={18} className="text-gray-400" />
              )}
              <span className="text-sm font-semibold text-gray-500" style={ff}>
                {uploading ? "Uploading…" : images[0] ? "Change Image" : "Upload Image"}
              </span>
              <span className="text-xs text-gray-400" style={ff}>PNG, JPG up to 5 MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} />
            </label>
          </div>
        </div>
        {error && <p className="text-xs text-red-500 mt-4">{error}</p>}
        <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-100">
          <button type="button" onClick={() => navigate("/admin/products")} className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50" style={ff}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-5 py-2.5 rounded-lg bg-[#0c3f35] text-white text-sm font-semibold hover:bg-[#0c3f35]/88 active:scale-[0.97] transition-all disabled:opacity-60"
            style={ff}
          >
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
