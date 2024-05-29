import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "./navbar";
import { ReactComponent as BackIcon } from "../assets/back.svg";
import "../styles/create.css";

const Create = () => {
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmails, setMemberEmails] = useState("");
  const currentUserEmail = auth.currentUser.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add the community to Firestore
      const docRef = await addDoc(collection(db, "communities"), {
        name: communityName,
        description: description,
        members: [
          currentUserEmail,
          ...memberEmails.split(",").map((email) => email.trim()),
        ],
      });
      console.log("Community added with ID: ", docRef.id);
      navigate("/communities");
    } catch (error) {
      console.error("Error adding community: ", error);
    }
  };

  return (
    <div id="create-main-container">
      <Link to="/communities">
        <BackIcon
          style={{
            fill: "#f8f5f2",
            height: "40px",
            width: "40px",
            borderRadius: "50%",
            backgroundColor: "black",
            marginTop: "5vh",
          }}
        />
      </Link>

      <h2 id="create-header">Create a Community</h2>
      <form id="create-form" onSubmit={handleSubmit}>
        <input
          type="text"
          id="create-communityName"
          placeholder="Enter community name"
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
          required
        />
        <input
          type="text"
          id="create-description"
          value={description}
          placeholder="Enter description"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          id="create-memberEmails"
          value={memberEmails}
          placeholder="Enter member emails (comma separated)"
          onChange={(e) => setMemberEmails(e.target.value)}
          required
        />
        <button id="create-button" type="submit">
          Save
        </button>
      </form>
      <Navbar />
    </div>
  );
};

export default Create;
