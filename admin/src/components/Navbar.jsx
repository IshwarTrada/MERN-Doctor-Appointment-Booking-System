import React from "react";
import { assets } from "../assets/assets_admin/assets";



const Navbar = () => {
  return (
    <div>
      <div>
        <img src={assets.admin_logo} alt="" />
        <p>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
    </div>
  );
};

export default Navbar;
