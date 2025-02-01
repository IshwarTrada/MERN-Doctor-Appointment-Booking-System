import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const tokenFromCookies = Cookies.get("token");
  const [aToken, setAToken] = useState(tokenFromCookies || "");
  const [role, setRole] = useState("");

  // If token exists, decode it and set the role
  useEffect(() => {
    if (aToken) {
      const decodedToken = jwtDecode(aToken);
      setRole(decodedToken.role);
    }
  }, [aToken]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const value = {
    aToken,
    setAToken,
    role,
    setRole,
    backendUrl,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
