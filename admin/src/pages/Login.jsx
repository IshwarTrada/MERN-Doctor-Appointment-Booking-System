import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_admin/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("ADMIN");
  const { setRole, setAToken, backendUrl } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let res;

      // Perform the appropriate login API request based on the state (Admin or Doctor)
      if (state === "ADMIN") {
        res = await axios.post(
          `${backendUrl}/api/v1/admin/login`,
          { email, password },
          { withCredentials: true }
        );
      } else if (state === "DOCTOR") {
        res = await axios.post(
          `${backendUrl}/api/v1/doctor/login`,
          { email, password },
          { withCredentials: true }
        );
      }

      if (res && res.data.success) {
        // The server sets the cookie, so we read it here
        const token = Cookies.get("token");

        if (token) {
          toast.success(res.data.message); // Show login success message

          // Set token in AdminContext
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
        toast.error(res.data.message || "Login failed");
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
