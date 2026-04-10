import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

function Home() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tutorials from Firestore
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        // Query the tutorials collection
        // Filter only active tutorials and sort by order field
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
          ...doc.data(),
        }));

        setTutorials(tutorialsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* full-screen two-column layout: text left, illustration right */}
      <section
        className="relative bg-gray-50 bg-cover bg-center bg-no-repeat flex items-center justify-center pt-8 h-screen"
        // style={{
        //   // backgroundImage:
        //   //   "linear-gradient(rgba(238,242,255,0.7), rgba(255,255,255,0.85)), url('https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        // }}
      >
        <div className="max-w-7xl mx-auto px-6 py-32 lg:py-40">
          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            {/* text block */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 rounded-full">
                <span className="text-sm font-medium text-indigo-900">
                  Theory-First Learning Platform
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Master Programming Through <br className="hidden lg:block" />
                <span className="text-indigo-600">Structured Theory</span>
              </h1>

              <p className="text-base md:text-xl text-gray-600 mb-8 leading-relaxed">
                Learn programming concepts with comprehensive theory explanations,
                practical code examples, detailed explanations, downloadable PDF
                notes, and curated video references.
              </p>

              <button
                onClick={() => {
                  const section = document.getElementById("tutorials");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-block px-8 py-3 bg-indigo-900 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Explore Tutorials
              </button>
            </div>

            {/* illustration/image for larger screens */}
            <div className="mt-12 lg:mt-0 lg:w-3/5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
                alt="Coding illustration"
                className="w-full max-w-xl rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

    
      <section id="tutorials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Available Tutorials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a tutorial to start your structured learning journey
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading tutorials...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-600 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {tutorial.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {tutorial.description}
                  </p>
                  <Link
                    to={`/tutorial/${tutorial.id}`}
                    className="block w-full py-2.5 text-center bg-indigo-900 text-white font-medium rounded-lg hover:bg-indigo-800 transition-colors"
                  >
                    View Tutorial
                  </Link>
                </div>
              ))}
            </div>
          )}

          {!loading && tutorials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No tutorials available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* What's Inside a Tutorial Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What's Inside Each Tutorial?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every tutorial is carefully structured to ensure comprehensive
              understanding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Multiple Theory Sections
              </h3>
              <p className="text-gray-600">
                Topics organized logically for progressive learning
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Code Examples
              </h3>
              <p className="text-gray-600">
                Real, working code for every concept
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Clear Explanations
              </h3>
              <p className="text-gray-600">
                Detailed breakdowns of how code works
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                PDF Notes
              </h3>
              <p className="text-gray-600">
                Downloadable notes for offline study
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Video References
              </h3>
              <p className="text-gray-600">
                Curated videos for visual learning
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Exam-Ready Content
              </h3>
              <p className="text-gray-600">
                Structured for academic preparation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Content Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How You'll Learn
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every section follows a proven learning structure
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
              {/* Sample Topic */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-900 text-sm font-semibold rounded-full mb-3">
                  Sample Section
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  HTML Paragraph Tag
                </h3>
                <p className="text-gray-600">
                  Understanding how to create paragraphs in HTML
                </p>
              </div>

              {/* Theory */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Definition:</h4>
                <p className="text-gray-700 leading-relaxed">
                  The{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                    &lt;p&gt;
                  </code>{" "}
                  tag defines a paragraph in HTML. Browsers automatically add
                  space before and after each paragraph, making content more
                  readable.
                </p>
              </div>

              {/* Code Example */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="ml-4 text-gray-400 text-sm">
                    example.html
                  </span>
                </div>
                <pre className="text-green-400 font-mono text-sm">
                  {`<p>This is a paragraph.</p>
<p>This is another paragraph.</p>`}
                </pre>
              </div>

              {/* Explanation */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-3">
                   Explanation:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      Each{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        &lt;p&gt;
                      </code>{" "}
                      tag creates a new paragraph block
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>Browsers add default spacing between paragraphs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span>
                      Always close the paragraph with{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        &lt;/p&gt;
                      </code>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Begin your journey with structured, theory-based programming
            tutorials
          </p>
          <button
              onClick={() => {
                const section = document.getElementById("tutorials");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            className="inline-block px-8 py-4 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg"
          >
            Browse Tutorials
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
