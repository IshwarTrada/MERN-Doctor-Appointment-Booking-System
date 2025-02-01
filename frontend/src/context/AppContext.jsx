import { createContext } from "react";
import { doctors } from "../assets/assets_frontend/assets.js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = Cookies.get("aToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
    }
  }, []);

  // const token = Cookies.get("token");
  // const role = jwtDecode(token).role;

  const value = {
    role,
    currencySymbol,
    doctors,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
