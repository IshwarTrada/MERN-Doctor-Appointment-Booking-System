import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_admin/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext.jsx";

const Login = () => {
  const {role, setRole, setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken,dRole, setDRole } = useContext(DoctorContext);
  const [state, setState] = useState(role || dRole ||"ADMIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Perform the appropriate login API request based on the state (Admin or Doctor)
      if (state === "ADMIN") {
        const { data } = await axios.post(
          `${backendUrl}/api/v1/admin/login`,
          { email, password },
          { withCredentials: true }
        );

        if (data.success) {
          // The server sets the cookie, so we read it here
          const token = Cookies.get("aToken");

          if (token) {
            toast.success(data.message); // Show login success message
            setAToken(token);

            // Decode the token and set the role
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);

            // Navigate to the home page
            navigate("/");
          } else {
            toast.error("Token not found in cookies"); // If token isn't found in cookies
          }
        } else {
          toast.error(data.message || "Login failed");
        }
      } else if (state === "DOCTOR") {
        const { data } = await axios.post(
          `${backendUrl}/api/v1/doctor/login`,
          { email, password },
          { withCredentials: true }
        );

        if (data.success) {
          // The server sets the cookie, so we read it here
          const token = Cookies.get("dToken");

          if (token) {
            toast.success(data.message); // Show login success message

            // Set token in DoctorContext
            setDToken(token);

            // Decode the token and set the role
            const decodedToken = jwtDecode(token);
            setDRole(decodedToken.role);
            console.log("doctor spotted",decodedToken.role);
            
            // Navigate to the home page
            navigate("/doctor");
          } else {
            toast.error("Token not found in cookies"); // If token isn't found in cookies
          }
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <h1 className="text-2xl font-semibold m-auto ">
          <span className="text-primary">{state}</span> Login
        </h1>
        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === "ADMIN" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("DOCTOR")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("ADMIN")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
