import React, { useState, useRef } from "react";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { imageDb } from "./firebase";
import ImageDisplay from "./ImageDisplay"
import logoUrl from "../src/assets/images/logo.png"
import CircularProgress from '@mui/material/CircularProgress';

const Photo = () => {
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [ImageArray, setImageArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setImageSrc(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const capturePhoto = async () => {
    setIsLoading(true)
    if (imageSrc) {
      startCamera()
    }
    else {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob = new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg");
      });

      blob.then(async (imageBlob) => {
        // Use a fixed path for the image
        const imgRef = ref(imageDb, `match/fixedPath.jpg`);
        try {
          await uploadBytes(imgRef, imageBlob);

          // Get the download URL of the uploaded image
          const downloadURL = await getDownloadURL(imgRef);

          // Set the imageSrc state to display the captured image
          setImageSrc(downloadURL);
        } catch (error) {
          console.error("Error uploading image to Firebase Storage:", error);
        }
        // Upload the imageBlob to Firebase Storage
        try {
          await uploadBytes(imgRef, imageBlob).then(async () => {
            const response = await fetch("http://localhost:3001/upload", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              // Parse JSON response
              const jsonResponse = await response.json();
              setImageArray(jsonResponse.results)
              setIsLoading(false)
            } else {
              console.error("Error fetching JSON response:", response.statusText);
            }

          });
          // Get the download URL of the uploaded image
        } catch (error) {
          console.error("Error uploading image to Firebase Storage:", error);
        }
      });
    }
  };

  // Enhanced styling objects
  const containerStyle = {
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 25%, #000000 50%, #1a1a1a 75%, #0c0c0c 100%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    padding: '20px',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 200, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
    animation: 'pulse 4s ease-in-out infinite alternate'
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '60px',
    zIndex: 10,
    position: 'relative'
  };

  const logoStyle = {
    height: '120px',
    borderRadius: '20px',
    marginBottom: '30px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    marginBottom: '10px',
    letterSpacing: '-0.02em',
    textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#b0b0b0',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: '0.5px'
  };

  const mediaContainerStyle = {
    position: 'relative',
    borderRadius: '25px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    marginBottom: '40px',
    maxWidth: '600px',
    width: '100%'
  };

  const videoStyle = {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: '25px'
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: '25px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '20px',
    marginTop: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '1rem',
    padding: '15px 30px',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    minWidth: '160px',
    textAlign: 'center'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    boxShadow: '0 15px 35px rgba(240, 147, 251, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
  };

  const navLinkStyle = {
    position: 'absolute',
    top: '30px',
    right: '30px',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontSize: '0.95rem'
  };

  const loadingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '50px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const resultsContainerStyle = {
    marginTop: '50px',
    width: '100%',
    maxWidth: '1200px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '25px',
    padding: '40px',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .logo-hover:hover {
            transform: scale(1.05) rotate(2deg);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 255, 255, 0.2);
          }
          
          .btn-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          
          .nav-hover:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
          
          .media-container:hover {
            transform: scale(1.02);
            transition: transform 0.3s ease;
          }
        `}
      </style>
      
      <a 
        href="/fileupload" 
        style={navLinkStyle}
        className="nav-hover"
      >
        📁 File Upload
      </a>
      
      <div style={containerStyle}>
        <div style={backgroundOverlayStyle}></div>
        
        <div style={headerStyle}>
          {/* <img 
            src={logoUrl} 
            style={logoStyle}
            className="logo-hover"
            alt="SnapMatch Logo" 
          /> */}
          <h1 style={titleStyle}>SnapMatch</h1>
          <p style={subtitleStyle}>Capture moments, discover matches</p>
        </div>

        <div style={mediaContainerStyle} className="media-container">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Captured moment"
              style={imageStyle}
            />
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              style={videoStyle}
              playsInline
              muted
            />
          )}
        </div>

        <div style={buttonContainerStyle}>
          <button
            onClick={startCamera}
            style={primaryButtonStyle}
            className="btn-hover"
          >
            📸 Start Camera
          </button>
          
          <button
            onClick={capturePhoto}
            style={secondaryButtonStyle}
            className="btn-hover"
          >
            ✨ Capture Photo
          </button>

          {isLoading && (
            <div style={loadingContainerStyle}>
              <CircularProgress 
                size={24} 
                style={{ color: '#667eea', marginRight: '10px' }} 
              />
              <span style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
                Processing...
              </span>
            </div>
          )}
        </div>

        {ImageArray && ImageArray.length > 0 && (
          <div style={resultsContainerStyle}>
            <ImageDisplay imageUrls={ImageArray} />
          </div>
        )}
      </div>
    </>
  );
};

export default Photo;