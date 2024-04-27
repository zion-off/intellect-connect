import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/communities.css";
import add from "../assets/add.png";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/communitydetails.css";

import Navbar from "./navbar";

function Communities() {
  const [communityData, setCommunityData] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const communitiesRef = collection(db, "communities");
        const querySnapshot = await getDocs(communitiesRef);

        const currentUserEmail = auth.currentUser?.email; // Get the current user's email
        const data = [];
        querySnapshot.forEach((doc) => {
          const community = { id: doc.id, ...doc.data() };
          // Filter to include only communities containing the current user's email in the members list
          if (community.members.includes(currentUserEmail)) {
            data.push(community);
          }
        });

        setCommunityData(data); // Update state with the filtered data
      } catch (error) {
        console.error("Error fetching communities: ", error);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div id="communities-main-container">
      <Link to="/create">
        <img id="communities-add-image" src={add} alt="add" />
      </Link>
      <h1 id="communities-header">Communities</h1>
      {communityData.length > 0 ? (
        <ul className="list-no-bullets list-no-indentation">
          {communityData.map((community, index) => (
            <li
              key={community.id}
              className={
                index === 0
                  ? "first-list-item"
                  : index === communityData.length - 1
                  ? "last-list-item"
                  : ""
              }>
              <Link to={`/community/${community.id}`}>{community.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You're not in a community yet. Maybe start by creating one!</p>
      )}

      <Navbar />
    </div>
  );
}

export default Communities;
