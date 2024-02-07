import React,{useEffect,useState} from 'react'
import img from './vinu.jpg'
import FileUpload from './FileUpload';
import axios from 'axios';
import { uploadBytes, ref, listAll, getDownloadURL } from 'firebase/storage';
import { imageDb } from './firebase';
import * as faceapi from 'face-api.js';

function Process() {
    const [imageUrl, setImageUrl] = useState([]);

    useEffect(()=>{
        listAll(ref(imageDb,"files")).then(img=>{
        console.log(img)
        img.items.forEach(val=>{
          getDownloadURL(val).then(url=>{
            setImageUrl(data=>[...data,url])
          })

        })
        })
       
          },[])

          const loadModels = async () => {
            await Promise.all([
              faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
              faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
              faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
              faceapi.nets.faceExpressionNet.loadFromUri("/models"),
              handleChange()
            ]);
     
            
          };
          loadModels()


    async function handleChange(){

        async function getFaceDescriptor(img) {
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (detection) {
              return detection.descriptor;
            }
           
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

    }
  return (
    <button onClick={handleChange}>Process</button>
  )
}

export default Process