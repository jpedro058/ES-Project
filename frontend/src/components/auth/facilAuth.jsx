import React, { useState, useRef, useContext } from "react";
import { UploadCloud, ImageIcon } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function FacilAuth() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const { updateUser, updateToken } = useContext(AuthContext);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) {
      alert("Please select an image.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // dizer que estamos a enviar JSON
        },
        body: JSON.stringify({ image_filename: image.name }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      updateUser(data.user_id);
      updateToken(data.access_token);

      window.location.href = "/home";
    } catch (error) {
      console.error("Error submitting image:", error);
      alert("Error submitting image. Please try again.");
    }
  }

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
