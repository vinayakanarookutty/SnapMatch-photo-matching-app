import React, { useEffect, useState } from 'react';
import img from './vinu.jpg';
import { listAll, getDownloadURL, ref } from 'firebase/storage';
import { imageDb } from './firebase';
import * as faceapi from 'face-api.js';

function Process() {
  const [imageUrl, setImageUrl] = useState([]);

  useEffect(() => {
    listAll(ref(imageDb, 'files'))
      .then((img) => {
        console.log(img);
        img.items.forEach((val) => {
          getDownloadURL(val).then((url) => {
            setImageUrl((data) => [...data, url]);
          });
        });
      })
      .catch((error) => {
        console.error('Error listing files:', error);
      });
  }, []);

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]);
      handleChange(); // Call handleChange after models are loaded
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  async function handleChange() {
    const targetImagePath = img;
    const groupImagePaths = imageUrl;

    async function getFaceDescriptor(img) {
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (detection) {
        return detection.descriptor;
      }
    }

    async function findSimilarFace(targetImagePath, groupImagePaths) {
      const targetImg = await faceapi.fetchImage(targetImagePath);
      const targetDescriptor = await getFaceDescriptor(targetImg);

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

    findSimilarFace(targetImagePath, groupImagePaths);
  }

  return <button onClick={handleChange}>Process</button>;
}

export default Process;
