"use client";

import { useAuth } from "@/context/AuthContext";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function AvatarUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // 此處應實作上傳邏輯
    setTimeout(() => setUploading(false), 1500);
  };

  return (
    <div className="relative">
      <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-base-200 shadow-md">
        {user?.avatar ? (
          <Image src={user.avatar} alt="Avatar" width={128} height={128} className="object-cover" />
        ) : (
          <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-3xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <label className="btn btn-primary btn-circle btn-sm absolute right-0 bottom-0 shadow-lg cursor-pointer">
        <Camera className="h-4 w-4" />
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}