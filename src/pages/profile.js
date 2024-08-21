import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut, updateEmail, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "./navbar";
import "../styles/profile.css";
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // New state for password
  const [profilePic, setProfilePic] = useState(null); // New state for profile picture
  const [profilePicURL, setProfilePicURL] = useState(""); // New state for profile picture URL
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = auth.currentUser;
  const fileInputRef = useRef(null);

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
          setProfilePicURL(userData.profilePicURL || ""); // Load profile picture URL
          console.log(userData.profilePicURL);
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

  const handleSave = async (e) => {
    e.preventDefault();
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

      if (profilePic) {
        const profilePicRef = ref(storage, `profilePics/${currentUser.uid}`);
        console.log("Uploading profile picture...");

        // Upload the profile picture
        await uploadBytes(profilePicRef, profilePic);
        console.log("Profile picture uploaded.");

        // Get the download URL
        const profilePicURL = await getDownloadURL(profilePicRef);
        console.log("Profile Picture URL: ", profilePicURL);

        // Save the profile picture URL in Firestore
        await updateDoc(userDocRef, { profilePicURL });
        setProfilePicURL(profilePicURL);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setProfilePicURL(URL.createObjectURL(file));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div id="profile-main-container">
      {isEditing ? (
        <form id="profile-info" onSubmit={handleSave}>
          {profilePicURL && (
            <div id="profile-pic-container" onClick={handleButtonClick}>
              <img src={profilePicURL} alt="Profile" id="profile-pic-image" />
              <div id="profile-overlay-container">
                <div id="profile-overlay">
                  <span id="profile-overlay-text">Edit profile picture</span>
                </div>
              </div>
            </div>
          )}
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
          <p id="profile-password-tag">New Password:</p>
          <input
            type="password"
            id="profile-password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="file"
            id="profile-pic"
            onChange={handleProfilePicChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div id="profile-form-button-container">
            <button id="profile-save-changes-button" type="submit">
              Save changes
            </button>
            <button
              id="profile-cancel-button"
              type="button"
              onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div id="profile-info">
          <div id="profile-pic-container">
            {profilePicURL ? (
              <img src={profilePicURL} alt="Profile" id="profile-pic-image" />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}>
                <Skeleton
                  variant="circular"
                  height={150}
                  width={150}
                  id="profile-pic-image"
                />
              </div>
            )}
          </div>
          <p id="profile-name-tag">Name</p>
          {name ? (
            <p id="profile-name-value"> {name}</p>
          ) : (
            <Skeleton variant="rectangular" height={20} />
          )}
          <p id="profile-email-tag">Email</p>
          {email ? (
            <p id="profile-name-value"> {email}</p>
          ) : (
            <Skeleton variant="rectangular" height={20} />
          )}
          <button id="profile-edit-button" style={{color: "black"}} onClick={handleEdit}>
            Edit profile
          </button>
          <div id="profile-logout-container">
            <button id="profile-logout-button" style={{color: "black"}} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Profile;
