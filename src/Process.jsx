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
    <div className="bg-gradient-to-r from-slate-900 to-slate-700 min-h-screen flex items-center justify-center text-white">
      <div className="App max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              crossOrigin="anonymous"
              src={img}
              width="448"
              height="299"
              alt="myImage"
              ref={imgRef}
              className="h-48 w-full object-cover md:w-48"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Face detection</div>
            <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Detecting faces in the image</a>
            <p className="mt-2 text-gray-500">Faces detected will be displayed here.</p>
          </div>
        </div>
        <canvas ref={canvasRef} width="940" height="650" className="mt-5 rounded-lg shadow-lg" />
      </div>
    </div>
  );
}

export default Process;