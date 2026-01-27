export async function scaleImage(file: File, scalePercent: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const scale = scalePercent / 100;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        if (!ctx) {
          reject(new Error("Canvas context is null"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const scaledFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(scaledFile);
            } else {
              reject(new Error("Canvas toBlob failed"));
            }
          },
          file.type,
          0.9
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
}