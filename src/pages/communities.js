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
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontWeight: "bold",
              }}
              to={`/community/${community.id}`}>
              <li
                key={community.id}
                className={
                  index === 0
                    ? "first-list-item"
                    : index === communityData.length - 1
                    ? "last-list-item"
                    : ""
                }
                style={{ zIndex: communityData.length - index, border: "1px solid black" }}>
                {community.name}
              </li>
            </Link>
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
