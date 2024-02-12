import React, { useState, useRef } from "react";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { imageDb } from "./firebase";
import ImageDisplay from "./ImageDisplay";
import logoUrl from "./assets/images/1.png";
import SuperButton from "./components/SuperButton";

const Photo = () => {
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [ImageArray, setImageArray] = useState([]);

  const startCamera = async () => {
    setImageSrc(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const capturePhoto = async () => {
    if (imageSrc) {
      startCamera();
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        // Use a fixed path for the image
        const imgRef = ref(imageDb, `match/fixedPath.jpg`);
        try {
          await uploadBytes(imgRef, blob);

          // Get the download URL of the uploaded image
          const downloadURL = await getDownloadURL(imgRef);

          // Set the imageSrc state to display the captured image
          setImageSrc(downloadURL);
          setImageArray((prevArray) => [...prevArray, downloadURL]);
        } catch (error) {
          console.error("Error uploading image to Firebase Storage:", error);
        }
      }, "image/jpeg");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
      <div className="flex flex-col items-center mb-10">
        <img src={logoUrl} className="h-64 rounded-lg" alt="logo" />
        <h1 className="text-6xl text-center font-semibold">
          Welcome to SnapMatch
        </h1>
      </div>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Captured"
          className="rounded-lg shadow-lg mb-2"
        />
      ) : (
        <video ref={videoRef} autoPlay className="rounded-lg shadow-lg" />
      )}
      <div className="flex gap-2 mt-2">
        <div onClick={startCamera}>
          <SuperButton buttonText="Start Camera" />
        </div>
        <div onClick={capturePhoto}>
          <SuperButton buttonText="Capture Photo" />
        </div>
      </div>
      {ImageArray && <ImageDisplay imageUrls={ImageArray} />}
    </div>
  );
};

export default Photo;
