import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadBytes, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { imageDb } from "./firebase";
import SuperButton from "./components/SuperButton";
import { Upload, Image, X, Check } from "lucide-react";

const FileUpload = () => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setImages(acceptedFiles);
    setUploadSuccess(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleClick = async () => {
    if (images.length === 0) return;
    
    setIsUploading(true);
    try {
      await Promise.all(
        images.map(async (image) => {
          const imgRef = ref(imageDb, `files/${uuidv4()}`);
          await uploadBytes(imgRef, image);
        })
      );
      setImages([]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            Upload Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your images into memories. Drag, drop, and watch the magic happen.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="w-full max-w-4xl">
          <div
            {...getRootProps()}
            className={`
              relative group cursor-pointer transition-all duration-500 ease-out
              ${isDragActive 
                ? 'scale-105 shadow-2xl shadow-purple-500/50' 
                : 'hover:scale-102 hover:shadow-xl hover:shadow-purple-500/30'
              }
            `}
          >
            <div className={`
              border-2 border-dashed rounded-3xl p-16 text-center backdrop-blur-sm
              transition-all duration-300 ease-out
              ${isDragActive 
                ? 'border-purple-400 bg-purple-500/20 shadow-inner' 
                : 'border-gray-500 bg-white/5 hover:border-purple-400 hover:bg-purple-500/10'
              }
            `}>
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center space-y-6">
                <div className={`
                  p-6 rounded-full transition-all duration-300
                  ${isDragActive 
                    ? 'bg-purple-500 scale-110' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 group-hover:scale-110'
                  }
                `}>
                  <Upload className="w-12 h-12 text-white" />
                </div>
                
                {isDragActive ? (
                  <div className="space-y-2 animate-bounce">
                    <p className="text-2xl font-semibold text-purple-300">
                      Drop your images here!
                    </p>
                    <p className="text-gray-400">Release to upload</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xl font-semibold text-white">
                      Drag & drop your images
                    </p>
                    <p className="text-gray-400">
                      or <span className="text-purple-400 font-medium">click to browse</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports JPG, PNG, GIF up to 10MB each
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-2xl backdrop-blur-sm animate-fade-in">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">Images uploaded successfully!</span>
              </div>
            </div>
          )}

          {/* Selected Images */}
          {images.length > 0 && (
            <div className="mt-12 space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Selected Images
                </h2>
                <p className="text-gray-400">
                  {images.length} image{images.length !== 1 ? 's' : ''} ready to upload
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((file, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    
                    <div className="aspect-square mb-3 overflow-hidden rounded-xl bg-gray-800">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-white font-medium truncate text-sm">
                        {file.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <button
                  onClick={handleClick}
                  disabled={isUploading}
                  className={`
                    group relative px-12 py-4 font-bold text-lg rounded-2xl transition-all duration-300 transform
                    ${isUploading 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 active:scale-95'
                    }
                    text-white shadow-lg
                  `}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload {images.length} Image{images.length !== 1 ? 's' : ''}</span>
                      </>
                    )}
                  </span>
                  
                  {!isUploading && (
                    <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default FileUpload;