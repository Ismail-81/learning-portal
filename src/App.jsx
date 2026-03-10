import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import { auth } from "./firebase/config";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./firebase/config";
import ProtectedRoute from "./components/ProtectedRoute";
import TopicDetails from "./pages/TopicDetails";
import Tutorial from "./pages/Tutorial";
import Tutorials from "./pages/Tutorials";
import AdminLayout from "./components/AdminLayout";
import About from "./pages/About";
import Contact from "./pages/Contact";

// New admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminTutorials from "./pages/AdminTutorials";
import AdminSections from "./pages/AdminSections";
import AdminResources from "./pages/AdminResources";
import AdminMessages from "./pages/AdminMessages";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;

  const location = useLocation();
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  const AdminRoute = ({ children }) => (
    <ProtectedRoute user={user}>
      <AdminLayout user={user}>{children}</AdminLayout>
    </ProtectedRoute>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {!hideLayout && <Header user={user} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tutorials" element={<Tutorials />} />

        <Route
          path="/tutorial/:tutorialId"
          element={<ProtectedRoute user={user}><Tutorial /></ProtectedRoute>}
        />
        <Route
          path="/tutorial/:tutorialId/:sectionId"
          element={<ProtectedRoute user={user}><TopicDetails /></ProtectedRoute>}
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/tutorials" element={<AdminRoute><AdminTutorials /></AdminRoute>} />
        <Route path="/admin/sections" element={<AdminRoute><AdminSections /></AdminRoute>} />
        <Route path="/admin/resources" element={<AdminRoute><AdminResources /></AdminRoute>} />
        <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />

        {/* Legacy redirect */}
        <Route path="/admin/contact" element={<AdminRoute><AdminMessages /></AdminRoute>} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
