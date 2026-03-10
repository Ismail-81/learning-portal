import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

// Replace with your real admin emails
const ADMIN_ALLOWLIST = ["ismailgheewala1@gmail.com"];

export default function Admin({ user }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tutorials state
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  // Tutorial form
  const [tTitle, setTTitle] = useState("");
  const [tDescription, setTDescription] = useState("");
  const [tOrder, setTOrder] = useState(1);
  const [tActive, setTActive] = useState(true);
  const [editingTutorialId, setEditingTutorialId] = useState(null);

  // Sections state for selected tutorial
  const [sections, setSections] = useState([]);

  // Section form
  const [sTitle, setSTitle] = useState("");
  const [sOrder, setSOrder] = useState(1);
  const [sContent, setSContent] = useState("");
  const [sExample, setSExample] = useState("");
  const [sExampleExplanation, setSExampleExplanation] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null);

  // Resources temporary fields (simple add/remove)
  const [pdfInput, setPdfInput] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [visualInput, setVisualInput] = useState("");

  useEffect(() => {
    // check allowlist
    if (user && ADMIN_ALLOWLIST.includes(user.email)) {
      setAllowed(true);
    } else {
      setAllowed(false);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!allowed) return;
    fetchTutorials();
  }, [allowed]);

  // Fetch tutorials ordered by 'order'
  async function fetchTutorials() {
    try {
      const ref = collection(db, "tutorials");
      const q = query(ref, orderBy("order", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTutorials(data);
    } catch (err) {
      console.error("fetchTutorials", err);
    }
  }

  // Add or update tutorial
  async function saveTutorial(e) {
    e.preventDefault();
    try {
      if (editingTutorialId) {
        const ref = doc(db, "tutorials", editingTutorialId);
        await setDoc(
          ref,
          {
            title: tTitle,
            description: tDescription,
            order: Number(tOrder),
            isActive: Boolean(tActive),
          },
          { merge: true },
        );
      } else {
        const ref = collection(db, "tutorials");
        await addDoc(ref, {
          title: tTitle,
          description: tDescription,
          order: Number(tOrder),
          isActive: Boolean(tActive),
        });
      }
      // reset form + reload
      resetTutorialForm();
      fetchTutorials();
    } catch (err) {
      console.error("saveTutorial", err);
    }
  }

  function resetTutorialForm() {
    setTTitle("");
    setTDescription("");
    setTOrder(1);
    setTActive(true);
    setEditingTutorialId(null);
  }

  async function deleteTutorial(id) {
    if (!confirm("Delete tutorial and all its sections?")) return;
    try {
      await deleteDoc(doc(db, "tutorials", id));
      // Note: subcollections aren't deleted automatically via client SDK.
      // For simple admin, assume sections are removed separately or use Cloud Functions for cascade delete.
      fetchTutorials();
      if (selectedTutorial === id) {
        setSelectedTutorial(null);
        setSections([]);
      }
    } catch (err) {
      console.error("deleteTutorial", err);
    }
  }

  // Sections: fetch for tutorial
  async function fetchSections(tId) {
    try {
      const ref = collection(db, "tutorials", tId, "sections");
      const q = query(ref, orderBy("order", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSections(data);
      setSelectedTutorial(tId);
    } catch (err) {
      console.error("fetchSections", err);
    }
  }

  // Add or update section
  async function saveSection(e) {
    e.preventDefault();
    if (!selectedTutorial) return alert("Select a tutorial first");
    try {
      const base = collection(db, "tutorials", selectedTutorial, "sections");
      const resources = {};
      if (pdfInput) resources.pdfs = [{ title: "PDF", url: pdfInput }];
      if (videoInput) resources.videos = [{ title: "Video", url: videoInput }];
      if (visualInput)
        resources.visuals = [{ title: "Visual", url: visualInput }];

      const payload = {
        title: sTitle,
        content: sContent,
        example: sExample,
        exampleExplanation: sExampleExplanation,
        order: Number(sOrder),
        resources: Object.keys(resources).length ? resources : {},
      };

      if (editingSectionId) {
        const ref = doc(
          db,
          "tutorials",
          selectedTutorial,
          "sections",
          editingSectionId,
        );
        await setDoc(ref, payload, { merge: true });
      } else {
        await addDoc(base, payload);
      }
      resetSectionForm();
      fetchSections(selectedTutorial);
    } catch (err) {
      console.error("saveSection", err);
    }
  }

  function resetSectionForm() {
    setSTitle("");
    setSOrder(1);
    setSContent("");
    setSExample("");
    setSExampleExplanation("");
    setPdfInput("");
    setVideoInput("");
    setVisualInput("");
    setEditingSectionId(null);
  }

  async function deleteSection(sId) {
    if (!confirm("Delete section?")) return;
    try {
      await deleteDoc(doc(db, "tutorials", selectedTutorial, "sections", sId));
      fetchSections(selectedTutorial);
    } catch (err) {
      console.error("deleteSection", err);
    }
  }

  // Edit helpers
  function startEditTutorial(t) {
    setEditingTutorialId(t.id);
    setTTitle(t.title || "");
    setTDescription(t.description || "");
    setTOrder(t.order || 1);
    setTActive(Boolean(t.isActive));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEditSection(s) {
    setEditingSectionId(s.id);
    setSTitle(s.title || "");
    setSOrder(s.order || 1);
    setSContent(s.content || "");
    setSExample(s.example || "");
    setSExampleExplanation(s.exampleExplanation || "");
    // load first resource items into inputs for quick edit (simple)
    setPdfInput(
      (s.resources && s.resources.pdfs && s.resources.pdfs[0]?.url) || "",
    );
    setVideoInput(
      (s.resources && s.resources.videos && s.resources.videos[0]?.url) || "",
    );
    setVisualInput(
      (s.resources && s.resources.visuals && s.resources.visuals[0]?.url) || "",
    );
    window.scrollTo({ top: 200, behavior: "smooth" });
  }

  if (loading) return <div className="p-6">Checking admin access...</div>;
  if (!allowed)
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="mb-4">
          Your account is not authorized to access the admin panel.
        </p>
        <p>
          Return to <Link to="/">Home</Link>
        </p>
      </div>
    );

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">Admin Panel — Tutorials</h1>

        {/* Tutorial Form */}
        <form
          onSubmit={saveTutorial}
          className="mb-8 bg-gray-50 p-4 rounded-lg border"
        >
          <h2 className="font-semibold mb-2">
            {editingTutorialId ? "Edit Tutorial" : "Add Tutorial"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={tTitle}
              onChange={(e) => setTTitle(e.target.value)}
              placeholder="Title"
              className="col-span-2 p-2 border rounded"
              required
            />
            <input
              value={tOrder}
              onChange={(e) => setTOrder(e.target.value)}
              type="number"
              min={1}
              placeholder="Order"
              className="p-2 border rounded"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tActive}
                onChange={(e) => setTActive(e.target.checked)}
              />{" "}
              Active
            </label>
            <textarea
              value={tDescription}
              onChange={(e) => setTDescription(e.target.value)}
              placeholder="Short description"
              className="col-span-1 md:col-span-4 p-2 border rounded"
            />
          </div>
          <div className="mt-3">
            <button className="px-4 py-2 bg-indigo-900 text-white rounded">
              Save Tutorial
            </button>
            {editingTutorialId && (
              <button
                type="button"
                onClick={resetTutorialForm}
                className="ml-2 px-3 py-2 border rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Tutorials List */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <h3 className="font-semibold mb-2">Tutorials</h3>
            <ul className="space-y-2">
              {tutorials.map((t) => (
                <li
                  key={t.id}
                  className="p-3 border rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-gray-500">
                      Order: {t.order}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchSections(t.id)}
                      className="px-2 py-1 text-sm border rounded"
                    >
                      Sections
                    </button>
                    <button
                      onClick={() => startEditTutorial(t)}
                      className="px-2 py-1 text-sm border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTutorial(t.id)}
                      className="px-2 py-1 text-sm text-red-600 border rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections management */}
          <div className="col-span-2">
            <h3 className="font-semibold mb-2">
              {selectedTutorial
                ? `Sections — ${tutorials.find((x) => x.id === selectedTutorial)?.title}`
                : "Select a tutorial to manage sections"}
            </h3>

            {selectedTutorial && (
              <div className="space-y-4">
                <form
                  onSubmit={saveSection}
                  className="p-4 border rounded bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      value={sTitle}
                      onChange={(e) => setSTitle(e.target.value)}
                      placeholder="Section title"
                      className="p-2 border rounded col-span-2"
                      required
                    />
                    <input
                      value={sOrder}
                      onChange={(e) => setSOrder(e.target.value)}
                      type="number"
                      min={1}
                      placeholder="Order"
                      className="p-2 border rounded"
                    />
                    <textarea
                      value={sContent}
                      onChange={(e) => setSContent(e.target.value)}
                      placeholder="Content (text)"
                      className="col-span-1 md:col-span-3 p-2 border rounded h-28"
                    />
                    <textarea
                      value={sExample}
                      onChange={(e) => setSExample(e.target.value)}
                      placeholder="Example (code)"
                      className="col-span-1 md:col-span-3 p-2 border rounded h-20"
                    />
                    <textarea
                      value={sExampleExplanation}
                      onChange={(e) => setSExampleExplanation(e.target.value)}
                      placeholder="Example explanation"
                      className="col-span-1 md:col-span-3 p-2 border rounded h-20"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      value={pdfInput}
                      onChange={(e) => setPdfInput(e.target.value)}
                      placeholder="PDF Google Drive URL"
                      className="p-2 border rounded"
                    />
                    <input
                      value={videoInput}
                      onChange={(e) => setVideoInput(e.target.value)}
                      placeholder="Video URL"
                      className="p-2 border rounded"
                    />
                    <input
                      value={visualInput}
                      onChange={(e) => setVisualInput(e.target.value)}
                      placeholder="Visuals URL"
                      className="p-2 border rounded"
                    />
                  </div>

                  <div className="mt-3">
                    <button className="px-4 py-2 bg-indigo-900 text-white rounded">
                      Save Section
                    </button>
                    {editingSectionId && (
                      <button
                        type="button"
                        onClick={resetSectionForm}
                        className="ml-2 px-3 py-2 border rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div>
                  <h4 className="font-medium mb-2">Existing Sections</h4>
                  <ul className="space-y-2">
                    {sections.map((s) => (
                      <li
                        key={s.id}
                        className="p-3 border rounded flex justify-between items-start"
                      >
                        <div>
                          <div className="font-medium">{s.title}</div>
                          <div className="text-xs text-gray-500">
                            Order: {s.order}
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            {s.content?.slice(0, 200)}
                          </div>
                          {/* Show resource keys if present */}
                          {s.resources && (
                            <div className="mt-2 text-xs text-gray-500">
                              Resources: {Object.keys(s.resources).join(", ")}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => startEditSection(s)}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSection(s.id)}
                            className="px-2 py-1 border rounded text-sm text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
