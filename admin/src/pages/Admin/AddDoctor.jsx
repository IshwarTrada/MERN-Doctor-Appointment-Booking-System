import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const { backendUrl } = useContext(AdminContext);
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [aiDocDescription, setAiDocDescription] = useState(
    "Description from AI"
  );
  const [showSwapButton, setShowSwapButton] = useState(false); // To show swap button after AI generation
  const [isLoading, setIsLoading] = useState(false);

  // Ai prephraser for doctor description
  const textCortexPrephraser = async (text) => {
    setIsLoading(true);
    const options = {
      data: {
        text: text,
        formality: "default",
        max_tokens: 2048,
        mode: "default",
        model: "gemini-2-0-flash",
        n: 1,
        source_lang: "en",
        target_lang: "en",
        temperature: null,
      },
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_TEXT_CORTEX_URL}`,
        options.data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TEXT_CORTEX_API_KEY}`,
          },
        }
      );
      console.log(import.meta.env.VITE_TEXT_CORTEX_API_KEY); // Check the value here

      if (data.status === "success") {
        setAiDocDescription(data.data.outputs[0].text);
        setShowSwapButton(true);
      } else {
        toast.error("Error while rephrasing the text");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while rephrasing the text");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the AI generated text swap with current description
  const handleSwapDescription = () => {
    setAbout(aiDocDescription); // Replace current description with AI-generated description
    setShowSwapButton(false); // Hide swap button after use
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Doctor image not uploaded.");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("degree", degree);
      formData.append("experience", experience);
      formData.append("about", about);
      formData.append("fees", fees);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );
      formData.append("speciality", speciality);
      formData.append("image", docImg);

      formData.forEach((value, key) => {
        console.log(key, ":", value);
      });

      const { data } = await axios.post(
        `${backendUrl}/api/v1/admin/add-doctor`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setName("");
        setEmail("");
        setPassword("");
        setFees("");
        setAbout("");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setDocImg(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-5 w-full">
      <h1 className="mb-3 text-lg font-medium">Add Doctor</h1>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload Doctor Photo"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Side */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="docName">Doctor Name</label>
              <input
                type="text"
                id="docName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="docEmail">Doctor Email</label>
              <input
                type="email"
                id="docEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="docPassword">Doctor Password</label>
              <input
                type="password"
                id="docPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="docExperience">Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                id="docExperience"
                className="border rounded px-3 py-2"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="docFees">Fees</label>
              <input
                type="number"
                id="docFees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="Doctor Fees"
                className="border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Right side */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="docSpeciality">Speciality</label>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                id="docSpeciality"
                className="border rounded px-3 py-2"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="docEducation">Education</label>
              <input
                type="text"
                id="docEducation"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Doctor's Education"
                className="border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="add1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                placeholder="Doctor's Address Line 1"
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                id="add2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="Doctor's Address Line 2"
                className="border rounded px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        {/* <div className="">
          <label htmlFor="docAbout" className="block mt-4 mb-2">
            About Doctor
          </label>
          <textarea
            rows={5}
            placeholder="Write about doctor"
            id="docAbout"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 pt-2 border rounded"
          ></textarea>
          <button
            type="button"
            onClick={() => textCortexPrephraser(about)}
            className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
          >
            Rephrase using AI
          </button>
          <textarea
            rows={5}
            placeholder="Description from AI"
            id="descFromAi"
            value={aiDocDescription}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 pt-2 border rounded"
          ></textarea>
        </div> */}
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="docAbout" className="block mt-4 mb-2">
            About Doctor
          </label>
          <textarea
            rows={5}
            placeholder="Write about doctor"
            id="docAbout"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 pt-2 border rounded"
          ></textarea>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => textCortexPrephraser(about)}
              className="text-xs bg-violet-700/95 px-5 py-3 mt-4 text-white rounded-full max-w-40"
            >
              {isLoading ? (
                <div class="loader">
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                </div>
              ) : (
                "Rephrase using AI"
              )}
            </button>

            {aiDocDescription &&
              showSwapButton &&
              (isLoading ? (
                <p></p>
              ) : (
                <button
                  type="button"
                  onClick={handleSwapDescription}
                  className="text-xs bg-primary px-5 py-3 mt-4 text-white rounded-full max-w-40"
                >
                  Swap
                </button>
              ))}
          </div>
          <p
            id="descFromAi"
            readOnly
            className="text-gray-600 w-full px-4 pt-2 border rounded mt-4 min-h-10 text-sm"
          >
            {aiDocDescription}
          </p>
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
