import React from "react";
import { AdminContext } from "../context/AdminContext";
import { useContext } from "react";

const Home = () => {
  const { role } = useContext(AdminContext);
  return (
    <div>
      <h1>{role}</h1>
      <p>asjnknk</p>
    </div>
  );
};

export default Home;
