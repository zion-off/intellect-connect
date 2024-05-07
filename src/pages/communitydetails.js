import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import add from "../assets/add.png";
import refresh from "../assets/refresh.png";
import Navbar from "./navbar";

function CommunityDetails() {
  const { id } = useParams();
  const [communityData, setCommunityData] = useState(null);
  const [reads, setReads] = useState([]);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const getRandomColor = () => {
    let hue = Math.floor(Math.random() * 360); // Random hue from 0 to 360
    return `hsl(${hue}, 70%, 60%)`; // Fixed saturation and lightness
  };

  const fetchCommunityData = async () => {
    try {
      const communityDocRef = doc(db, "communities", id);
      const communitySnapshot = await getDoc(communityDocRef);
      if (communitySnapshot.exists()) {
        const communityData = communitySnapshot.data();
        setCommunityData({
          ...communityData,
          members: communityData.members || [], // Initialize members as an empty array if it doesn't exist
        });
      } else {
        console.error("Community not found");
      }
    } catch (error) {
      console.error("Error fetching community data: ", error);
    }
  };

  const fetchReadsData = async () => {
    try {
      const readsCollectionRef = collection(db, "reads");
      const readsQuery = query(
        readsCollectionRef,
        where("communityId", "==", id)
      );
      const readsSnapshot = await getDocs(readsQuery);
      const readsData = readsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReads(readsData);
    } catch (error) {
      console.error("Error fetching reads data: ", error);
    }
  };

  useEffect(() => {
    fetchReadsData();
    fetchCommunityData();
  }, [id]); // Re-run effect when ID changes
 // Re-run effect when ID changes

  const handleAddMember = async () => {
    if (!newMemberEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    const updatedMembers = [...communityData.members, newMemberEmail.trim()];
    const communityDocRef = doc(db, "communities", id);

    try {
      await updateDoc(communityDocRef, {
        members: updatedMembers,
      });
      setCommunityData({ ...communityData, members: updatedMembers });
      setNewMemberEmail(""); // Reset the input field
      setShowAddMemberDialog(false); // Close the dialog
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add new member.");
    }
  };

  const handleRefresh = () => {
    fetchCommunityData();
    fetchReadsData();
  };

  return (
    <div id="community-details-main-container">
      <div id="community-details-icons">
      <Link to={`/read/${id}`}>
        <img id="community-details-add-image" src={add} alt="add" />
      </Link>
      <img
        id="community-details-refresh-image"
        src={refresh}
        alt="refresh"
        onClick={handleRefresh}
        style={{ cursor: "pointer" }}
      />
      </div>
      
      {communityData ? (
        <div>
          <h2>{communityData.name}</h2>
          <p>{communityData.description}</p>
          {/* Add more relevant data as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <h3>Readings</h3>
      {reads.length > 0 ? (
        <ul id="communitydetails-reading-list">
          {reads.map((read) => (
            <li id="communitydetails-reading-list-items" key={read.id}>
              <Link
                id="community-details-reading-link"
                to={`/discussion/${read.id}`}>
                <h4>{read.title}</h4>
              </Link>
              <p>{read.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reads found.</p>
      )}
      <h3>Members</h3>
      {communityData && communityData.members.length > 0 ? (
        <ul id="communitydetails-members-list">
          {communityData.members.map((email, index) => {
            const emailPrefix = email.substring(0, email.indexOf("@"));
            return (
              <li
                key={index}
                style={{ display: "inline-block", margin: "5px" }}>
                <div
                  style={{
                    backgroundColor: getRandomColor(),
                    color: "white",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                  {emailPrefix}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No members found.</p>
      )}

      {showAddMemberDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent black background
            zIndex: 50, // Ensure this is below the dialog but above other content
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              padding: "20px",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              borderRadius: "15px",
            }}>
            <p>Add a new member</p>
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter member's email"
              style={{ margin: "0 0 15px 0", border: 'solid', borderColor: 'grey', borderRadius: '15px', padding: '15px'}}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px'}}>
              <button style={{background: 'black', border: 'none', borderRadius: '15px', padding: '5px 10px', color: 'white'}} onClick={handleAddMember}>Add Member</button>
              <button style={{background: 'black', border: 'none', borderRadius: '15px', padding: '5px 10px', color: 'white'}}  onClick={() => setShowAddMemberDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowAddMemberDialog(true)}
        style={{
          color: "white",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "12px", // Adjust font size according to your needs
          cursor: "pointer", // Make the cursor indicate clickable items
          margin: "5px",
          backgroundColor: "#4CAF50",
          border: "none",
        }}>
        +
      </button>
      <Navbar />
    </div>
  );
}

export default CommunityDetails;
