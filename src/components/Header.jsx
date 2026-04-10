import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/auth";
import { auth } from "../firebase/config";
import CodeLearnLogo from "./CodeLearnLogo";
import SearchBar from "./SearchBar";

function Header({ user }) {
  const [scrolled, setScrolled] = useState(false);
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
  useEffect(() => {
    // keep header scroll effect only
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur"
      }`}
    >
      <div className="flex items-center h-16 px-4 md:px-8 lg:px-16 justify-between">
        {/* Logo */}
        <CodeLearnLogo />

        {/* Navigation */}
        <nav className="hidden lg:flex gap-2 items-center">
          <Link
            to="/"
            className="px-4 py-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="px-4 py-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            About
          </Link>

          <Link
            to="/tutorials"
            className="px-4 py-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            Tutorials
          </Link>

          <Link
            to="/contact"
            className="px-4 py-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side: Search + Auth */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="hidden md:flex">
            <SearchBar />
          </div>

          {/* Auth */}
          <div className="relative flex items-center gap-3">
            {/* If NOT logged in */}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}

            {/* If logged in */}
            {user && (
              <div className="avatar-dropdown">
                {/* Avatar Button */}
                <button
                  onClick={() => setOpen(!open)}
                  className="relative w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all duration-200"
                >
                  <span className="text-sm">{user.email[0].toUpperCase()}</span>
                </button>

                {/* Dropdown Menu */}
                {open && (
                  <div className="absolute right-0 top-14 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {user.email === "ismailgheewala1@gmail.com" && (
                        <Link
                          to="/admin"
                          onClick={() => setOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors duration-150"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
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
      </div>
    </header>
  );
}

export default Header;
