import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadBytes, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { imageDb } from "./firebase";

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
    <div className="   min-h-screen flex  flex-col  items-center justify-center text-white bg-gradient-to-r from-slate-900 to-slate-700">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div className="">
        {images.length > 0 && (
          <div className="mt-5 flex-col items-center justify-center">
            <h2 className="text-xl font-bold">Selected Images:</h2>
            <ul className="mt-2 space-y-2">
              {images.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="mt-2 w-32 h-32 object-cover"
                  />
                </li>
              ))}
            </ul>
            <button
              onClick={handleClick}
              className="mt-5 px-4 py-2 bg-blue-500 rounded-lg"
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
