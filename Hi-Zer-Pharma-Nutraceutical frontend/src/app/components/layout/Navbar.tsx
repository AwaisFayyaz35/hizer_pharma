import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ff } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";

const LINKS = [
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/about" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#fbfaf7]/96 backdrop-blur-md border-b border-[#0c3f35]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === l.to ? "text-[#0c3f35]" : "text-[#0c1a16]/55 hover:text-[#0c3f35]"
                }`}
                style={ff}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="p-2.5 rounded-full text-[#0c1a16]/55 hover:text-[#0c3f35] hover:bg-[#0c3f35]/5 transition-colors"
            >
              <Search size={19} />
            </button>
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-[#0c1a16]/55 hover:text-[#0c3f35] hover:bg-[#0c3f35]/5 transition-colors"
            >
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#28a869] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2.5 rounded-full text-[#0c1a16]/55" onClick={() => setOpen((o) => !o)}>
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4">
            <form className="relative" onSubmit={submitSearch}>
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0c1a16]/35" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, health concerns..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#0c3f35]/12 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/30"
                style={ff}
              />
            </form>
          </div>
        )}

        {open && (
          <div className="md:hidden border-t border-[#0c3f35]/8 py-3 space-y-0.5">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex w-full items-center py-2.5 px-1 text-sm font-medium text-[#0c1a16]/65 hover:text-[#0c3f35] transition-colors"
                style={ff}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
