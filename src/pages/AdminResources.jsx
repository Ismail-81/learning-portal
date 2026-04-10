import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  collection, getDocs, doc, setDoc, getDoc, query, orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";

function ResourceGroup({ label, colorClass, icon, items, onAdd, onDelete, addLabel }) {
  const [titleInput, setTitleInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async () => {
    if (!titleInput.trim() || !urlInput.trim()) return alert("Title and URL are required");
    setAdding(true);
    await onAdd({ title: titleInput.trim(), url: urlInput.trim() });
    setTitleInput(""); setUrlInput(""); setShowForm(false);
    setAdding(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>{icon}</span>
          <span className="font-semibold text-gray-900 text-sm">{label}</span>
          <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">{items.length}</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>

      {showForm && (
        <div className="px-5 py-4 bg-indigo-50/50 border-b border-indigo-100 flex flex-col sm:flex-row gap-2.5">
          <input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Title"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={addLabel}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="px-4 py-2 bg-indigo-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 disabled:opacity-50 transition-colors flex-shrink-0"
          >
            {adding ? "..." : "Save"}
          </button>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {items.length === 0 ? (
          <p className="px-5 py-4 text-sm text-gray-400 italic">No resources yet. Click "Add" to attach one.</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 group">
              <div className="min-w-0 flex-1 mr-4">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-500 hover:text-indigo-700 truncate block mt-0.5 flex items-center gap-1"
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="truncate">{item.url}</span>
                </a>
              </div>
              <button
                onClick={() => onDelete(idx)}
                className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminResources() {
  const [searchParams] = useSearchParams();
  const [tutorials, setTutorials] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedTutorialId, setSelectedTutorialId] = useState(searchParams.get("tutorialId") || "");
  const [selectedSectionId, setSelectedSectionId] = useState(searchParams.get("sectionId") || "");
  const [resources, setResources] = useState({ pdfs: [], videos: [], visuals: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDocs(query(collection(db, "tutorials"), orderBy("order", "asc")))
      .then((snap) => setTutorials(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, []);

  useEffect(() => {
    if (!selectedTutorialId) { setSections([]); setSelectedSectionId(""); return; }
    getDocs(query(collection(db, "tutorials", selectedTutorialId, "sections"), orderBy("order", "asc")))
      .then((snap) => setSections(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [selectedTutorialId]);

  useEffect(() => {
    if (!selectedTutorialId || !selectedSectionId) { setResources({ pdfs: [], videos: [], visuals: [] }); return; }
    setLoading(true);
    getDoc(doc(db, "tutorials", selectedTutorialId, "sections", selectedSectionId))
      .then((snap) => {
        if (snap.exists()) {
          const r = snap.data().resources || {};
          setResources({ pdfs: r.pdfs || [], videos: r.videos || [], visuals: r.visuals || [] });
        }
      })
      .finally(() => setLoading(false));
  }, [selectedTutorialId, selectedSectionId]);

  const saveResources = async (updated) => {
    setResources(updated);
    await setDoc(
      doc(db, "tutorials", selectedTutorialId, "sections", selectedSectionId),
      { resources: updated },
      { merge: true }
    );
  };

  const handleAdd = async (type, item) => {
    const updated = { ...resources, [type]: [...(resources[type] || []), item] };
    await saveResources(updated);
  };

  const handleDelete = async (type, idx) => {
    if (!confirm("Remove this resource?")) return;
    const updated = { ...resources, [type]: resources[type].filter((_, i) => i !== idx) };
    await saveResources(updated);
  };

  const groups = [
    {
      key: "pdfs",
      label: "PDF Notes",
      addLabel: "Google Drive / PDF URL",
      colorClass: "bg-red-50",
      icon: (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "videos",
      label: "Video References",
      addLabel: "YouTube / Video URL",
      colorClass: "bg-blue-50",
      icon: (
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: "visuals",
      label: "Visual Guides",
      addLabel: "Image / Visual URL",
      colorClass: "bg-green-50",
      icon: (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <nav className="text-xs text-gray-400 mb-1 flex items-center gap-1">
          <Link to="/admin" className="hover:text-indigo-600">Dashboard</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Resources</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Manage Resources</h1>
        <p className="text-sm text-gray-500 mt-0.5">Attach PDFs, videos, and visual guides to sections.</p>
      </div>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tutorial</label>
          <select
            value={selectedTutorialId}
            onChange={(e) => { setSelectedTutorialId(e.target.value); setSelectedSectionId(""); }}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-44"
          >
            <option value="">-- Select Tutorial --</option>
            {tutorials.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Section</label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            disabled={!selectedTutorialId}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-52 disabled:opacity-50"
          >
            <option value="">-- Select Section --</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
      </div>

      {/* Resources */}
      {!selectedSectionId ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-48 text-gray-400">
          <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="text-sm font-medium">Select a tutorial and section to manage resources</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <ResourceGroup
              key={g.key}
              label={g.label}
              colorClass={g.colorClass}
              icon={g.icon}
              addLabel={g.addLabel}
              items={resources[g.key] || []}
              onAdd={(item) => handleAdd(g.key, item)}
              onDelete={(idx) => handleDelete(g.key, idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
