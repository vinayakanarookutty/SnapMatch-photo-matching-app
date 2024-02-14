import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadBytes, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { imageDb } from "./firebase";
import SuperButton from "./components/SuperButton";

const FileUpload = () => {
  const [images, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setImages(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleClick = async () => {
    console.log("first");
    try {
      await Promise.all(
        images.map(async (image) => {
          const imgRef = ref(imageDb, `files/${uuidv4()}`);
          await uploadBytes(imgRef, image);
        })
      );
      setImages([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white  px-4 sm:px-6 lg:px-8">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer w-full sm:w-3/4 lg:w-1/2"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p className="text-4xl">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>
      <div className="w-full sm:w-3/4 lg:w-1/2">
        {images.length > 0 && (
          <div className="mt-5 flex flex-col items-center justify-center">
            <h2 className="text-xl ">Selected Images:</h2>
            <div className="mt-2 flex flex-wrap justify-center">
              {images.map((file, index) => (
                <div key={index} className="m-2  p-2 rounded-lg shadow-md">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-48 rounded-md object-cover mx-auto"
                  />
                  <p className="mt-2 text-center">{file.name}</p>
                </div>
              ))}
            </div>
            <div onClick={handleClick}>
              <SuperButton buttonText="Upload" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
