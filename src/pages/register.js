import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase"; // Assuming you have a firebase.js file for authentication
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // State to hold the name
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's profile with their name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      console.log("User registered:", userCredential.user);

      // Create the user document in Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        name: name,
        email: email,
      });

      navigate("/communities"); // Redirect to a specific route after registration
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div id="register-main-container">
      <div id="register-yellow-circle"></div>
      <h2 id="register-header">Create new account</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleRegister} id="register-form">
        <input
          id="register-name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          id="register-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id="register-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button id="register-register-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
