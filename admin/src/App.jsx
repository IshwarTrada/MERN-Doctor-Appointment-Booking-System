import React, { useContext, useEffect } from "react";
import { Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { useState } from "react";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking the token or fetching user data
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state, can be a spinner or skeleton
  }

  // ProtectedRoute
  const ProtectedRoute = ({ children }) => {
    // If no aToken, redirect to /signin
    if (!aToken) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  // Route to prevent logged-in users from accessing the signin page
  const RedirectToHome = () => {
    if (aToken) {
      return <Navigate to="/" />; // Redirect to home if already logged in
    }
    return <Login />;
  };

  return (
    <>
      {aToken && <Navbar />}
      <Routes>
        <Route path="/signin" element={<RedirectToHome />} />
        {/* Wrap Home route inside ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
