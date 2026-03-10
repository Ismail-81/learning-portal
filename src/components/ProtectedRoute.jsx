import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    // Redirect to login but preserve the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute
