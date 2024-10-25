import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <h1>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </h1>
      </div>

      <div className="flex my-10 flex-col md:flex-row gap-12 justify-center">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to Prescripto, Your Trusted Partner in Managing Your
            Healthcare Needs Conviniently And Efficiently At Prescripto.We
            Understand The Challenges Individuals Face When It Comes To
            Scheduling Doctor Appointments And Managing Their Health Records.
          </p>
          <p>
            Prescripto Is Commited To Excellence In Healthcare Technology. We
            Continuously Strive To Enhance Our Platform, You're Booking Your
            First Appointment Or Managing Ongoing Care, Prescripto Is Here To
            Support You Every Step Of The Way.
          </p>
          <h2 className="text-gray-800 font-black">Our Vision</h2>
          <p>
            Our Vision At Prescripto Is To Create A Seamless Healthcare
            Experience For Every User.We Aim To Bridge The Gap Between Patients
            And Healthcare Providers, Making It Easier For You To Access The
            Care You Need, When You Need it.
          </p>
        </div>
      </div>

      {/* why choose us */}
      <div className="text-xl my-4 text-center text-gray-500 pt-10">
        <h2>
          WHY <span className="text-gray-700 font-semibold"> CHOOSE US</span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <h3 className="font-bold">Efficiency:</h3>
          <p>
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <h3 className="font-bold">Convenience:</h3>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <h3 className="font-bold">Personalization:</h3>
          <p>
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
