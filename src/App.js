import { useRef, useEffect } from "react";
import * as faceapi from 'face-api.js';
import img from './vinu.jpg'
import "./App.css";

function App() {
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
      canvasRef.current.innerHtml=faceapi.createCanvasFromMedia(imgRef.current);
      faceapi.matchDimensions(canvasRef.current,{
        width:940,
        height:650
      })
      const resised=faceapi.resizeResults(detections,{
        width:940,
        height:650
      })
      console.log(detections)

      faceapi.draw.drawDetections(canvasRef.current,resised)
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      async function getFaceDescriptor(img) {
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        if (detection) {
          return detection.descriptor;
        }
        throw new Error('No face found in the image');
      }
     
      async function findSimilarFace(targetImagePath, groupImagePaths) {
        // Load the face-api.js models
      
        // Load the target facial image
        const targetImg = await faceapi.fetchImage(targetImagePath);
        const targetDescriptor = await getFaceDescriptor(targetImg);
      
        // Find the most similar image in the group
        let bestMatchImage;
        let bestMatchDistance = Number.MAX_VALUE;
      
        for (const imagePath of groupImagePaths) {
          const img = await faceapi.fetchImage(imagePath);
          const descriptor = await getFaceDescriptor(img);
      
          const distance = faceapi.euclideanDistance(targetDescriptor, descriptor);
          console.log(`Distance for ${imagePath}: ${distance}`);
      
          if (distance < bestMatchDistance) {
            bestMatchDistance = distance;
            bestMatchImage = imagePath;
          }
        }
      
        console.log(`Best match image: ${bestMatchImage}`);
      }
      const targetImagePath = 'https://snap-match.s3.amazonaws.com/PPT+Gallery_20221012_222146.jpg';
      const groupImagePaths = [
        'https://snap-match.s3.amazonaws.com/vinu.jpg',
        'https://snap-match.s3.amazonaws.com/WhatsApp+Image+2023-10-15+at+15.01.45_191c6da8.jpg',
      ];
      

      findSimilarFace(targetImagePath, groupImagePaths);


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

export default App;
