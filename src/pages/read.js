import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import "../styles/read.css";

const Read = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  const { id } = useParams();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log();
 
    try {
      // Create a file reference in Firebase Storage
      const fileRef = ref(storage, file.name);

      // Upload file to Firebase Storage
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // File uploaded successfully, now add read data to Firestore
            const docRef = await addDoc(collection(db, "reads"), {
              title,
              author,
              pages: parseInt(pages),
              startDate,
              finishDate,
              fileUrl: downloadURL,
              communityId: id,
            });
            console.log("Read added with ID: ", docRef.id);
            navigate(`/community/${id}`);
          });
        }
      );
    } catch (error) {
      console.error("Error adding read: ", error);
    }
  };

  return (
    <div id="read-main-container">
      <h2 id="read-header">Create a new read</h2>
      <form id="read-form" onSubmit={handleSubmit}>
        <input
          type="text"
          id="create-title"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          id="create-author"
          value={author}
          placeholder="Author"
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="text"
          id="create-pages"
          value={pages}
          placeholder="Pages"
          onChange={(e) => setPages(e.target.value)}
          required
        />
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="create-startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <label htmlFor="finishDate">Finish Date:</label>
        <input
          type="date"
          id="create-finishDate"
          value={finishDate}
          onChange={(e) => setFinishDate(e.target.value)}
          required
        />
        <label htmlFor="file">Upload File (PDF or EPUB):</label>
        <input
          type="file"
          id="file"
          accept=".pdf,.epub"
          onChange={handleFileChange}
        />
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
        <button id="read-button" type="submit">
          Create Read
        </button>
      </form>
    </div>
  );
};

export default Read;
