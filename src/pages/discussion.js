import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import "../styles/discussion.css";
import Navbar from "./navbar";
import post from "../assets/post.png";
import { ReactComponent as InfoIcon } from "../assets/info.svg";
import { ReactComponent as CloseIcon } from "../assets/close.svg";
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";

function Discussion() {
  const { id } = useParams();
  const [posts, setPosts] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [read, setRead] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchRead = async () => {
      try {
        const docRef = doc(db, "reads", id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setRead(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };
    
    fetchRead();
  }, [id]);

  useEffect(() => {
    const postsCollectionRef = collection(db, "posts");
    const postsQuery = query(postsCollectionRef, where("readId", "==", id));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return unsubscribe;
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newPost = {
        title: postTitle,
        content: postContent,
        userEmail: auth.currentUser.email, // Replace with the actual user's email
        readId: id,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "posts"), newPost);

      // Clear the input fields after successful submission
      setPostTitle("");
      setPostContent("");
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div id="discussion-main-container">
      {read && (
        <motion.div
          id="discussion-info"
          animate={{ x: isOpen ? -350 : 0 }}
          transition={{ type: "spring", stiffness: 50 }}>
          <CloseIcon
            style={{
              fill: "white",
              height: "15px",
              width: "15px",
              backgroundColor: "red",
              borderRadius: "50%",
              padding: "5px",
            }}
            onClick={() => setIsOpen(!isOpen)}
          />
          <div>
            <p id="discussion-info-author">{read.author}</p>
          </div>
          <div>
            <p id="discussion-info-title">{read.title}</p>
          </div>
          <div>
            <p id="discussion-info-start-date"> Reading from {" "}
              {read.startDate
                ? new Date(read.startDate).toLocaleDateString()
                : ""} {" to "} {read.finishDate
                  ? new Date(read.finishDate).toLocaleDateString()
                  : ""}
            </p>
          </div>
          <div id="discussion-member-inputs">
            {read.memberInputs &&
              Object.entries(read.memberInputs).map(
                ([member, input], index) => (
                  <div
                    id="discussion-assigned-pages"
                    key={index}
                    style={{ marginBottom: "10px" }}>
                    <strong>{member}</strong> reads {input}
                  </div>
                )
              )}
          </div>
          <div>
            <p id="discussion-info-download-link">
              <a
                href={read.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "navy" }}>
                Download file
              </a>
            </p>
          </div>
        </motion.div>
      )}
      <div>
        <div id="discussion-top-row">
          <h3 id="discussion-header">Discussion</h3>
          <InfoIcon
            id="discussion-info-icon"
            style={{
              fill: "black",
              height: "20px",
              width: "20px",
              marginRight: "10px",
            }}
            onClick={handleIconClick}
          />
        </div>

        {read ? (
          <div>
            <h2 id="discussion-book-title">
              <a
                href={read.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#38a856" }}>
                {read.title}
              </a>
            </h2>
          </div>
        ) : (
          <Skeleton variant="rounded" height={20} />
        )}
      </div>

      {posts ? (
        posts.length > 0 ? (
          <div id="discussion-post">
            {posts.map((post) => (
              <div id="discussion-old-posts" key={post.id} className="post">
                <p id="discussion-title">{post.title}</p>
                <p id="discussion-content">{post.content}</p>
                <p id="discussion-username">{post.userEmail}</p>
                <p id="discussion-timestamp">
                  {new Date(post.createdAt.seconds * 1000).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontFamily: "Satoshi-Variable" }}>No posts found.</p>
        )
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Skeleton variant="rounded" height={150} />
          <Skeleton variant="rounded" height={150} />
          <Skeleton variant="rounded" height={150} />
        </div>
      )}

      <div id="discussion-container">
        <form onSubmit={handleSubmit}>
          <div id="discussion-input">
            <input
              type="text"
              id="discussion-post-title"
              placeholder="Post title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
            <input
              id="discussion-post-content"
              placeholder="Content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
            />
          </div>

          <button id="discussion-post-button" type="submit">
            <img id="discussion-post-icon" src={post} alt="post" />
          </button>
        </form>
      </div>
      <Navbar />
    </div>
  );
}

export default Discussion;
