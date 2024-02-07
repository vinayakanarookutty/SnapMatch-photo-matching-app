import React from 'react'
import { useRef, useEffect,useState } from "react";
import * as faceapi from 'face-api.js';

function Home() {
    const imgRef = useRef();
  const canvasRef = useRef();
  const [objects, setObjects] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);


  


 

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
      const targetImagePath = 'https://avatars.githubusercontent.com/u/103236060?v=4';
      const groupImagePaths =imageUrl
      

      findSimilarFace(targetImagePath, groupImagePaths);


    };
    console.log(objects)

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

    // const loadImage = () => {
    //   if (imgRef.current.complete) {
    //     loadModels();
    //   } else {
    //     imgRef.current.onload = loadModels;
    //   }
    // };

    // loadImage();
  }, []);
  return (
    <h1>fhjfgf</h1>
//     <div className="App">
//     <img
//      crossorigin="anonymous"
//      src={imageUrl[0]}
//       width="940"
//       height="650"
//       alt="myImage"
//       ref={imgRef}
//     />
//     <canvas ref={canvasRef} width="940" height="650" />
//     <div>
   
//     {/* <FileUpload /> */}
//   </div>
//   </div>
   
  )
}

export default Home