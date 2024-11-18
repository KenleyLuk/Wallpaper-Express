import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from "axios";

import uploadImage from './assets/upload/image.png'; // Import the image file

import './UploadImage.css'; // Import CSS file for styling


const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleReset = () => {
    setSelectedFile(null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // 處理文件上傳邏輯
      console.log('文件已上傳:', selectedFile);
    } else {
      alert('請選擇要上傳的文件');
    }
  };

  const handleClickUploadText = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <section className="body">
      <header>
        <div className="title">S3 file upload directive</div>
        <div className="subtitle">A simple directive to create a customizable file input control</div>
        
      </header>
      
      <div className="upload-section">
        <div className="button-container">
          <img className="uploadImage" src={uploadImage} alt="image icon" />
          <div className='dragTextContainer'>
            <div class="uploadText" onClick={handleClickUploadText}>Click to upload</div>
            <div class="dropText">or drag and drop</div>
          </div>
          <div className='maximumFileTtext'>Maximum file size 5MB</div>
        </div>
        <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
      <div className="submit-container">
        <button className="submit-button" onClick={handleUpload}>Submit</button>
      </div>
    </section>
  );
};

export default App
