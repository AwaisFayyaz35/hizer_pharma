import { useState } from "react";
import { Outlet } from "react-router";
import { Menu } from "lucide-react";
import { AdminSidebarContent } from "./AdminSidebar";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import { fs } from "../../lib/constants";

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex w-56 bg-white border-r border-gray-100 flex-col flex-shrink-0">
        <AdminSidebarContent />
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <AdminSidebarContent onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-gray-100 bg-white flex-shrink-0">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900"
          >
            <Menu size={20} />
          </button>
          <span className="text-base font-bold text-[#0c3f35]" style={fs}>Hi-Zer Admin</span>
        </div>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
