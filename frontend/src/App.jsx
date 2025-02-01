import React, { useContext, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Doctors from "./pages/Doctors.jsx";
import Login from "./pages/Login.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import MyAppointments from "./pages/MyAppointments.jsx";
import Appointment from "./pages/Appointment.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "./context/AppContext.jsx";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const { token, setToken, setRole } = useContext(AppContext);

  // ProtectedRoute
  const ProtectedRoute = ({ children }) => {
    // If no aToken, redirect to /signin
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // RedirectToHome component
  const RedirectToHome = () => {
    if (token) {
      return <Navigate to="/" />; // Redirect to home if already logged in
    }
    return <Login />;
  };

  return (
    <div className="mx-4 sm:mx[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<RedirectToHome />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route path="/appointment/:docId" element={<Appointment />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default App;
