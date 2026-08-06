import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ff, fmt } from "../../lib/constants";
import { customersApi } from "../../api/customers";
import type { Customer } from "../../types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customersApi
      .list()
      .then(setCustomers)
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6" style={ff}>Customers</h1>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60">
                {["Customer", "Email", "Phone", "Orders", "Total Spent"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={ff}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!loading && customers.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400" style={ff}>No customers yet.</td></tr>
              )}
              {customers.map((c) => (
                <tr key={c.email} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link to={`/admin/customers/${encodeURIComponent(c.email)}`} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0c3f35]/10 flex items-center justify-center text-xs font-bold text-[#0c3f35]" style={ff}>
                        {c.name.charAt(0)}
                      </div>
                      <p className="text-sm font-semibold text-gray-900" style={ff}>{c.name}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500" style={ff}>{c.email}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500" style={ff}>{c.phone}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900" style={ff}>{c.orders}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900" style={ff}>{fmt(c.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
