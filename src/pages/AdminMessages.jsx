import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          dateFormatted:
            d.data().createdAt?.toDate().toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            }) || "Unknown Date",
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id) => {
    await updateDoc(doc(db, "contactMessages", id), { status: "read" });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: "read" } : m));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    await deleteDoc(doc(db, "contactMessages", id));
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const filtered = messages.filter((m) => {
    if (tab === "new") return m.status === "new" || !m.status;
    if (tab === "read") return m.status === "read";
    return true;
  });

  const newCount = messages.filter((m) => m.status === "new" || !m.status).length;

  const tabs = [
    { key: "all", label: "All", count: messages.length },
    { key: "new", label: "New", count: newCount },
    { key: "read", label: "Read", count: messages.filter((m) => m.status === "read").length },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <nav className="text-xs text-gray-400 mb-1 flex items-center gap-1">
          <Link to="/admin" className="hover:text-indigo-600">Dashboard</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Messages</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-sm text-gray-500 mt-0.5">Messages submitted by users through the contact form.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
              tab === t.key
                ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                tab === t.key
                  ? t.key === "new" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-48 text-gray-400">
          <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm font-medium">No {tab === "all" ? "" : tab} messages</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => {
            const isNew = msg.status === "new" || !msg.status;
            const isExpanded = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={`bg-white rounded-xl border shadow-sm transition-all duration-200 ${isNew ? "border-l-4 border-l-amber-400 border-gray-200" : "border-gray-200"}`}
              >
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/50"
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                >
                  {/* Status dot */}
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isNew ? "bg-amber-400" : "bg-gray-200"}`} />

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-indigo-700">
                      {msg.name?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{msg.name}</span>
                      {isNew && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wide">New</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{msg.email}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400 truncate max-w-xs">{msg.message?.slice(0, 60)}{msg.message?.length > 60 ? "..." : ""}</span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:block">{msg.dateFormatted}</span>
                    <svg
                      className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <div className="grid sm:grid-cols-3 gap-3 mb-4 text-xs text-gray-500">
                      <div><span className="font-semibold text-gray-700">From:</span> {msg.name}</div>
                      <div><span className="font-semibold text-gray-700">Email:</span> <a href={`mailto:${msg.email}`} className="text-indigo-600 hover:underline">{msg.email}</a></div>
                      <div><span className="font-semibold text-gray-700">Date:</span> {msg.dateFormatted}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed mb-4">
                      {msg.message}
                    </div>
                    <div className="flex items-center gap-2">
                      {isNew && (
                        <button
                          onClick={() => markRead(msg.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
