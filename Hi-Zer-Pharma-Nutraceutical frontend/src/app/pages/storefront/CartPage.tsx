import { Link, useNavigate } from "react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { RxBadge } from "../../components/common/RxBadge";
import { ff, fs, fmt, FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";

export default function CartPage() {
  const { cart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((s, i) => s + (i.product.discountPrice ?? i.product.price) * i.quantity, 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#0c1a16] mb-8" style={fs}>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingCart size={44} className="text-[#0c1a16]/18 mx-auto mb-4" />
          <p className="font-medium text-[#0c1a16]/45 mb-6" style={ff}>Your cart is empty</p>
          <Link to="/shop" className="inline-block px-8 py-3 bg-[#0c3f35] text-white rounded-xl font-semibold hover:bg-[#0c3f35]/88" style={ff}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => {
              const price = item.product.discountPrice ?? item.product.price;
              const imageUrl = item.product.images?.[0]?.url;
              const categoryName = typeof item.product.category === "string" ? item.product.category : item.product.category?.name;
              return (
                <div key={item.product._id} className="flex gap-4 bg-white rounded-2xl border border-[#0c3f35]/8 p-4">
                  <Link to={`/product/${item.product._id}`} className="w-20 h-20 bg-[#eef4f1] rounded-xl overflow-hidden flex-shrink-0">
                    {imageUrl && <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover" />}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] text-[#28a869] font-bold uppercase tracking-wider" style={ff}>{categoryName}</p>
                        <p className="text-sm font-semibold text-[#0c1a16]" style={ff}>{item.product.name}</p>
                        {item.product.rx && <div className="mt-1"><RxBadge /></div>}
                      </div>
                      <button
                        onClick={() => updateQuantity(item.product._id, 0)}
                        className="text-[#0c1a16]/25 hover:text-red-500 flex-shrink-0 p-1 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#0c3f35]/12 rounded-lg">
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="px-2.5 py-1.5 hover:text-[#0c3f35] transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center" style={ff}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="px-2.5 py-1.5 hover:text-[#0c3f35] transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-bold text-[#0c3f35] text-sm" style={ff}>{fmt(price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-[#0c3f35]/8 p-6 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-[#0c1a16] mb-5" style={fs}>Order Summary</h2>
            <div className="space-y-3 text-sm mb-5" style={ff}>
              <div className="flex justify-between text-[#0c1a16]/55">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#0c1a16]/55">
                <span>Delivery fee</span>
                <span>{delivery === 0 ? <span className="text-[#28a869] font-medium">Free</span> : fmt(delivery)}</span>
              </div>
              <div className="border-t border-[#0c3f35]/8 pt-3 flex justify-between font-bold text-[#0c1a16]">
                <span>Total</span>
                <span>{fmt(subtotal + delivery)}</span>
              </div>
            </div>
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <p className="text-xs text-[#28a869] font-medium mb-4" style={ff}>
                Add {fmt(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
              </p>
            )}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-3.5 bg-[#0c3f35] text-white rounded-xl font-semibold hover:bg-[#0c3f35]/88 active:scale-[0.98] transition-all shadow-md shadow-[#0c3f35]/15"
              style={ff}
            >
              Proceed to Checkout
            </button>
            <Link to="/shop" className="block text-center w-full mt-3 py-2.5 text-sm text-[#0c1a16]/45 hover:text-[#0c3f35] transition-colors" style={ff}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
