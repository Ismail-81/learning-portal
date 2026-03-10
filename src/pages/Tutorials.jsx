import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "tutorials"),
          where("isActive", "==", true),
          orderBy("order")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTutorials(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tutorials");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading tutorials...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="pt-20 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-red-900">Error</h2>
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">All Tutorials</h1>

        {tutorials.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No tutorials available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((t) => (
              <Link key={t.id} to={`/tutorial/${t.id}`} className="group">
                <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-indigo-600 transition">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">{t.title}</h3>
                  {t.description && <p className="text-gray-600 text-sm mt-2 line-clamp-3">{t.description}</p>}
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    {t.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">Inactive</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
