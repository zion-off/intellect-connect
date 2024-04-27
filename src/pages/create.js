import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
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
        <button id="create-button" type="submit">Save</button>
      </form>
    </div>
  );
};

export default Create;
