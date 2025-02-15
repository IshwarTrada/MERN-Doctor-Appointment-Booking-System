import { createContext, useEffect, useState } from "react";
import { doctors } from "../assets/assets_frontend/assets.js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { use } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const tokenFromCookies = Cookies.get("token");
  const [token, setToken] = useState(tokenFromCookies || "");
  const [role, setRole] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(false);

  const currencySymbol = "₹";
  // If token exists, decode it and set the role
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setToken(token);
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
    }
  }, []);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/doctor/list`, {
        withCredentials: true,
      });

      if (data.success) {
        setDoctors(data.data);
        console.log(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/user/profile`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    role,
    setRole,
    token,
    setToken,
    currencySymbol,
    doctors,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
