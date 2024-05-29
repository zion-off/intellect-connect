import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
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
import loading from "../assets/loading.gif";
import Navbar from "./navbar";
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";

function CommunityDetails() {
  const { id } = useParams();
  const [communityData, setCommunityData] = useState(null);
  const [reads, setReads] = useState([]);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const location = useLocation();
  const { communityName, communityDescription } = location.state || {};
  console.log("Community Name: ", communityName);
  console.log("Community Description: ", communityDescription);

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
  }, [id]);

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
    setCommunityData(null);
    setReads([]);
    fetchCommunityData();
    fetchReadsData();
  };

  return (
    <div id="community-details-main-container">
      <div id="community-details-icons">
        <Link to={`/read/${id}`} state={{ members: communityData?.members }}>
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

      {/* <div>
        <h2 id="communitydetails-communityname">{communityName}</h2>
        <p id="communitydetails-communitydescription">{communityDescription}</p>
      </div> */}

      {communityData ? (
        <div>
          <h2 id="communitydetails-communityname">{communityData.name}</h2>
          <p id="communitydetails-communitydescription">
            {communityData.description}
          </p>
        </div>
      ) : (
        <Skeleton variant="rounded" height={50} style={{marginTop: '20px'}} />
      )}
      <h3 style={{ fontFamily: "ClashDisplay-Variable", fontWeight: "500" }}>
        Readings
      </h3>

      {reads ? (
        reads.length > 0 ? (
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Skeleton
              variant="rectangular"
              height={60}
              sx={{
                borderRadius: 2,
              }}
            />
            <Skeleton
              variant="rectangular"
              height={60}
              sx={{
                borderRadius: 2,
              }}
            />
            <Skeleton
              variant="rectangular"
              height={60}
              sx={{
                borderRadius: 2,
              }}
            />
          </div>
        )
      ) : (
        <p>No reads found.</p>
      )}

      <h3 style={{ fontFamily: "ClashDisplay-Variable", fontWeight: "500" }}>
        Members
      </h3>

      {communityData ? (
        communityData.members.length > 0 ? (
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
        )
      ) : (
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <Skeleton variant="circular" height={40} width={40} />
          <Skeleton variant="circular" height={40} width={40} />
          <Skeleton variant="circular" height={40} width={40} />
        </div>
      )}

      {showAddMemberDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
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
              width: "80%",
              backgroundColor: "white",
              padding: "10px 20px 20px 20px",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              borderRadius: "10px",
            }}>
            <p style={{ fontFamily: "ClashDisplay-Variable" }}>
              Add a new member
            </p>
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter member's email"
              style={{
                margin: "0 0 15px 0",
                border: "solid",
                borderColor: "grey",
                borderRadius: "10px",
                padding: "15px",
                fontFamily: "ClashDisplay-Variable",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                gap: "5px",
              }}>
              <button
                style={{
                  background: "black",
                  border: "none",
                  borderRadius: "10px",
                  padding: "5px 10px",
                  color: "white",
                  fontFamily: "ClashDisplay-Variable",
                }}
                onClick={() => setShowAddMemberDialog(false)}>
                Cancel
              </button>
              <button
                style={{
                  background: "#38a856",
                  border: "none",
                  borderRadius: "10px",
                  padding: "5px 10px",
                  color: "white",
                  fontFamily: "ClashDisplay-Variable",
                }}
                onClick={handleAddMember}>
                Add Member
              </button>
            </div>
          </div>
        </motion.div>
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
          margin: "5px 5px 15vh 5px",
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
