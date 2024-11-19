import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UploadImage.css";
import uploadImage from "./assets/upload/image.png";

function App() {
  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch API data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-all-images"
        );
        console.log("API response:", response.data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Prevent default behavior on drag over
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const fakeEvent = { target: { files: [file] } };
    handleFileChange(fakeEvent);
  };

  // Reset selected file
  const handleReset = () => {
    setSelectedFile(null);
  };

  // Upload selected file
  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:8080/api/upload",
          formData
        );

        if (response.status === 200) {
          console.log("File uploaded successfully:", response.data.message);
        } else {
          console.error("Error uploading file:", response.data.error);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      alert("Please select a file to upload");
    }
  };

  // Trigger file input click
  const handleClickUploadText = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <section className="body">
      <header>
        <div className="title">S3 File Upload Directive</div>
        <div className="subtitle">Create a customizable file input control</div>
      </header>

      <div
        className="upload-section"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="button-container">
          <img className="uploadImage" src={uploadImage} alt="Image Icon" />
          <div className="dragTextContainer">
            <div className="uploadText" onClick={handleClickUploadText}>
              Click to Upload
            </div>
            <div className="dropText">or Drag and Drop</div>
          </div>
          <div className="maximumFileSizeText">Maximum file size 5MB</div>
        </div>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <div>
          <img
            className="uploadedContainer"
            src={imagePreview}
            alt="Selected File Preview"
          />
        </div>
      )}

      <div className="submit-container">
        <button className="submit-button" onClick={handleUpload}>
          Submit
        </button>
      </div>
    </section>
  );
}

export default App;
