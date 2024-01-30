import { useRef, useEffect } from "react";
import * as faceapi from 'face-api.js';
import "./App.css";

function App() {
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    console.log(detections);
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
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D"
        width="940"
        height="650"
        alt="myImage"
        ref={imgRef}
      />
      <canvas ref={canvasRef} width="940" height="650" />
    </div>
  );
}

export default App;
