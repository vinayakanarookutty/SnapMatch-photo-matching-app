import React, { useState, useRef } from "react";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { imageDb } from "./firebase";

const Photo = () => {
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const capturePhoto = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const blob = new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg");
    });

    blob.then(async (imageBlob) => {
      // Use a fixed path for the image
      const imgRef = ref(imageDb, `match/fixedPath.jpg`);
      try {
        await uploadBytes(imgRef, imageBlob);
  
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(imgRef);
  
        // Set the imageSrc state to display the captured image
        setImageSrc(downloadURL);
      } catch (error) {
        console.error('Error uploading image to Firebase Storage:', error);
      }
      // Upload the imageBlob to Firebase Storage
      try {
        await uploadBytes(imgRef, imageBlob).then(async () => {
          const response = await fetch("http://localhost:3001/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        });

        // Get the download URL of the uploaded image
      } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
      }
    });
  };

  return (
    <div>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={capturePhoto}>Capture Photo</button>
      {imageSrc && <img src={imageSrc} alt="Captured" />}
      <video
        ref={videoRef}
        autoPlay
        style={{ display: "block", margin: "10px 0" }}
      />
    </div>
  );
};

export default Photo;
