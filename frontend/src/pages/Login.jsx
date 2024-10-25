import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <h1 className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h1>
        <p>
          Please {state === "Sign Up" ? "sign up" : "login"} to book appointment
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <label htmlFor="fullName">Full Name</label>
            <input
              className="border border-zinc-300 rounded w-full p-2 m-1"
              type="text"
              name="fullName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="w-full">
          <label htmlFor="emailId">Email</label>
          <input
            className="border border-zinc-300 rounded w-full p-2 m-1"
            type="email"
            name="emailId"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            className="border border-zinc-300 rounded w-full p-2 m-1"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="bg-primary w-full text-white py-2 rounded-md text-base "
          onClick={handleSubmit}
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an new account?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
