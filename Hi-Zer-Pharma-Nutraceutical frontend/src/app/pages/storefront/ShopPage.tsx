import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { ProductCard } from "../../components/storefront/ProductCard";
import { ff, fs } from "../../lib/constants";
import { useDebounce } from "../../hooks/useDebounce";
import { categoriesApi } from "../../api/categories";
import { productsApi } from "../../api/products";
import type { Category, Product } from "../../types";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [cat, setCat] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState("featured");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const sortParam = sort === "price-asc" ? "price_asc" : sort === "price-desc" ? "price_desc" : undefined;
    productsApi
      .list({ search: debouncedQuery || undefined, category: cat, sort: sortParam, limit: 48 })
      .then((res) => {
        setProducts(res.items);
        setTotal(res.total);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, cat, sort]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedQuery) params.search = debouncedQuery;
    if (cat !== "All") params.category = cat;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0c1a16]" style={fs}>All Products</h1>
        <p className="text-[#0c1a16]/45 mt-1 text-sm" style={ff}>{loading ? "Loading…" : `${total} products available`}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0c1a16]/35" />
          <input
            type="text"
            placeholder="Search products or health concerns..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#0c3f35]/12 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
            style={ff}
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#0c3f35]/12 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
          style={ff}
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {["All", ...categories.map((c) => c.name)].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              cat === c ? "bg-[#0c3f35] text-white shadow-sm" : "bg-white border border-[#0c3f35]/12 text-[#0c1a16]/55 hover:border-[#0c3f35]/25"
            }`}
            style={ff}
          >
            {c}
          </button>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      ) : !loading ? (
        <div className="text-center py-24 text-[#0c1a16]/35" style={ff}>
          <p className="text-lg font-medium mb-1">No products found</p>
          <p className="text-sm">Try a different search or category</p>
        </div>
      ) : null}
    </div>
  );
}
