"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, Upload } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUploadSuccess = (result: any) => {
    onChange(result.info.secure_url);
    setIsLoading(false);
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col items-center justify-center gap-4">
        {value ? (
          <div className="relative w-full aspect-video rounded-md overflow-hidden border border-gray-200">
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={removeImage}
                variant="destructive"
                size="icon"
                className="h-7 w-7 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={value}
              alt="Template image"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-gray-500">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-sm mb-2">No image selected</p>
          </div>
        )}
        
        <CldUploadWidget
          uploadPreset="exportpitch"
          onSuccess={onUploadSuccess}
          options={{
            maxFiles: 1,
            resourceType: "image",
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsLoading(true);
                open();
              }}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                "Uploading..."
              ) : value ? (
                "Change Image"
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
          )}
        </CldUploadWidget>
      </div>
    </div>
  );
}