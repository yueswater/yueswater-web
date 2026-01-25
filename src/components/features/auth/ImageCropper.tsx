"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

interface Props {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export function ImageCropper({ image, onCropComplete, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const onCropCompleteInternal = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const canvas = document.createElement("canvas");
      const img = new (window as any).Image();
      img.src = image;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
      }

      canvas.toBlob((blob) => {
        if (blob) onCropComplete(blob);
      }, "image/jpeg", 0.9);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative h-[450px] w-full max-w-xl overflow-hidden rounded-[2.5rem] bg-base-300 border-4 border-white/20 shadow-none">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          cropShape="round"
          showGrid={true}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="mt-10 flex w-full max-w-xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-4 bg-white/10 p-6 rounded-[2rem] border border-white/5">
          <div className="flex justify-between items-center px-1">
            <span className="text-white text-xs font-black uppercase tracking-widest">Zoom</span>
            <span className="text-accent text-xs font-black">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="range range-accent range-sm w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button 
            onClick={onCancel} 
            className="btn btn-ghost h-16 rounded-full text-white font-bold text-lg hover:bg-white/10 border-2 border-white/20 shadow-none"
          >
            取消
          </button>
          <button 
            onClick={createCroppedImage} 
            className="btn btn-primary h-16 rounded-full text-white font-black text-lg border-none shadow-none"
          >
            確認並上傳
          </button>
        </div>
      </div>
    </div>
  );
}