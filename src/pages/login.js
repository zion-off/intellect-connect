import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Assuming you have a firebase.js file for authentication

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Enable scrolling again when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // If login is successful, redirect to a dashboard page
      console.log("User logged in:", userCredential.user);
      navigate("/communities");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-main-container">
      <div id="login-blue-circle"></div>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin} id="login-form">
        <input
          id="login-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button id="login-login-button" type="submit">
          Login
        </button>
      </form>
      <p style={{ color: "black", zIndex: "100", fontSize: "small" }}>
        Back to{" "}
        <Link style={{ color: "black" }} to={`/`}>
          home
        </Link>
      </p>
    </div>
  );
};

export default Login;
