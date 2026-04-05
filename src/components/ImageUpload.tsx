"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { ImageIcon, XIcon } from "lucide-react";
import React from "react";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

const ImageUpload = ({ onChange, value, endpoint }: ImageUploadProps) => {
  if (value) {
    return (
      <div className="relative">
        <img
          src={value}
          alt="upload"
          className="rounded-lg size-40 object-cover"
        />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
          type="button"
        >
          <XIcon />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res: any) => {
        console.log(res);
        onChange(res?.[0]?.ufsUrl || "");
      }}
      onUploadError={(error: Error) => {
        console.log("Error is ", error);
      }}
      className="w-full h-40"
      appearance={{
        container:
          "border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition cursor-pointer",
        label: "text-gray-600 font-medium",
        allowedContent: "text-xs text-gray-400",
        button:
          "bg-blue-500 text-white px-4 py-4  rounded-md mt-2 hover:bg-blue-600",
      }}
      content={{
        label: (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-10 h-10 text-gray-400" />
            <p>Click or drag image to upload</p>
          </div>
        ),
      }}
    />
  );
};

export default ImageUpload;
