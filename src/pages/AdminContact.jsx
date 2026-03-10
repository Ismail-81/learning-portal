import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function AdminContact({ user }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // We reuse the ADMIN_ALLOWLIST approach from the other Admin page
  const ADMIN_ALLOWLIST = ["ismailgheewala1@gmail.com"];
  const isAllowed = user && ADMIN_ALLOWLIST.includes(user.email);

  useEffect(() => {
    if (!isAllowed) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const q = query(
          collection(db, "contactMessages"),
          orderBy("createdAt", "desc"),
        );
        const snapshot = await getDocs(q);

        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Safely format the timestamp
          dateFormatted:
            doc.data().createdAt?.toDate().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) || "Unknown Date",
        }));

        setMessages(fetchedMessages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(
          "Failed to load messages. Please ensure you have appropriate permissions.",
        );
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAllowed]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center max-w-2xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to view contact messages.
        </p>
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contact Submissions
          </h1>
          <p className="text-gray-600 text-sm">
            Review messages submitted through the public public Contact page.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500 mr-2">
            Total Messages:
          </span>
          <span className="text-xl font-bold text-indigo-900">
            {messages.length}
          </span>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-1">
            No messages yet
          </p>
          <p>When users contact you, their messages will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Sender</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-7">Message</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="grid grid-cols-12 px-6 py-5 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 pr-4">
                  <p
                    className="text-sm font-medium text-gray-900 truncate"
                    title={msg.name}
                  >
                    {msg.name}
                  </p>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-indigo-600 hover:text-indigo-900 truncate block mt-0.5"
                    title={msg.email}
                  >
                    {msg.email}
                  </a>
                  {msg.status === "new" && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] uppercase font-bold rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-sm text-gray-500 pr-4">
                  {msg.dateFormatted}
                </div>
                <div className="col-span-7">
                  <div className="text-sm text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap font-sans leading-relaxed">
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContact;
