import React from "react";
import { assets } from "../assets/assets_frontend/assets.js";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <h1>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </h1>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <h2 className="font-semibold text-lg text-gray-600">OUR OFFICE</h2>
          <p className="text-gray-500">
            54709 William Station <br />
            Suite 350, Washington, USA
          </p>
          <p className="text-gray-500">
            Tel: +91 87990 71304 <br />
            Email: ishwartrada15@gmail.com
          </p>
          <h2 className="font-semibold text-lg text-gray-600">CAREERS AT PRESCRIPTO</h2>
          <p className="text-gray-500">Learn more about our teams and job openings.</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">Explore Jobs</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
