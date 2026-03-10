import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  collection, getDocs, addDoc, doc, setDoc, deleteDoc, query, orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminSections() {
  const [searchParams] = useSearchParams();
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorialId, setSelectedTutorialId] = useState(searchParams.get("tutorialId") || "");
  const [sections, setSections] = useState([]);
  const [loadingTuts, setLoadingTuts] = useState(true);
  const [loadingSecs, setLoadingSecs] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", order: 1, content: "", example: "", exampleExplanation: "",
  });

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const q = query(collection(db, "tutorials"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        setTutorials(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTuts(false);
      }
    };
    fetchTutorials();
  }, []);

  useEffect(() => {
    if (!selectedTutorialId) { setSections([]); return; }
    const fetchSections = async () => {
      setLoadingSecs(true);
      try {
        const q = query(collection(db, "tutorials", selectedTutorialId, "sections"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        setSections(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSecs(false);
      }
    };
    fetchSections();
  }, [selectedTutorialId]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", order: sections.length + 1, content: "", example: "", exampleExplanation: "" });
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({ title: s.title || "", order: s.order || 1, content: s.content || "", example: s.example || "", exampleExplanation: s.exampleExplanation || "" });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedTutorialId) return alert("Select a tutorial first");
    setSaving(true);
    try {
      const payload = { title: form.title, order: Number(form.order), content: form.content, example: form.example, exampleExplanation: form.exampleExplanation };
      if (editingId) {
        await setDoc(doc(db, "tutorials", selectedTutorialId, "sections", editingId), payload, { merge: true });
      } else {
        await addDoc(collection(db, "tutorials", selectedTutorialId, "sections"), payload);
      }
      setModalOpen(false);
      // refresh
      const q = query(collection(db, "tutorials", selectedTutorialId, "sections"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      setSections(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sId) => {
    if (!confirm("Delete this section?")) return;
    await deleteDoc(doc(db, "tutorials", selectedTutorialId, "sections", sId));
    setSections((prev) => prev.filter((s) => s.id !== sId));
  };

  const selectedTutorialName = tutorials.find((t) => t.id === selectedTutorialId)?.title || "";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <nav className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <Link to="/admin" className="hover:text-indigo-600">Dashboard</Link>
            <span>›</span>
            <span className="text-gray-600 font-medium">Sections</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Manage Sections</h1>
          <p className="text-sm text-gray-500 mt-0.5">Add and edit learning sections within each tutorial.</p>
        </div>
        <button
          onClick={openCreate}
          disabled={!selectedTutorialId}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-900 text-white rounded-lg text-sm font-medium hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Section
        </button>
      </div>

      {/* Tutorial Selector */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Select Tutorial</label>
        <select
          value={selectedTutorialId}
          onChange={(e) => setSelectedTutorialId(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-48"
        >
          <option value="">-- Choose a tutorial --</option>
          {tutorials.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {!selectedTutorialId ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm font-medium">Select a tutorial to view sections</p>
          </div>
        ) : loadingSecs ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-sm font-medium">No sections yet for "{selectedTutorialName}"</p>
            <p className="text-xs mt-1">Click "New Section" to add one</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">#</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Content</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sections.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs">{idx + 1}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{s.title}</p>
                    <Link
                      to={`/admin/resources?tutorialId=${selectedTutorialId}&sectionId=${s.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-0.5 inline-flex items-center gap-1"
                    >
                      Manage resources
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-gray-500 hidden md:table-cell max-w-xs">
                    <p className="text-xs line-clamp-2">{s.content?.slice(0, 120)}{s.content?.length > 120 ? "..." : ""}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Section" : "New Section"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Section title" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Order</label>
              <input type="number" min={1} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Theory Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Explain the concept..." rows={5} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Code Example</label>
            <textarea value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} placeholder="Paste code here..." rows={4} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-gray-50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Example Explanation</label>
            <textarea value={form.exampleExplanation} onChange={(e) => setForm({ ...form, exampleExplanation: e.target.value })} placeholder="Explain the code..." rows={3} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-indigo-900 text-white rounded-lg text-sm font-medium hover:bg-indigo-800 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
