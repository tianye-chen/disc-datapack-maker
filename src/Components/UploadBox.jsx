import React, { useRef, useState } from "react";

export const UploadBox = ({ onFileUpload, uploadMessage }) => {
  const fileInput = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);

  // When user drags a file over the upload box
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  // When user drags a file out of the upload box
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // When user drops a file into the upload box
  const handleDrop = (e) => {
    e.preventDefault();

    // Lifts the file state up to the parent component
    selfHandleFileUpload(e.dataTransfer.files[0]);
    setDragOver(false);
  };

  // When user clicks to upload a file
  const handleFileSelect = (e) => {
    e.preventDefault();

    // Lifts the file state up to the parent component
    selfHandleFileUpload(e.target.files[0]);
  };

  const selfHandleFileUpload = (file) => {
    setFile(file);
    onFileUpload(file);
};

  // Triggers handleFileSelect when user clicks on the upload box
  const triggerFileSelect = () => {
    fileInput.current.click();
  };

  return (
    <div
    class={`relative flex h-full w-full flex-col items-center justify-center 
            rounded-2xl outline-2 group 
            ${file ? "outline-transparent" : "outline-dashed outline-[#ffffff55]"} 
            transition-all ease-in-out hover:cursor-pointer`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    onClick={triggerFileSelect}
    >

    {/* Hover overlay */}
    <div
        class={`absolute inset-0 rounded-2xl transition-all 
                ${dragOver ? "bg-[#00000055]" : "group-hover:bg-[#00000055] group-active:bg-[#0000055]"} 
                z-10`}
    ></div>

    {/* Preview image */}
    {file && (
        <img
        src={URL.createObjectURL(file)}
        class="absolute max-h-full max-w-full rounded-2xl z-0"
        />
    )}

    {/* Text overlay */}
    <h1 class={`select-none text-2xl font-bold text-white z-20 opacity-0 ${!file || dragOver ? "opacity-100" : "group-hover:opacity-100"} transition-all ease-in-out`}>
        {uploadMessage}
    </h1>

    {/* Hidden input */}
    <input
        ref={fileInput}
        type="file"
        onChange={handleFileSelect}
        class="hidden"
    />
    </div>
  );
};