// src/components/features/sidebar/AboutWidget.tsx

import Image from "next/image";
import Link from "next/link";

export function AboutWidget() {
  return (
    <div className="bg-card flex flex-col items-center p-6 text-center">
      {/* 標題區塊：仿照截圖的上下線條風格 */}
      <div className="relative mb-6 flex w-full items-center justify-center">
        <h3 className="text-foreground border-primary/20 border-b-2 px-4 pb-2 text-xl font-black">
          關於我
        </h3>
      </div>

      {/* 頭像 */}
      <div className="relative mb-4 h-32 w-32">
        <Image
          src="/images/avatar.png"
          alt="站長頭貼"
          fill
          className="border-background rounded-full border-4 object-cover shadow-md"
          priority
        />
      </div>

      {/* 粉絲數 (靜態示範，之後可串接) */}
      <div className="text-muted-foreground mb-4 text-sm font-bold">3.7 K Followers</div>

      {/* 簡介文字 */}
      <p className="text-foreground/80 mb-6 text-justify text-sm leading-relaxed">
        泉源思緒，細品人生
      </p>

      {/* 按鈕 */}
      <Link
        href="/about"
        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded border px-8 py-2 text-sm font-bold tracking-wider transition-all duration-300"
      >
        了解更多
      </Link>
    </div>
  );
}
