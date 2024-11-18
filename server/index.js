const crypto = require("crypto");
  S3,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const express = require("express");
const fs = require("fs"); // Import the fs module for file system operations
const multer = require("multer"); // For handling file uploads
const app = express();
require("dotenv").config();

const s3 = new S3({ region: "us-east-2" }); // Replace "YOUR_REGION" with your AWS region

const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

// Configure multer for handling file uploads
const upload = multer({ dest: "uploads/" });

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

app.get("/api", (req, res) => {
  res.json({ fruit: ["apple2", "orange", "banana"] });
});

// Route to get all images from S3
app.get(process.env.REACT_APP_GET_ALL_IMAGES, async (req, res) => {
  const bucket = process.env.REACT_APP_AWS_S3_BUCKET_NAME;
  console.log("API KEY " + bucket);

  try {
    const listObjectsParams = {
      Bucket: bucket,
    };

    const listObjectsCommand = new ListObjectsV2Command(listObjectsParams);
    const data = await s3.send(listObjectsCommand);

    const images = data.Contents.map((obj) => obj.Key);
    const signedUrls = [];

    for (const imageKey of images) {
      const getObjectParams = {
        Bucket: bucket,
        Key: imageKey,
      };

      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const signedUrl = await getSignedUrl(s3, getObjectCommand, {
        expiresIn: 3600,
      });
      signedUrls.push({ key: imageKey, url: signedUrl });
    }

    res.json({ images: signedUrls });
  } catch (error) {
    console.error("Error getting images from S3:", error);
    res
      .status(500)
      .json({ error: "Error getting images from S3", message: error.message });
  }
});

// Route to add a file from S3
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//     const bucket = "kenley-testing-upload";
//     // const key = randomImageName();
//     const key = req.file.originalname;
//     const body = req.file.path; // Path to the uploaded file
//     const contentType = req.file.mimetype; // Get the MIME type of the uploaded file

//     reasonml

//     Copy
//     try {
//         const data = await s3.send(new PutObjectCommand({
//             Bucket: bucket,
//             Key: key,
//             Body: body,
//             ContentType: contentType // Set the content type for the uploaded file
//         }));

//         res.json({ message: 'File uploaded to S3 successfully', data });
//     } catch (error) {
//         res.status(500).json({ error: 'Error uploading file to S3', message: error.message });
//     }
//     });

// Route to add a file to S3
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const bucket = "kenley-testing-upload";
  const key = req.file.originalname; // Use the original file name as the key
  const body = fs.createReadStream(req.file.path); // Read the file content
  const contentType = req.file.mimetype; // Get the MIME type of the uploaded file

  try {
    const data = await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType, // Set the content type for the uploaded file
      })
    );

    // Delete the temporary file after uploading
    fs.unlinkSync(req.file.path);

    res.json({ message: "File uploaded to S3 successfully", data });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error uploading file to S3", message: error.message });
  }
});

// Route to delete a file from S3
app.delete("/api/delete", async (req, res) => {
  const bucket = "kenley-testing-upload";
  const key = "ScreenshotUpload.png";

  try {
    const data = await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    res.json({ message: "Object deleted successfully", data });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting object", message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/upload", (req, res) => {
  res.send("Uploaded successfully");
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});

module.exports = app;
