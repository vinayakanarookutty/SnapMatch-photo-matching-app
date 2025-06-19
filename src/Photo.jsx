import React, { useState, useRef } from "react";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { imageDb } from "./firebase";
import ImageDisplay from "./ImageDisplay";
import logoUrl from "../src/assets/images/logo.png";
import { Camera, RefreshCw, Upload, Zap, Sparkles, Play, Square } from "lucide-react";

const Photo = () => {
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [ImageArray, setImageArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startCamera = async () => {
    setImageSrc(null);
    setIsProcessing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        } 
      });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    setIsLoading(true);
    if (imageSrc) {
      startCamera();
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob = new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.9);
      });

      blob.then(async (imageBlob) => {
        const imgRef = ref(imageDb, `match/fixedPath.jpg`);
        try {
          await uploadBytes(imgRef, imageBlob);
          const downloadURL = await getDownloadURL(imgRef);
          setImageSrc(downloadURL);
          stopCamera();

          // API call
          const response = await fetch("http://localhost:3001/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          if (response.ok) {
            const jsonResponse = await response.json();
            setImageArray(jsonResponse.results);
          } else {
            console.error("Error fetching JSON response:", response.statusText);
          }
        } catch (error) {
          console.error("Error uploading image to Firebase Storage:", error);
        } finally {
          setIsLoading(false);
        }
      });
    }
  };

  const retakePhoto = () => {
    setImageSrc(null);
    setImageArray([]);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-20 p-6">
        <a 
          href="/fileupload"
          className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
        >
          <Upload className="w-4 h-4 mr-2" />
          File Upload
        </a>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src={logoUrl} 
                className="h-24 w-24 rounded-3xl shadow-2xl shadow-purple-500/50 border-2 border-white/20" 
                alt="logo" 
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-4">
            SnapMatch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Capture moments, find matches. AI-powered photo recognition at your fingertips.
          </p>
        </div>

        {/* Camera/Image Container */}
        <div className="relative mb-8">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-purple-500/30 border-2 border-white/20 bg-black/50 backdrop-blur-sm">
            {imageSrc ? (
              <div className="relative group">
                <img
                  src={imageSrc}
                  alt="Captured"
                  className="max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              </div>
            ) : (
              <div className="relative">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  className="max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl bg-gray-900"
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 rounded-3xl">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">Camera Preview</p>
                    </div>
                  </div>
                )}
                {isCameraActive && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">LIVE</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {!isCameraActive && !imageSrc && (
            <button
              onClick={startCamera}
              disabled={isProcessing}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center space-x-2">
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>{isProcessing ? "Starting..." : "Start Camera"}</span>
              </span>
            </button>
          )}

          {isCameraActive && (
            <button
              onClick={capturePhoto}
              disabled={isLoading}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-50"
            >
              <span className="flex items-center space-x-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                <span>{isLoading ? "Processing..." : "Capture Photo"}</span>
              </span>
            </button>
          )}

          {isCameraActive && (
            <button
              onClick={stopCamera}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/50"
            >
              <span className="flex items-center space-x-2">
                <Square className="w-5 h-5" />
                <span>Stop Camera</span>
              </span>
            </button>
          )}

          {imageSrc && (
            <button
              onClick={retakePhoto}
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/50"
            >
              <span className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Retake Photo</span>
              </span>
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">Processing your image...</p>
              <p className="text-gray-400">AI is finding matches</p>
            </div>
          </div>
        )}

        {/* Results */}
        {ImageArray && ImageArray.length > 0 && (
          <div className="w-full max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Match Results
              </h2>
              <p className="text-gray-400">
                Found {ImageArray.length} similar image{ImageArray.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <ImageDisplay imageUrls={ImageArray} />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Photo;