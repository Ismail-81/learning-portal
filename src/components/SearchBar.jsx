import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [queryText, setQueryText] = useState("");
  const [tutorials, setTutorials] = useState([]);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const q = query(
          collection(db, "tutorials"),
          where("isActive", "==", true),
          orderBy("order")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTutorials(data);
      } catch (err) {
        console.error("Error fetching tutorials for search:", err);
      }
    };

    fetchTutorials();
  }, []);

  useEffect(() => {
    if (!queryText.trim()) {
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    const q = queryText.trim().toLowerCase();
    const filtered = tutorials.filter((t) => {
      const title = (t.title || "").toLowerCase();
      const desc = (t.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });

    setResults(filtered.slice(0, 7));
    setOpen(true);
    setActiveIndex(-1);
  }, [queryText, tutorials]);

  useEffect(() => {
    const onClick = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const handleSelect = (t) => {
    navigate(`/tutorial/${t.id}`);
    setOpen(false);
    setQueryText("");
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((p) => Math.min(p + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((p) => Math.max(p - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelect(results[activeIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-64 lg:w-80">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        onKeyDown={onKeyDown}
        type="text"
        placeholder="Search tutorials..."
        className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600"
        onFocus={() => { if (results.length) setOpen(true); }}
      />

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No results</div>
          ) : (
            results.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => handleSelect(t)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-800 transition ${
                  idx === activeIndex ? "bg-indigo-50 text-indigo-800" : "text-gray-700"
                }`}
              >
                <div className="font-medium">{t.title}</div>
                {t.description && <div className="text-xs text-gray-500 truncate">{t.description}</div>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
