import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "../styles/discussion.css";
import Navbar from "./navbar";

function Discussion() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollectionRef = collection(db, "posts");
        const postsQuery = query(postsCollectionRef, where("readId", "==", id));
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
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

      const docRef = await addDoc(collection(db, "posts"), newPost);
      console.log("Post added with ID: ", docRef.id);

      // Clear the input fields after successful submission
      setPostTitle("");
      setPostContent("");
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div id="discussion-main-container">
      <h2 id="discussion-header">Discussion</h2>

      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <div id="discussion-old-posts" key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Posted by: {post.userEmail}</p>
              <p>
                Posted on:{" "}
                {new Date(post.createdAt.seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}

      <div id="discussion-container">
        <form id="discussion-input" onSubmit={handleSubmit}>
          <input
            type="text"
            id="discussion-post-title"
            placeholder="Post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />
          <textarea
            id="discussion-post-content"
            placeholder="Content"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            required
          />
          <button type="submit">Post</button>
        </form>
      </div>
      <Navbar />
    </div>
  );
}

export default Discussion;
