import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function StorefrontLayout() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]" style={{ scrollbarWidth: "none" }}>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
