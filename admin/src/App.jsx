import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllAppointments from "./pages/Admin/AllAppointments.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";
import { DoctorContext } from "./context/DoctorContext.jsx";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";

const App = () => {
  const { aToken, role } = useContext(AdminContext);
  const { dToken, dRole } = useContext(DoctorContext);
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
      return <Login />;
    }
    return children;
  };

  // Route to prevent logged-in users from accessing the signin page
  const RedirectToHome = () => {
    if (aToken) {
      return <Navigate to="admin/" />; // Redirect to home if already logged in
    }else if (dToken) {
      return <Navigate to="doctor/" />; // Redirect to home if already logged in
    }
    return <Login />;
  };

  return (
    <>
      {/* Display Navbar and Sidebar only for authenticated users with appropriate role */}
      {aToken && role !== "USER" && (
        <>
          <Navbar />
          <div className="flex items-start bg-[#f2f3ff]">
            <Sidebar adminSidebar />
            <Routes>
              <Route path="admin/" element={<></>} />
              <Route path="admin/admin-dashboard" element={<Dashboard />} />
              <Route
                path="admin/all-appointments"
                element={<AllAppointments />}
              />
              <Route
                path="admin/add-doctor"
                element={
                  <ProtectedRoute>
                    <AddDoctor />
                   </ProtectedRoute>
                }
              />
              <Route path="admin/doctor-list" element={<DoctorsList />} />
            </Routes>
          </div>
        </>
      )}

      {dToken && dRole !== "USER" && (
        <>
          <Navbar />
          <div className="flex items-start bg-[#f2f3ff]">
            <Sidebar doctorSidebar />
            <Routes>
              <Route path="doctor/" element={<></>} />
              <Route path="doctor/doctor-dashboard" element={<DoctorDashboard />} />
              <Route
                path="doctor/doctor-appointments"
                element={<DoctorAppointments />}
              />
              <Route path="doctor/doctor-profile" element={<DoctorProfile />} />
            </Routes>
          </div>
        </>
      )}

      <Routes>
        <Route path="/" element={<RedirectToHome />} />
        {/* Wrap Home route inside ProtectedRoute */}
        {/* <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        /> */}
        {/* Catch-all route for undefined paths */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
