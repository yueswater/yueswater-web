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
      }, "image/jpeg");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4">
      <div className="relative h-[400px] w-full max-w-lg overflow-hidden rounded-3xl bg-base-300">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="mt-8 flex w-full max-w-lg flex-col gap-6 px-4">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="range range-primary range-sm"
        />

        <div className="grid grid-cols-2 gap-4">
          <button onClick={onCancel} className="btn btn-ghost rounded-2xl text-white">
            取消
          </button>
          <button onClick={createCroppedImage} className="btn btn-primary rounded-2xl">
            確認裁剪並上傳
          </button>
        </div>
      </div>
    </div>
  );
}