import { Link } from "react-router-dom";
import CodeLearnLogo from "./CodeLearnLogo";

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-900 mt-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CodeLearnLogo darkMode={true}/>
            </div>
            
            <p className="text-sm text-gray-400 mt-2">
              An online platform to learn coding skills and build a strong
              programming foundation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-indigo-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-600">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-600">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              Contact
            </h3>
            <p className="text-sm text-gray-600">
              Email: support@codelearn.com
            </p>
            <p className="text-sm text-gray-600 mt-1">Location: India</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-8 pt-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CodeLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
