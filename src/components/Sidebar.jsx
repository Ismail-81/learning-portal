import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Sidebar() {
  const { tutorialId, sectionId } = useParams();
  const [tutorials, setTutorials] = useState([]);
  const [expandedTutorial, setExpandedTutorial] = useState(tutorialId || null);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all active tutorials from Firestore
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);

        // Query tutorials collection: only active tutorials, sorted by order
        const tutorialsRef = collection(db, "tutorials");
        const q = query(
          tutorialsRef,
          where("isActive", "==", true),
          orderBy("order", "asc")
        );

        const snapshot = await getDocs(q);

        // Map documents to usable data
        const tutorialsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          order: doc.data().order,
          description: doc.data().description || "",
        }));

        setTutorials(tutorialsData);

        // Automatically expand the current tutorial if navigated from route
        if (tutorialId) {
          setExpandedTutorial(tutorialId);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
        setLoading(false);
      }
    };

    fetchTutorials();
  }, [tutorialId]);

  // Fetch sections for a specific tutorial
  const fetchSectionsForTutorial = async (tId) => {
    // Return cached sections if already loaded
    if (sections[tId]) {
      return;
    }

    try {
      // Query the sections subcollection: sorted by order
      const sectionsRef = collection(db, `tutorials/${tId}/sections`);
      const q = query(sectionsRef, orderBy("order", "asc"));

      const snapshot = await getDocs(q);

      // Map documents to usable data
      const sectionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        order: doc.data().order,
      }));

      // Store sections in state keyed by tutorial ID
      setSections((prev) => ({
        ...prev,
        [tId]: sectionsData,
      }));
    } catch (error) {
      console.error(`Error fetching sections for ${tId}:`, error);
    }
  };

  // Handle tutorial expansion
  const handleTutorialClick = (tId) => {
    if (expandedTutorial === tId) {
      // Collapse if clicking same tutorial
      setExpandedTutorial(null);
    } else {
      // Expand and fetch sections if not already loaded
      setExpandedTutorial(tId);
      fetchSectionsForTutorial(tId);
    }
  };

  if (loading) {
    return (
      <aside className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-6 md:min-h-screen">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading tutorials...</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    // padding top ensures content begins below the fixed header on all viewports
    <aside className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-6 pt-16 md:min-h-screen md:sticky md:top-16">
      <div>
        {/* Sidebar Header */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide text-xs">
          Tutorials
        </h2>

        {/* Tutorials List */}
        <nav className="space-y-1">
          {tutorials.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No tutorials available</p>
          ) : (
            tutorials.map((tutorial) => (
              <div key={tutorial.id}>
                {/* Tutorial Button - Expandable */}
                <button
                  onClick={() => handleTutorialClick(tutorial.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    expandedTutorial === tutorial.id
                      ? "bg-indigo-100 text-indigo-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-expanded={expandedTutorial === tutorial.id}
                >
                  <span className="text-left text-sm">{tutorial.title}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${
                      expandedTutorial === tutorial.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Sections List - Shown when expanded */}
                {expandedTutorial === tutorial.id && (
                  <div className="mt-2 ml-4 space-y-1 border-l-2 border-indigo-200 pl-4">
                    {sections[tutorial.id]?.length > 0 ? (
                      sections[tutorial.id].map((section) => (
                        <Link
                          key={section.id}
                          to={`/tutorial/${tutorial.id}/${section.id}`}
                          className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                            sectionId === section.id
                              ? "bg-indigo-600 text-white font-medium"
                              : "text-gray-600 hover:text-indigo-600 hover:bg-white"
                          }`}
                        >
                          {section.title}
                        </Link>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic px-4 py-2">
                        No sections available
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Select a tutorial to explore topics
        </p>
      </div>
    </aside>
  );
}
