import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut, updateEmail, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import Navbar from "./navbar";
import "../styles/profile.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // New state for password
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = auth.currentUser;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const fetchUserData = async () => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData) {
          // Add this check
          setName(userData.name);
          setEmail(userData.email);
        } else {
          // Handle the case where userData is undefined or doesn't have the expected properties
          console.error("Unexpected user data structure");
        }
      } else {
        // Handle the case where the user document doesn't exist in Firestore
        console.error("User document not found in Firestore");
      }
    } else {
      // Handle the case where currentUser is null or undefined
      console.error("No authenticated user");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Fetch user data on component mount

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPassword(""); // Reset the password state
  };

  const handleSave = async () => {
    const userDocRef = doc(db, "users", currentUser.uid);

    try {
      await updateDoc(userDocRef, {
        name,
        email, // Firestore only, does not update auth profile
      });

      if (email !== currentUser.email) {
        await updateEmail(currentUser, email); // Update email in auth profile
      }
      if (password.trim()) {
        // Only update the password if it has been changed
        await updatePassword(currentUser, password);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  return (
    <div id="profile-main-container">
      <h2 id="profile-header">Profile</h2>
      {isEditing ? (
        <form id="profile-info" onSubmit={handleSave}>
          <p id="profile-name-tag">Name</p>
          <input
            type="text"
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p id="profile-email-tag">Email</p>
          <input
            type="email"
            id="profile-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p id="profile-password-tag">
            New Password (leave blank to keep current):
          </p>
          <input
            type="password"
            id="profile-password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div id="profile-form-button-container">
            <button id="profile-save-changes-button" type="submit">Save changes</button>
            <button id="profile-cancel-button"  type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div id="profile-info">
          <p id="profile-name-tag">Name</p>
          <p id="profile-name-value"> {name}</p>
          <p id="profile-email-tag">Email</p>
          <p id="profile-name-value"> {email}</p>
          <button id="profile-edit-button" onClick={handleEdit}>
            Edit profile
          </button>
        </div>
      )}
      <div id="profile-logout-container">
        <button id="profile-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Navbar />
    </div>
  );
};

export default Profile;
