import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Edit, Plus, Search, Star, Trash } from "lucide-react";
import { ff, fmt } from "../../lib/constants";
import { useDebounce } from "../../hooks/useDebounce";
import { productsApi } from "../../api/products";
import { ApiClientError } from "../../api/client";
import type { Product } from "../../types";

export default function AdminProductsPage() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    productsApi
      .list({ search: debouncedQ || undefined, limit: 100 })
      .then((res) => {
        setProducts(res.items);
        setTotal(res.total);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [debouncedQ]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product permanently? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await productsApi.remove(id);
      load();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={ff}>Products</h1>
          <p className="text-xs text-gray-400 mt-0.5" style={ff}>{total} total products</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0c3f35] text-white rounded-lg text-sm font-semibold hover:bg-[#0c3f35]/88 active:scale-[0.97] transition-all"
          style={ff}
        >
          <Plus size={15} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <div className="relative w-full sm:w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60">
                {["Product", "Category", "Price", "Stock", "Rx", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={ff}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400" style={ff}>No products found.</td>
                </tr>
              )}
              {products.map((p) => {
                const categoryName = typeof p.category === "string" ? p.category : p.category?.name;
                const imageUrl = p.images?.[0]?.url;
                return (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {imageUrl && <img src={imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5" style={ff}>
                          {p.name}
                          {p.featured && <Star size={12} className="text-amber-400 fill-amber-400" />}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500" style={ff}>{categoryName}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900" style={ff}>
                      {fmt(p.discountPrice ?? p.price)}
                      {p.discountPrice && <span className="ml-1.5 text-xs text-gray-400 line-through font-normal">{fmt(p.price)}</span>}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          p.stock === 0 ? "bg-red-50 text-red-600" : p.stock < 30 ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
                        }`}
                        style={ff}
                      >
                        {p.stock === 0 ? "Out of stock" : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.rx ? <span className="text-xs font-bold text-[#b4502a]">Rx</span> : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/products/${p._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#0c3f35] hover:bg-[#0c3f35]/5 rounded-lg transition-colors">
                          <Edit size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={deletingId === p._id}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        >
                          <Trash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
