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

  // If token exists, decode it and set the role
  useEffect(() => {
    if (dToken) {
      const decodedToken = jwtDecode(dToken);
      setDRole(decodedToken.role);
    }
  }, [dToken]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = { backendUrl, dToken, setDToken, dRole, setDRole };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
