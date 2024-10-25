import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets_frontend/assets.js";
import RelatedDoctors from "../components/RelatedDoctors.jsx";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  const getAvailableSlots = async () => {
    // Reset the document slots to an empty array
    setDocSlots([]);
  
    // Get the current date and time
    const today = new Date();
  
    // Loop through the next 7 days (0 to 6)
    for (let i = 0; i < 7; i++) {
      // Create a new date object for the current iteration
      let currentDate = new Date(today);
      // Set the date of currentDate to today + i (for the next days)
      currentDate.setDate(today.getDate() + i);
  
      // Create an end time for the current date, set to 9:00 PM
      let endTime = new Date();
      endTime.setDate(today.getDate() + i); // Set the same date as currentDate
      endTime.setHours(21, 0, 0, 0); // Set hours to 21 (9 PM), minutes and seconds to 0
  
      // Determine the starting hour and minute for the first slot of today
      if (today.getDate() === currentDate.getDate()) {
        // If processing today
        // Set currentDate hour to (currenthour + 1) if it's already past 10 AM, otherwise set to 10 AM
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        // Set minutes to 30 if it's past the half-hour mark, otherwise to 0
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        // For future dates, start at 10:00 AM
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
  
      // Initialize an empty array to hold time slots for the current date
      let timeSlots = [];
      
      // Loop to create time slots until the end time is reached
      while (currentDate < endTime) {
        // Format the current time into a readable string (HH:MM AM/PM)
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
  
        // Add the formatted time slot to the timeSlots array
        timeSlots.push({
          datetime: new Date(currentDate), // Store the full date object
          time: formattedTime, // Store the formatted time string
        });
  
        // Increment the current date by 30 minutes for the next slot
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      
      // Update the document slots with the newly created time slots
      setDocSlots((prevSlots) => [...prevSlots, timeSlots]);
    }
  };
  

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div>
        {/* -----------------Doctor Details ------------------ */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* Doc Info : name , degree, experience */}
            <h1 className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </h1>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <h3>
                {docInfo.degree} - {docInfo.speciality}
              </h3>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* Doctor About */}
            <div>
              <h2 className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </h2>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* ----------------Booking Slots-------------- */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <h4>Booking Slots</h4>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((slots, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{slots[0] && daysOfWeek[slots[0].datetime.getDay()]}</p>
                  <p>{slots[0] && slots[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((slot, index) => (
                <p
                  onClick={() => setSlotTime(slot.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    slot.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {slot.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">
            Book an appointment
          </button>
        </div>

        {/* ----------------Listing Related Doctors ------------ */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
