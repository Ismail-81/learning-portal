import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Tutorial() {
  const { tutorialId } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorialAndSections = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tutorial document
        const tutorialRef = doc(db, "tutorials", tutorialId);
        const tutorialSnap = await getDoc(tutorialRef);

        if (!tutorialSnap.exists()) {
          setError("Tutorial not found");
          setLoading(false);
          return;
        }

        setTutorial({
          id: tutorialSnap.id,
          ...tutorialSnap.data(),
        });

        // Fetch all sections for this tutorial
        const sectionsRef = collection(db, "tutorials", tutorialId, "sections");
        const q = query(sectionsRef, orderBy("order", "asc"));
        const sectionsSnap = await getDocs(q);

        const sectionsData = sectionsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSections(sectionsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tutorial:", err);
        setError("Failed to load tutorial");
        setLoading(false);
      }
    };

    if (tutorialId) {
      fetchTutorialAndSections();
    }
  }, [tutorialId]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-red-900 mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
            <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-11 min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium mb-6 inline-block">
          ← Back to Home
        </Link>

        {/* Tutorial Header */}
        {tutorial && (
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{tutorial.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
              {tutorial.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-900 rounded-lg font-medium text-sm">
                {sections.length} {sections.length === 1 ? "Topic" : "Topics"}
              </span>
              {tutorial.isActive && (
                <span className="inline-block px-4 py-2 bg-green-100 text-green-900 rounded-lg font-medium text-sm">
                  Active
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sections Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Topics to Learn</h2>

          {sections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section, idx) => (
                <Link
                  key={section.id}
                  to={`/tutorial/${tutorialId}/${section.id}`}
                  className="group"
                >
                  <div className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    {/* Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        Topic {idx + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                      {section.title}
                    </h3>

                    {/* Preview of content */}
                    {section.content && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {section.content}
                      </p>
                    )}

                    {/* Resource indicators */}
                    {section.resources && Object.keys(section.resources).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Resources: {Object.keys(section.resources).join(", ")}
                      </div>
                    )}

                    {/* Arrow indicator */}
                    <div className="mt-4 text-indigo-600 group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No topics available yet for this tutorial.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
