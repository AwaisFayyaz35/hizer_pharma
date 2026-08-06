import { Link } from "react-router";
import { RxBadge } from "../common/RxBadge";
import { ff, fmt } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const price = product.discountPrice ?? product.price;
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const categoryName = typeof product.category === "string" ? product.category : product.category?.name;
  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="group bg-white rounded-2xl border border-[#0c3f35]/8 overflow-hidden hover:shadow-xl hover:shadow-[#0c3f35]/6 hover:border-[#0c3f35]/18 transition-all duration-300">
      <Link to={`/product/${product._id}`} className="relative block bg-[#eef4f1] aspect-square overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.rx && <RxBadge />}
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#b4502a] text-white">{discount}% OFF</span>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-[#0c1a16]/50" style={ff}>Out of Stock</span>
          </div>
        )}
      </Link>
      <div className="p-4">
        <p className="text-[11px] text-[#28a869] font-bold uppercase tracking-wider mb-1" style={ff}>{categoryName}</p>
        <Link
          to={`/product/${product._id}`}
          className="block text-sm font-semibold text-[#0c1a16] mb-3 leading-snug hover:text-[#0c3f35] transition-colors"
          style={ff}
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-[#0c3f35] text-base" style={ff}>{fmt(price)}</span>
          {product.discountPrice && (
            <span className="text-sm text-[#0c1a16]/35 line-through" style={ff}>{fmt(product.price)}</span>
          )}
        </div>
        <button
          onClick={() => product.inStock && addToCart(product)}
          disabled={!product.inStock}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
            product.inStock
              ? "bg-[#0c3f35] text-white hover:bg-[#0c3f35]/88 active:scale-[0.97]"
              : "bg-[#0c1a16]/6 text-[#0c1a16]/30 cursor-not-allowed"
          }`}
          style={ff}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
