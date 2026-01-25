"use client";

import { useAuth } from "@/context/AuthContext";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { authService } from "@/services/authService";

export function AvatarUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("圖片大小不能超過 2MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

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
      <div className="h-full w-full overflow-hidden rounded-full ring-8 ring-base-100">
        {user?.avatar ? (
          <Image src={user.avatar} alt="頭像" fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-5xl font-black text-primary">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <label className="btn btn-primary btn-circle btn-sm absolute bottom-1 right-1 cursor-pointer border-none">
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}