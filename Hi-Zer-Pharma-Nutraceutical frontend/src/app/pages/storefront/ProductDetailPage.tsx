import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertTriangle, Minus, Plus } from "lucide-react";
import { RxBadge } from "../../components/common/RxBadge";
import { ff, fs, fmt } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";
import { productsApi } from "../../api/products";
import type { Product } from "../../types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi
      .get(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-[#0c1a16]/40" style={ff}>Loading…</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-[#0c1a16]/45 mb-6" style={ff}>Product not found.</p>
        <button onClick={() => navigate("/shop")} className="px-6 py-3 bg-[#0c3f35] text-white rounded-xl font-semibold" style={ff}>
          Back to Shop
        </button>
      </div>
    );
  }

  const price = product.discountPrice ?? product.price;
  const categoryName = typeof product.category === "string" ? product.category : product.category?.name;
  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate("/shop")}
        className="flex items-center gap-1.5 text-sm text-[#0c1a16]/45 hover:text-[#0c3f35] mb-8 transition-colors"
        style={ff}
      >
        ← Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        <div className="bg-[#eef4f1] rounded-3xl overflow-hidden aspect-square">
          {imageUrl && <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />}
        </div>

        <div>
          <p className="text-[11px] font-bold text-[#28a869] uppercase tracking-[0.18em] mb-2" style={ff}>
            {categoryName} · {product.subcategory}
          </p>
          <div className="flex items-start gap-3 mb-5">
            <h1 className="text-3xl font-bold text-[#0c1a16] leading-tight" style={fs}>{product.name}</h1>
            {product.rx && <div className="mt-1"><RxBadge /></div>}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-[#0c3f35]" style={ff}>{fmt(price)}</span>
            {product.discountPrice && (
              <span className="text-lg text-[#0c1a16]/35 line-through" style={ff}>{fmt(product.price)}</span>
            )}
            {product.discountPrice && (
              <span className="text-xs font-bold text-white bg-[#b4502a] px-2 py-0.5 rounded">
                {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          <p className="text-[#0c1a16]/65 leading-relaxed mb-6 text-sm" style={ff}>{product.description}</p>

          {product.dosage && (
            <div className="bg-[#f0f5f3] rounded-xl p-4 mb-5">
              <p className="text-[10px] font-bold text-[#0c3f35] uppercase tracking-[0.16em] mb-1" style={ff}>Recommended Dosage</p>
              <p className="text-sm text-[#0c1a16]/65" style={ff}>{product.dosage}</p>
            </div>
          )}

          {product.rx && (
            <div className="bg-[#b4502a]/6 border border-[#b4502a]/18 rounded-xl p-4 mb-5 flex gap-3">
              <AlertTriangle size={17} className="text-[#b4502a] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#b4502a]" style={ff}>Prescription Required Before Purchase</p>
                <p className="text-xs text-[#b4502a]/75 mt-0.5 leading-relaxed" style={ff}>
                  This product is a prescription medicine. You will be required to upload a valid prescription at checkout.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-5 mb-7">
            <span className="text-sm font-medium text-[#0c1a16]/55" style={ff}>Quantity</span>
            <div className="flex items-center border border-[#0c3f35]/15 rounded-xl">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:text-[#0c3f35] transition-colors">
                <Minus size={13} />
              </button>
              <span className="text-sm font-bold w-7 text-center" style={ff}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2.5 hover:text-[#0c3f35] transition-colors">
                <Plus size={13} />
              </button>
            </div>
            <span className="text-xs text-[#0c1a16]/35" style={ff}>
              {product.inStock ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <button
            onClick={() => {
              for (let i = 0; i < qty; i++) addToCart(product);
              navigate("/cart");
            }}
            disabled={!product.inStock}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all active:scale-[0.98] ${
              product.inStock ? "bg-[#0c3f35] text-white hover:bg-[#0c3f35]/88 shadow-lg shadow-[#0c3f35]/15" : "bg-[#0c1a16]/8 text-[#0c1a16]/30 cursor-not-allowed"
            }`}
            style={ff}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
