import type { ReactNode } from "react";
import { ff } from "../../lib/constants";

export function StatWidget({
  label,
  value,
  sub,
  icon,
  colorClass,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  colorClass: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colorClass}`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5" style={ff}>{value}</p>
      <p className="text-xs text-gray-400" style={ff}>{label}</p>
      {sub && <p className="text-xs font-semibold text-emerald-600 mt-1" style={ff}>{sub}</p>}
    </div>
  );
}
