import { createContext, useEffect, useState } from "react";
import { doctors } from "../assets/assets_frontend/assets.js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const tokenFromCookies = Cookies.get("token");
  const [token, setToken] = useState(tokenFromCookies || "");
  const [role, setRole] = useState("");

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

  const value = {
    role,
    setRole,
    token,
    setToken,
    currencySymbol,
    doctors,
    backendUrl,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
