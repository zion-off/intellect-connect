import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import add from "../assets/add.png";
import Navbar from "./navbar";

function CommunityDetails() {
  const { id } = useParams();
  const [communityData, setCommunityData] = useState(null);

  const [reads, setReads] = useState([]);

  useEffect(() => {
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

    fetchReadsData();
    fetchCommunityData();
  }, [id]); // Re-run effect when ID changes

  return (
    <div id="community-details-main-container">
      <Link to={`/read/${id}`}>
        <img id="communities-add-image" src={add} alt="add" />
      </Link>
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
        <ul>
          {reads.map((read) => (
            <li key={read.id}>
              <Link to={`/discussion/${read.id}`}>
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
        <ul>
          {communityData.members.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      ) : (
        <p>No members found.</p>
      )}
      <Navbar />
    </div>
  );
}

export default CommunityDetails;
