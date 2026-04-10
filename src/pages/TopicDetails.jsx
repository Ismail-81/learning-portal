import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

const TABS = ["Theory", "Code Example", "Resources"];

export default function TopicDetails() {
  const { tutorialId, sectionId } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [sections, setSections] = useState([]);
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Theory");
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [tutSnap, secsSnap] = await Promise.all([
          getDoc(doc(db, "tutorials", tutorialId)),
          getDocs(query(collection(db, "tutorials", tutorialId, "sections"), orderBy("order", "asc"))),
        ]);
        if (tutSnap.exists()) setTutorial({ id: tutSnap.id, ...tutSnap.data() });
        const secsData = secsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSections(secsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (tutorialId) fetchAll();
  }, [tutorialId]);

  useEffect(() => {
    if (!sectionId) { setSection(null); return; }
    const fetchSection = async () => {
      try {
        const snap = await getDoc(doc(db, "tutorials", tutorialId, "sections", sectionId));
        if (snap.exists()) setSection({ id: snap.id, ...snap.data() });
        setActiveTab("Theory");
        setShowCode(false);
      } catch (err) { console.error(err); }
    };
    fetchSection();
  }, [tutorialId, sectionId]);

  const currentIndex = sections.findIndex((s) => s.id === sectionId);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  const handleCopy = async () => {
    if (!section?.example) return;
    await navigator.clipboard.writeText(section.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resources = section?.resources || {};
  const hasResources =
    (resources.pdfs?.length > 0) ||
    (resources.videos?.length > 0) ||
    (resources.visuals?.length > 0);
  const resourceCount =
    (resources.pdfs?.length || 0) +
    (resources.videos?.length || 0) +
    (resources.visuals?.length || 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      {/* make sidebar sit below the fixed header and add some inner padding so
          content (including dropdowns) isn't obscured by the navbar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-gray-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Back link */}
        <div className="px-4 py-3 border-b border-gray-100">
          <Link
            to={`/tutorial/${tutorialId}`}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tutorials
          </Link>
        </div>

        {/* Tutorial Title */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">{tutorial?.title}</span>
          </div>
          <div className="mt-1">
            <button
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 w-full text-left"
            >
              {tutorial?.title}
              <svg className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sections list */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {sections.map((s) => (
            <Link
              key={s.id}
              to={`/tutorial/${tutorialId}/${s.id}`}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                s.id === sectionId
                  ? "bg-indigo-600 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.id === sectionId ? "bg-white" : "bg-gray-300"}`} />
              <span className="truncate">{s.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {!sectionId ? (
          <div className="flex items-center justify-center flex-1 text-center p-8">
            <div>
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{tutorial?.title}</h2>
              <p className="text-gray-500 text-sm">Select a section from the sidebar to begin.</p>
            </div>
          </div>
        ) : section ? (
          <div className="flex-1 flex flex-col">
            {/* Mobile back - pushed below fixed header so it isn't overlapped */}
            <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
              <Link to={`/tutorial/${tutorialId}`} className="text-gray-400 hover:text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <span className="text-sm font-semibold text-gray-700 truncate">{section.title}</span>
            </div>

            <div className="flex-1 p-6 md:p-10 max-w-5xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                <Link to="/tutorials" className="hover:text-indigo-600">Tutorials</Link>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-500">{tutorial?.title}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-700 font-medium">{section.title}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{section.title}</h1>
              <div className="h-0.5 w-12 bg-indigo-600 mb-5 rounded-full" />

              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab === "Theory" && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {tab === "Code Example" && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )}
                    {tab === "Resources" && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    )}
                    {tab}
                    {tab === "Resources" && resourceCount > 0 && (
                      <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-semibold">{resourceCount}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "Theory" && (
                <div>
                  {section.content ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 text-gray-800 leading-loose text-base md:text-[1.05rem] whitespace-pre-wrap mb-6 tracking-wide">
                      {section.content}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-sm">No theory content available.</p>
                  )}

                  {section.example && (
                    <button
                      onClick={() => { setActiveTab("Code Example"); setShowCode(true); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Code Example
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {activeTab === "Code Example" && (
                <div>
                  {section.example ? (
                    <div className="relative mb-6">
                      <div className="flex items-center justify-between bg-gray-800 px-4 py-2.5 rounded-t-xl border border-gray-700">
                        <div className="flex gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <button
                          onClick={handleCopy}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${copied ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                        >
                          {copied ? "✓ Copied!" : "Copy"}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-5 rounded-b-xl overflow-x-auto text-sm border border-t-0 border-gray-700">
                        <code>{section.example}</code>
                      </pre>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-sm">No code example available.</p>
                  )}

                  {section.exampleExplanation && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                      <h3 className="font-semibold text-indigo-900 text-sm mb-2 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Explanation
                      </h3>
                      <p className="text-gray-800 text-base md:text-[1.05rem] leading-relaxed whitespace-pre-wrap">{section.exampleExplanation}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Resources" && (
                <div>
                  {!hasResources ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
                      <svg className="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <p className="text-sm">No resources available for this section.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {resources.pdfs?.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            PDF Notes
                          </h3>
                          <div className="space-y-2">
                            {resources.pdfs.map((r, i) => (
                              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors group">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900 group-hover:text-red-700">{r.title}</span>
                                <svg className="w-4 h-4 text-gray-300 ml-auto group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {resources.videos?.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Video References
                          </h3>
                          <div className="space-y-2">
                            {resources.videos.map((r, i) => (
                              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors group">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">{r.title}</span>
                                <svg className="w-4 h-4 text-gray-300 ml-auto group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {resources.visuals?.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Visual Guides
                          </h3>
                          <div className="space-y-2">
                            {resources.visuals.map((r, i) => (
                              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors group">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900 group-hover:text-green-700">{r.title}</span>
                                <svg className="w-4 h-4 text-gray-300 ml-auto group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prev / Next Navigation */}
            <div className="border-t border-gray-100 px-6 md:px-10 py-5 flex items-center justify-between gap-4 bg-white">
              {prevSection ? (
                <Link
                  to={`/tutorial/${tutorialId}/${prevSection.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all max-w-xs"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="truncate">{prevSection.title}</span>
                </Link>
              ) : <div />}

              {nextSection ? (
                <Link
                  to={`/tutorial/${tutorialId}/${nextSection.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors max-w-xs ml-auto"
                >
                  <span className="truncate">{nextSection.title}</span>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : <div />}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
