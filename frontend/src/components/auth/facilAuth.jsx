import React, { useState, useRef } from "react";
import { UploadCloud, ImageIcon } from "lucide-react";

export default function FacilAuth() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file?.type?.startsWith("image/")) {
      setImage(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file?.type?.startsWith("image/")) {
      setImage(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      console.log("Imagem submetida:", image);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md w-full mx-auto p-2 text-white rounded-2xl"
    >
      <div
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors duration-300 ${
          dragActive
            ? "border-cyan-400 bg-[#0F3D57]"
            : "border-cyan-700 bg-[#0F3D57]"
        } cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-cyan-400`}
      >
        {image ? (
          <div className="text-center">
            <ImageIcon className="mx-auto mb-2 text-cyan-300" />
            <p className="text-sm">Selected Image:</p>
            <p className="text-cyan-400 font-semibold text-sm truncate max-w-xs">
              {image.name}
            </p>
          </div>
        ) : (
          <>
            <UploadCloud className="w-10 h-10 text-cyan-400 mb-2" />
            <p className="text-sm text-cyan-100">
              Drag and drop your image here or{" "}
              <span className="underline text-cyan-300 cursor-pointer">
                click to upload
              </span>
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        disabled={!image}
        className={`w-full py-2 text-white font-semibold rounded-xl transition duration-300 ${
          image
            ? "bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer"
            : "bg-cyan-900 text-cyan-300 cursor-not-allowed"
        }`}
      >
        {image ? "Authenticate with an image" : "Insert an image"}
      </button>
    </form>
  );
}
