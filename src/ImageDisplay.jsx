const ImageDisplay = ({ imageUrls }) => {
    return (
      <div>
        {imageUrls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Image ${index + 1}`} />
          </div>
        ))}
      </div>
    );
  };
  
export default ImageDisplay;