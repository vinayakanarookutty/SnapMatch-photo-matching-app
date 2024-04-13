import React, { useState, useRef } from "react";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { imageDb } from "./firebase";
import ImageDisplay from "./ImageDisplay"
import logoUrl from "../src/assets/images/logo.png"
import CircularProgress from '@mui/material/CircularProgress';
const Photo = () => {
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [ImageArray,setImageArray] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  const startCamera = async () => {
    setImageSrc(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const capturePhoto = async () => {
    setIsLoading(true)
    if(imageSrc){
      startCamera()
    }
    else{
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
        console.error("Error uploading image to Firebase Storage:", error);
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
          if (response.ok) {
            // Parse JSON response
            const jsonResponse = await response.json();
          setImageArray(jsonResponse.results)
          setIsLoading(false)
          } else {
            console.error("Error fetching JSON response:", response.statusText);
          }
          
        });
        // Get the download URL of the uploaded image
      } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
      }
    });

    }
  
  };
  const divStyle = {
    backgroundImage: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D',
    backgroundSize: 'cover', // Adjust as needed
    backgroundRepeat: 'no-repeat', // Adjust as needed
    width: '100%', // Adjust as needed
    height: '500px', // Adjust as needed
  };

  return (
   <>
    <a  href="/fileupload">FileUpload</a>
    <div className="bg-gradient-to-r from-slate-900 to-slate-700 min-h-screen flex flex-col items-center justify-center text-white p-4">
   
      <div className="flex flex-col items-center mb-10">
        <img src={logoUrl} className="h-32 rounded-lg" alt="logo" />
        <h1 className="text-4xl font-semibold">Welcome to SnapMatch</h1>
       
        
      </div>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Captured"
          className="rounded-lg shadow-lg mb-2"
        />
      ):( <video ref={videoRef} autoPlay className="rounded-lg shadow-lg" />)}

      <div className="flex gap-2 mt-2">
        <button
          onClick={startCamera}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
          Start Camera
        </button>
        <button
          onClick={capturePhoto}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
          Capture Photo
        </button>
        {
          isLoading &&(<CircularProgress />)
        }
      </div>{" "}
      {
        ImageArray &&(
          <ImageDisplay imageUrls={ImageArray} />
        )
      }
    </div>
    </>
  );
};

export default Photo;
