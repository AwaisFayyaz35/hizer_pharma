import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Award, Check, ChevronRight, Package, Shield, Truck } from "lucide-react";
import { ProductCard } from "../../components/storefront/ProductCard";
import { ff, fs } from "../../lib/constants";
import { categoriesApi } from "../../api/categories";
import { productsApi } from "../../api/products";
import type { Category, Product } from "../../types";

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => setCategories([]));
    productsApi
      .list({ limit: 4, featured: true })
      .then((res) => {
        if (res.items.length > 0) {
          setFeatured(res.items);
          return;
        }
        // No products marked as featured yet — fall back to the newest ones
        return productsApi.list({ limit: 4, sort: "newest" }).then((fallback) => setFeatured(fallback.items));
      })
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0c3f35 0%, #155e4a 60%, #0c3f35 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-[#28a869]/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-[#7dd3bd]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 bg-white/10 text-[#7dd3bd] text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-7"
                style={ff}
              >
                <span className="w-1.5 h-1.5 bg-[#7dd3bd] rounded-full" />
                Pharmacist Verified · Clinically Tested
              </div>
              <h1 className="text-4xl md:text-[52px] font-bold text-white leading-[1.12] mb-6 tracking-tight" style={fs}>
                Science-backed nutrition for a healthier tomorrow
              </h1>
              <p className="text-white/65 text-lg leading-relaxed mb-9" style={ff}>
                Premium pharmaceutical and nutraceutical products, reviewed by certified pharmacists and delivered securely to your door.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/shop")}
                  className="px-8 py-3.5 bg-[#28a869] text-white rounded-xl font-semibold hover:bg-[#28a869]/90 active:scale-95 transition-all shadow-lg shadow-[#28a869]/25"
                  style={ff}
                >
                  Shop Products
                </button>
                <button
                  onClick={() => navigate("/shop")}
                  className="px-8 py-3.5 bg-white/10 text-white rounded-xl font-semibold border border-white/18 hover:bg-white/18 transition-all"
                  style={ff}
                >
                  Explore Concerns
                </button>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=620&h=500&fit=crop"
                  alt="Healthcare professional"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c3f35]/50 to-transparent rounded-3xl" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-[#28a869]/12 rounded-xl flex items-center justify-center">
                  <Check size={17} className="text-[#28a869]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0c1a16]" style={ff}>10,000+ Customers</p>
                  <p className="text-[11px] text-[#0c1a16]/45" style={ff}>Trusted nationwide</p>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2380b8]/10 rounded-xl flex items-center justify-center">
                  <Shield size={17} className="text-[#2380b8]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0c1a16]" style={ff}>200+ Products</p>
                  <p className="text-[11px] text-[#0c1a16]/45" style={ff}>Certified & verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-[#0c3f35]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Award size={19} className="text-[#0c3f35]" />, title: "Pharmacist Reviewed", desc: "Every product verified" },
              { icon: <Shield size={19} className="text-[#0c3f35]" />, title: "Verified Products", desc: "Authentic & certified" },
              { icon: <Truck size={19} className="text-[#0c3f35]" />, title: "Secure Delivery", desc: "Tracked & insured" },
              { icon: <Package size={19} className="text-[#0c3f35]" />, title: "Discreet Packaging", desc: "Privacy guaranteed" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#0c3f35]/6 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0c1a16]" style={ff}>{item.title}</p>
                  <p className="text-xs text-[#0c1a16]/45" style={ff}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Concern */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-bold text-[#28a869] uppercase tracking-[0.18em] mb-2" style={ff}>Health Categories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0c1a16]" style={fs}>Shop by Concern</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#0c3f35] hover:gap-2 transition-all" style={ff}>
            View all <ChevronRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-2xl border border-[#0c3f35]/8 p-5 text-left hover:border-[#0c3f35]/22 hover:shadow-md hover:shadow-[#0c3f35]/5 transition-all"
            >
              <div className="text-2xl mb-3">{cat.icon}</div>
              <h3 className="text-sm font-semibold text-[#0c1a16] group-hover:text-[#0c3f35] transition-colors leading-snug" style={ff}>
                {cat.name}
              </h3>
              <div className="mt-2 flex items-center gap-0.5 text-xs text-[#0c1a16]/35" style={ff}>
                Shop <ChevronRight size={11} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20" style={{ background: "#f4f8f5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-bold text-[#28a869] uppercase tracking-[0.18em] mb-2" style={ff}>Our Range</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0c1a16]" style={fs}>Featured Products</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#0c3f35] hover:gap-2 transition-all" style={ff}>
              View all <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "200+", label: "Certified Products" },
            { value: "24h", label: "Fast Delivery" },
            { value: "15+", label: "Healthcare Experts" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl md:text-5xl font-bold text-[#0c3f35] mb-2" style={fs}>{s.value}</p>
              <p className="text-sm text-[#0c1a16]/50 font-medium" style={ff}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: "linear-gradient(110deg, #28a869 0%, #0c3f35 100%)" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={fs}>
            Find the right healthcare solution for you
          </h2>
          <p className="text-white/65 mb-8 max-w-lg mx-auto text-base" style={ff}>
            Browse our complete pharmacist-reviewed range across all health categories.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-10 py-4 bg-white text-[#0c3f35] rounded-xl font-bold hover:bg-white/92 active:scale-95 transition-all shadow-xl shadow-black/10"
            style={ff}
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}
