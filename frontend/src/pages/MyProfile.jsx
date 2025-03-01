import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets_frontend/assets.js";
import { toast } from "react-toastify";
import axios from "axios";

const Myprofile = () => {
  const { userData, setUserData, loadUserProfileData, backendUrl } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [editedData, setEditedData] = useState(userData || {});
  const [image, setImage] = useState(false);

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEdit(false);
  };

  const handleEdit = () => {
    setEditedData(userData);
    setIsEdit(true);
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editedData.name);
      formData.append("phone", editedData.phone);
      formData.append("gender", editedData.gender);
      formData.append("dob", editedData.dob);
      formData.append("address", JSON.stringify(editedData.address));
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.patch(
        `${backendUrl}/api/v1/update-profile`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm m-auto">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75 "
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? "" : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img
            className="w-36 rounded"
            src={userData.image}
            alt="User Profile Image"
          />
        )}

        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
            type="text"
            value={editedData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        ) : (
          <p className="text-3xl font-medium text-neutral-800 mt-4">
            {userData.name}
          </p>
        )}
        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <h2 className="text-xl text-neutral-500 underline mt-3">
            CONTACT INFORMATION
          </h2>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500">{userData.email}</p>

            <p className="font-medium">
              <label htmlFor="phone">Phone:</label>
            </p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="text"
                name="phone"
                value={editedData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            ) : (
              <p className="text-blue-400">{userData.phone}</p>
            )}

            <p className="font-medium">
              <label htmlFor="address">Address:</label>
            </p>
            {isEdit ? (
              <p>
                <input
                  className="bg-gray-50"
                  type="text"
                  value={editedData.address.line1}
                  onChange={(e) => handleAddressChange("line1", e.target.value)}
                />
                <br />
                <input
                  className="bg-gray-50"
                  type="text"
                  value={editedData.address.line2}
                  onChange={(e) => handleAddressChange("line2", e.target.value)}
                />
              </p>
            ) : (
              <p className="text-gray-500">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl text-neutral-500 underline mt-3">
            BASIC INFORMATION
          </h2>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">
              <label htmlFor="gender">Gender: </label>
            </p>

            {isEdit ? (
              <select
                className="max-w-20 bg-gray-100"
                name="gender"
                value={editedData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-500">{userData.gender}</p>
            )}

            <p className="font-medium">
              <label htmlFor="dob">Birthday: </label>
            </p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="date"
                value={editedData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
              />
            ) : (
              <p className="text-gray-500">{userData.dob}</p>
            )}
          </div>
        </div>
        <div className="mt-10">
          {isEdit ? (
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={updateUserProfileData}
            >
              Save Information
            </button>
          ) : (
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default Myprofile;
