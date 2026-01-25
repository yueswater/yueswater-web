"use client";

import { useAuth } from "@/context/AuthContext";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { authService } from "@/services/authService";
import { ImageCropper } from "./ImageCropper";

export function AvatarUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setTempImage(reader.result as string);
    });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleUpload = async (croppedBlob: Blob) => {
    setTempImage(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("avatar", croppedBlob, "avatar.jpg");

    try {
      const updatedUser = await authService.updateAvatar(formData);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err: any) {
      alert("上傳失敗：" + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative mx-auto mb-6 h-36 w-36">
      <div className="h-full w-full overflow-hidden rounded-full ring-2 ring-base-100 bg-base-200">
        {user?.avatar ? (
          <Image src={user.avatar} alt="頭像" fill className="object-cover rounded-full" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-5xl font-black text-primary">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <label className="btn btn-primary btn-circle btn-sm absolute bottom-1 right-1 cursor-pointer border-none shadow-none">
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        ) : (
          <Camera className="h-4 w-4 text-white" />
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleUpload}
          onCancel={() => setTempImage(null)}
        />
      )}
    </div>
  );
}