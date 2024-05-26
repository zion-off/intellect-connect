import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/communities.css";
import add from "../assets/add.png";
import loading from "../assets/loading.gif";
import refresh from "../assets/refresh.png";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/communitydetails.css";

import Navbar from "./navbar";

import { motion } from "framer-motion";

function Communities() {
  const [communityData, setCommunityData] = useState([]);

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
                key={community.id} // move key here to avoid warning
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
                to={`/community/${community.id}`}>
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
                    border: "1px solid black",
                  }}>
                  {community.name}
                </motion.li>
              </Link>
            ))}
          </ul>
        ) : (
          <div id="primary-loader">
            <img id="loading" src={loading} alt="loading" />
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
