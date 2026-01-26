"use client";

import { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, altText: string) => Promise<void>;
}

export function ImageUploadModal({ isOpen, onClose, onUpload }: ImageUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAltText(selectedFile.name.split(".").slice(0, -1).join("."));
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      await onUpload(file, altText);
      showToast("圖片上傳成功", "success");
      setFile(null);
      setPreview(null);
      setAltText("");
      onClose();
    } catch (error) {
      showToast("上傳失敗，請重試", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/0 backdrop-blur-sm duration-200">
      <div className="bg-card relative w-full max-w-md space-y-6 overflow-hidden rounded-xl border border-[color:var(--border)] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <ImageIcon className="text-primary h-5 w-5" />
            插入圖片
          </h3>
          <button
            onClick={handleClose}
            className="text-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all ${preview ? "border-primary/50" : "hover:border-primary/50 hover:bg-primary/5 border-[color:var(--border)]"} `}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {preview ? (
            <div className="relative h-full w-full p-2">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="rounded object-contain"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 font-medium text-white opacity-0 transition-opacity hover:opacity-100">
                點擊更換圖片
              </div>
            </div>
          ) : (
            <div className="text-foreground/40 space-y-2 text-center">
              <Upload className="mx-auto h-10 w-10" />
              <p className="text-sm">點擊選擇或拖曳圖片至此</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-foreground/70 text-sm font-medium">圖片描述 (Alt Text)</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="輸入圖片描述..."
            className="bg-background focus:border-primary w-full rounded-lg border border-[color:var(--border)] px-3 py-2 text-sm transition-colors outline-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleClose}
            className="hover:bg-secondary flex-1 rounded-lg border border-[color:var(--border)] px-4 py-2 text-sm font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="bg-primary text-primary-foreground flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "確認上傳"}
          </button>
        </div>
      </div>
    </div>
  );
}