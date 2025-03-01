import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const tokenFromCookies = Cookies.get("dToken");
  const [dToken, setDToken] = useState(tokenFromCookies || "");
  const [dRole, setDRole] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // If token exists, decode it and set the role
  useEffect(() => {
    if (dToken) {
      const decodedToken = jwtDecode(dToken);
      setDRole(decodedToken.role);
    }
  }, [dToken]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/doctor/appointments`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const completeAppointment = async (appointmentId,docId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/v1/doctor/complete-appointment`,
        { appointmentId ,docId},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const cancelAppointment = async (appointmentId,docId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/v1/doctor/cancel-appointment`,
        { appointmentId,docId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/doctor/dashboard`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setDashData(data.data);
      }
    } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/doctor/profile`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setProfileData(data.data);
      }
    } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.message);
    }
  };

  const value = {
    backendUrl,
    dToken,
    setDToken,
    dRole,
    setDRole,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashboardData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
