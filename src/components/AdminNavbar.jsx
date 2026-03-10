import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/auth";
import { auth } from "../firebase/config";
import CodeLearnLogo from "./CodeLearnLogo";

function AdminNavbar({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(auth);
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".avatar-dropdown")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 relative z-50">
      <div className="flex items-center h-16 px-4 md:px-8 lg:px-16 justify-between max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center gap-4">
          <CodeLearnLogo />
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-red-100 text-red-800 uppercase tracking-wider hidden sm:block">
            Admin
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex shrink-0 items-center space-x-4 mr-4">
            <Link
              to="/admin"
              className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Tutorials
            </Link>
            <Link
              to="/admin/contact"
              className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Messages
            </Link>
          </div>

          <Link
            to="/"
            replace={true}
            className="hidden sm:block text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            Back to Site
          </Link>

          {/* Avatar Dropdown */}
          {user && (
            <div className="avatar-dropdown relative">
              {/* Avatar Button */}
              <button
                onClick={() => setOpen(!open)}
                className="relative w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all duration-200"
              >
                <span className="text-sm">
                  {user.email ? user.email[0].toUpperCase() : "A"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 top-14 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.displayName || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/"
                      replace={true}
                      onClick={() => setOpen(false)}
                      className="flex sm:hidden items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors duration-150"
                    >
                      Back to Site
                    </Link>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
