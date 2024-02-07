import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadBytes, ref, listAll, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { imageDb } from './firebase';

const FileUpload = () => {
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    // Set the selected images
    setImages(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });
  
  console.log("image"+imageUrl)
  const handleClick = async () => {
    try {
      // Iterate through each selected image and upload to Firebase Storage
      await Promise.all(
        images.map(async image => {
          const imgRef = ref(imageDb, `files/${uuidv4()}`);
          await uploadBytes(imgRef, image);
        })
      );
      
      // Reset the state after successful upload
      setImages([]);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {images.length > 0 && (
        <div>
          <h2>Selected Images:</h2>
          <ul>
            {images.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
          <button onClick={handleClick}>Upload</button>
        </div>
      )}
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default FileUpload;
