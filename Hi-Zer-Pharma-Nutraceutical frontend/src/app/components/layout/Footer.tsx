import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { ff } from "../../lib/constants";
import { categoriesApi } from "../../api/categories";
import type { Category } from "../../types";

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi
      .list()
      .then((cats) => setCategories(cats.slice(0, 5)))
      .catch(() => setCategories([]));
  }, []);

  return (
    <footer className="bg-[#0c3f35] text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Logo variant="white" />
            <p className="text-white/55 text-sm leading-relaxed mt-5 mb-6 max-w-xs" style={ff}>
              Premium pharmaceutical and nutraceutical products — pharmacist-reviewed and delivered with care to your door.
            </p>
            <div className="space-y-2.5 text-sm text-white/55" style={ff}>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 text-[#7dd3bd] flex-shrink-0" />
                <span>Plot No. 246, F Block, Sabzazar, Multan Road, Lahore</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#7dd3bd]" />
                <span>0321 4544343</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7dd3bd] mb-4" style={ff}>
              Quick Links
            </h4>
            <ul className="space-y-2.5" style={ff}>
              {[
                { label: "Shop All", to: "/shop" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/about" },
                { label: "Track Order", to: "/orders/track" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-white/55 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7dd3bd] mb-4" style={ff}>
              Health Concerns
            </h4>
            <ul className="space-y-2.5" style={ff}>
              {categories.map((c) => (
                <li key={c._id}>
                  <Link to={`/shop?category=${encodeURIComponent(c.name)}`} className="text-sm text-white/55 hover:text-white transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35" style={ff}>© 2024 Hi-Zer Pharma & Nutraceutical. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-white/35" style={ff}>
            <button className="hover:text-white/60 transition-colors">Privacy Policy</button>
            <button className="hover:text-white/60 transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
