import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/communities.css";
import add from "../assets/add.png";
import refresh from "../assets/refresh.png";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/communitydetails.css";
import Skeleton from "@mui/material/Skeleton";

import Navbar from "./navbar";

import { motion } from "framer-motion";

function Communities() {
  const [communityData, setCommunityData] = useState([]);
  const colors = [
    "#f0dab1",
    "#b6c6d3",
    "#f4b335",
    "#ef8903",
    "#047835",
    "#bc2f2d",
    "#94252c",
  ];

  const fetchCommunities = async () => {
    try {
      const communitiesRef = collection(db, "communities");
      const querySnapshot = await getDocs(communitiesRef);

      const currentUserEmail = auth.currentUser?.email;
      const data = [];
      querySnapshot.forEach((doc) => {
        const community = { id: doc.id, ...doc.data() };
        if (community.members.includes(currentUserEmail)) {
          data.push(community);
        }
      });

      setCommunityData(data);
    } catch (error) {
      console.error("Error fetching communities: ", error);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleRefresh = () => {
    setCommunityData([]);
    fetchCommunities();
  };

  return (
    <div id="communities-main-container">
      <div id="communities-icons">
        <Link to="/create">
          <img id="communities-add-image" src={add} alt="add" />
        </Link>
        <img
          id="communities-refresh-image"
          src={refresh}
          alt="refresh"
          onClick={handleRefresh}
        />
      </div>
      <h1 id="communities-header">Communities</h1>

      {communityData ? (
        communityData.length > 0 ? (
          <ul className="list-no-bullets list-no-indentation">
            {communityData.map((community, index) => (
              <Link
                key={community.id}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
                to={{
                  pathname: `/community/${community.id}`,
                  state: {
                    communityName: community.name,
                    communityDescription: community.description,
                  },
                }}
              >
                <motion.li
                  initial={index !== 0 ? { y: -50 } : {}}
                  animate={index !== 0 ? { y: 0 } : {}}
                  transition={index !== 0 ? { duration: 0.5, delay: 0 } : {}}
                  className={
                    index === 0
                      ? "first-list-item"
                      : index === communityData.length - 1
                      ? "last-list-item"
                      : ""
                  }
                  style={{
                    zIndex: communityData.length - index,
                    border: "2px solid black",
                    paddingTop: index === 0 ? "60px" : "80px",
                    backgroundColor: colors[index % colors.length],
                    color: "white"
                  }}
                >
                  {community.name}
                </motion.li>
              </Link>
            ))}
          </ul>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Skeleton
              variant="rectangular"
              height={120}
              sx={{
                borderRadius: 2,
              }}
            />
            <Skeleton
              variant="rectangular"
              height={120}
              sx={{
                borderRadius: 2,
              }}
            />
            <Skeleton
              variant="rectangular"
              height={120}
              sx={{
                borderRadius: 2,
              }}
            />
          </div>
        )
      ) : (
        <p>You're not in a community yet. Maybe start by creating one!</p>
      )}

      <Navbar />
    </div>
  );
}

export default Communities;
