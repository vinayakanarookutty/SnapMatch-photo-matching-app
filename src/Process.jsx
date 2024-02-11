import { useRef, useEffect,useState } from "react";
import * as faceapi from 'face-api.js';
import { listAll, getDownloadURL, ref } from 'firebase/storage';
import { imageDb } from './firebase';
import img from "./vinu.jpg"

function Process() {
  const imgRef = useRef();
  const canvasRef = useRef();
  const downloadUrls = [];
  const handleImage = async () => {
    // Detect faces and landmarks in the image
    
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

      

    if (detections && detections.length > 0) {
      console.log("Faces detected:", detections);

      // Iterate over the detected faces
      detections.forEach(async (face) => {
        // Check for matching faces in the downloadUrls array
        const matchingFace = await findMatchingFace(face.descriptor);
        if (matchingFace) {
          console.log("Matching face found:", matchingFace);
        } else {
          console.log("No matching face found.");
        }
      });
    } else {
      console.log("No faces detected.");
    }
  };

  const findMatchingFace = async (targetDescriptor) => {
    // Iterate over downloadUrls and find the matching face
    for (const url of downloadUrls) {
      const img = await faceapi.fetchImage(url);
      const descriptor = await getFaceDescriptor(img);

      const distance = faceapi.euclideanDistance(targetDescriptor, descriptor);

      // Set a threshold for similarity (you may need to adjust this)
      if (distance < 0.6) {
        return url; // Matching face found
      }
    }

    return null; // No matching face found
  };

  const getFaceDescriptor = async (img) => {
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (detection) {
      return detection.descriptor;
    }
    return null;
  };
  

  useEffect(() => {
    
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);

      handleImage();
    };

    const loadImage = () => {
      if (imgRef.current.complete) {
        loadModels();
      } else {
        imgRef.current.onload = loadModels;
      }
    };

    loadImage();
  }, []);

  return (
    <div className="App">
      <img
      crossOrigin="anonymous"
        src={img}
        width="940"
        height="650"
        alt="myImage"
        ref={imgRef}
      />
      <canvas ref={canvasRef} width="940" height="650" />
    </div>
  );
}

export default Process;