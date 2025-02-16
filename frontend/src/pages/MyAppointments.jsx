import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] +
      " " +
      months[parseInt(dateArray[1] - 1)] +
      " " +
      dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/user/appointments`,
        { withCredentials: true }
      );

      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/v1/user/cancel-appointment`,
        { appointmentId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  // Payment function 1
  const initPayment = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Doctor Appointment Payment",
      description: "Payment for appointment",
      image: "https://via.placeholder.com/150",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        // Call the verify payment API
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/v1/user/verify-payment`,
            response,
            { withCredentials: true }
          );

          if (data.success) {
            toast.success(data.message);
            getUserAppointments();
            navigate("/my-appointments");
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message);
        }
      },
    };

    // pop up payment window
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Payment function 2 - API call to backend
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/payment-razorpay`,
        { appointmentId },
        { withCredentials: true }
      );
      console.log(data);

      if (data.success) {
        //
        initPayment(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <h2 className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </h2>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <h3 className="text-neutral-800 font-semibold">
                {item.docData.name}
              </h3>
              <h4>{item.docData.speciality}</h4>
              <p className="text-zinc-700 font-medium mt-1">Address : </p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:{" "}
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded bg-green-500 text-white cursor-default">
                  Paid
                </button>
              )}
              {!item.cancelled && !item.payment && (
                <button
                  onClick={() => appointmentRazorpay(item._id)}
                  className="text-sm text-center sm:min-w-48 py-2 border rounded bg-primary text-white hover:bg-indigo-600 transition-all duration-300"
                >
                  Pay Online
                </button>
              )}
              {!item.cancelled && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 cursor-not-allowed">
                  Appointment Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
