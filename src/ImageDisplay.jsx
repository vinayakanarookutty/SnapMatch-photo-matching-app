import { Fragment } from "react";

const ImageDisplay = ({ imageUrls }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {imageUrls.map((url, index) => (
        <div
          key={index}
          className="rounded-md overflow-hidden shadow-lg bg-gradient-to-r from-slate-800 to-slate-700"
        >
          <img
            className="w-full object-cover "
            src={url}
            alt={`Image ${index + 1}`}
          />
          <div className="px-6 py-4">
            <div className=" text-xl mb-4 pl-2">Image {index + 1}</div>
            <a
              href={url}
              download
              className="bg-gradient-to-r from-slate-800 to-slate-700 text-white mt-2 p-2 rounded"
            >
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageDisplay;
