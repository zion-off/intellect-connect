import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../styles/read.css";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  customDatePicker: {
    backgroundColor: "white",
    borderRadius: "10px", // Adjust the border radius as needed
    fontFamily: "ClashDisplay-Variable",
  },
});

const Read = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [startDate, setStartDate] = useState(undefined);
  const [finishDate, setFinishDate] = useState(undefined);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [memberInputs, setMemberInputs] = useState({});
  const classes = useStyles();
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();
  const { members } = location.state || {};

  const [updatedMembers, setMembers] = useState([]);

  useEffect(() => {
    if (members) {
      const initialInputs = {};
      setMembers(members.map((member) => {
        const emailPrefix = member.substring(0, member.indexOf("@"));
        initialInputs[emailPrefix] = ""; // Initialize input values for each member
        return emailPrefix; // Return the email prefix to update the members array
      }));
      setMemberInputs(initialInputs);
    }
  }, [members]);

  const handleInputChange = (member, value) => {
    setMemberInputs((prevInputs) => ({
      ...prevInputs,
      [member]: value,
    }));
  };

  const { id } = useParams();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
              startDate: startDate.toISOString(),
              finishDate: finishDate.toISOString(),
              fileUrl: downloadURL,
              communityId: id,
              memberInputs,
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

  const handleButtonClick = () => {
    fileInputRef.current.click();
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
        {updatedMembers &&
          updatedMembers.map((member, index) => (
            <input
              key={index}
              type="text"
              placeholder={`${member} reads...`}
              value={memberInputs[member]}
              onChange={(e) => handleInputChange(member, e.target.value)}
              id="create-member-input"
            />
          ))}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Start date"
              id="create-startDate"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              className={classes.customDatePicker}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "none",
                      },
                      "&:hover fieldset": {
                        borderColor: "none",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "none",
                      },
                    },
                  }}
                />
              )}
            />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Finish date"
              id="create-finishDate"
              value={finishDate}
              onChange={(date) => setFinishDate(date)}
              className={classes.customDatePicker}
            />
          </DemoContainer>
        </LocalizationProvider>
        <input
          type="file"
          id="file"
          accept=".pdf,.epub"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <button onClick={handleButtonClick} id="read-upload-button">
          {uploadProgress > 0
            ? `(Upload progress: ${uploadProgress}%)`
            : "Upload file"}
        </button>

        <button id="read-button" type="submit">
          Create Read
        </button>
      </form>
    </div>
  );
};

export default Read;
