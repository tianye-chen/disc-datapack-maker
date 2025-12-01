import React, { useRef, useState } from "react";

export const UploadBox = ({ uploadMessage, size }) => {
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
    handleFiles(e.dataTransfer.files[0]);
    setDragOver(false);
  };

  // When user clicks to upload a file
  const handleFileSelect = (e) => {
    e.preventDefault();

    // Lifts the file state up to the parent component
    handleFiles(e.target.files[0]);
  };

  const handleFiles = (file) => {
    setFile(file);
  };

  // Triggers handleFileSelect when user clicks on the upload box
  const triggerFileSelect = () => {
    fileInput.current.click();
  };

  return (
    <div
      class={`group relative flex aspect-square h-full w-full flex-col items-center justify-center rounded-2xl outline-2 ${file ? "outline-transparent" : "outline-upload-border outline-dashed"} transition-all ease-in-out hover:cursor-pointer`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      {/* Hover overlay */}
      <div
        class={`absolute inset-0 rounded-2xl transition-all ${dragOver ? "bg-upload-hover" : "group-hover:bg-upload-hover group-active:bg-upload-hover"} z-10`}
      ></div>

      {/* Preview image */}
      {file && (
        <img
          src={URL.createObjectURL(file)}
          class="absolute z-0 max-h-full max-w-full rounded-2xl"
        />
      )}

      {/* Text overlay */}
      <h1
        class={`select-none ${size == "big" ? "text-2xl" : "text-xs"} z-20 font-bold text-primary-text opacity-0 ${!file || dragOver ? "opacity-100" : "group-hover:opacity-100"} transition-all ease-in-out`}
      >
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
