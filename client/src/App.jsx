import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import axios from "axios";

import uploadImage from "./assets/upload/image.png"; // Import the image file

import "./UploadImage.css"; // Import CSS file for styling

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-all-images"
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAPI();
  }, []); // 空数组表示只在组件挂载时调用一次

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

  const handleReset = () => {
    setSelectedFile(null);
  };

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

  const handleClickUploadText = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <section className="body">
      <header>
        <div className="title">S3 file upload directive</div>
        <div className="subtitle">
          A simple directive to create a customizable file input control
        </div>
      </header>

      <div className="upload-section">
        {selectedFile && (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected file" />
          </div>
        )}
        <div className="button-container">
          <img className="uploadImage" src={uploadImage} alt="image icon" />
          <div className="dragTextContainer">
            <div className="uploadText" onClick={handleClickUploadText}>
              Click to upload
            </div>
            <div className="dropText">or drag and drop</div>
          </div>
          <div className="maximumFileTtext">Maximum file size 5MB</div>
        </div>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className="submit-container">
        <button className="submit-button" onClick={handleUpload}>
          Submit
        </button>
      </div>
    </section>
  );
}

export default App;
