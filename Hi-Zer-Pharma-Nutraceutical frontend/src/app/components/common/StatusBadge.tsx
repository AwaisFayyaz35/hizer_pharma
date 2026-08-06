import { ff } from "../../lib/constants";

const MAP: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-teal-50 text-teal-700 border-teal-200",
  Received: "bg-gray-50 text-gray-600 border-gray-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${MAP[status] ?? MAP.Received}`}
      style={ff}
    >
      {status}
    </span>
  );
}
