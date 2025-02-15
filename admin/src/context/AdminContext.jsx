import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const tokenFromCookies = Cookies.get("token");
  const [aToken, setAToken] = useState(tokenFromCookies || "");
  const [role, setRole] = useState("");
  const [doctors, setDoctors] = useState([]);

  // If token exists, decode it and set the role
  useEffect(() => {
    if (aToken) {
      const decodedToken = jwtDecode(aToken);
      setRole(decodedToken.role);
    }
  }, [aToken]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/admin/all-doctors`,
        { withCredentials: true }
      );

      if (data.success) {
        setDoctors(data.data);
        console.log(data.data);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching doctors list", error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/v1/admin/change-availability`,
        { docId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while changing doctor availability", error.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    role,
    setRole,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
