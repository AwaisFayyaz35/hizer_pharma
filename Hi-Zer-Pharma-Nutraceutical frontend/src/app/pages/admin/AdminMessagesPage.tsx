import { useEffect, useState } from "react";
import { Mail, Trash } from "lucide-react";
import { ff } from "../../lib/constants";
import { contactApi } from "../../api/contact";
import { ApiClientError } from "../../api/client";
import type { ContactMessage } from "../../types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    contactApi
      .list()
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this message permanently? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await contactApi.remove(id);
      load();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Could not delete message");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold text-gray-900" style={ff}>Messages</h1>
        <p className="text-sm text-gray-400" style={ff}>{loading ? "Loading…" : `${messages.length} message${messages.length === 1 ? "" : "s"}`}</p>
      </div>

      {!loading && messages.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-16 text-center">
          <Mail size={28} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-400" style={ff}>No messages yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m._id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-900" style={ff}>{m.name}</p>
                <a href={`mailto:${m.email}`} className="text-xs text-[#0c3f35] hover:underline" style={ff}>
                  {m.email}
                </a>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className="text-xs text-gray-400" style={ff}>{new Date(m.createdAt).toLocaleString()}</p>
                <button
                  onClick={() => handleDelete(m._id)}
                  disabled={deletingId === m._id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap" style={ff}>{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
