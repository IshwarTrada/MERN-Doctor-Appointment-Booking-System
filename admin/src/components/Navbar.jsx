import React from "react";
import { assets } from "../assets/assets_admin/assets";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext.jsx";
import { useContext } from "react";
import { toast } from "react-toastify";

const Navbar = () => {
  const { setAToken, role, setRole, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { data } = await axios.post(
      `${backendUrl}/api/v1/logout`,
      {},
      { withCredentials: true }
    );

    if (data.success) {
      setAToken("");
      setRole("");
      toast.success(data.message);
      navigate("/signin");
    } else {
      console.log(data.message);
      toast.error(data.message);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {role}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
