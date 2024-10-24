import React from "react";
import { assets } from "../assets/assets_frontend/assets.js";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* left */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
            doloribus tenetur dolorem ducimus et, provident architecto,
            suscipit, nihil dolor cumque facere consequuntur! Animi eaque sequi
            error. Eligendi libero porro quod.
          </p>
        </div>

        {/* center */}
        <div>
          <h3 className="text-xl font-medium mb-5">COMPANY</h3>
          <ul className="fle flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* right */}
        <div>
          <h3 className="text-xl font-medium mb-5">GET IN TOUCH</h3>
          <ul className="fle flex-col gap-2 text-gray-600">
            <li>+91 87990 72531</li>
            <li>ishwartrada15@gmail.com</li>
          </ul>
        </div>
        {/* Copyright text */}
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2024@ Prescripto - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
