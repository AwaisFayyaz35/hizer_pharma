import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ff, fs, fmt } from "../../lib/constants";
import { customersApi } from "../../api/customers";
import type { Order } from "../../types";

export default function AdminCustomerDetailPage() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<{ name: string; email: string; phone: string; orders: Order[]; spent: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;
    customersApi
      .get(email)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) return <div className="p-8 text-sm text-gray-400" style={ff}>Loading…</div>;
  if (!data) return <div className="p-8 text-sm text-red-500" style={ff}>Customer not found.</div>;

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => navigate("/admin/customers")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6 transition-colors" style={ff}>
        ← Back to Customers
      </button>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
        <h1 className="text-xl font-bold text-gray-900" style={ff}>{data.name}</h1>
        <p className="text-sm text-gray-400 mt-1" style={ff}>{data.email} · {data.phone}</p>
        <p className="text-sm font-semibold text-[#0c3f35] mt-2" style={ff}>{data.orders.length} orders · {fmt(data.spent)} total spent</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-900" style={ff}>Order History</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {data.orders.map((o) => (
            <Link key={o._id} to={`/admin/orders/${o._id}`} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div>
                <p className="text-sm font-semibold text-gray-900" style={ff}>{o.orderNumber}</p>
                <p className="text-xs text-gray-400" style={ff}>{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-bold text-gray-900" style={ff}>{fmt(o.total)}</p>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
