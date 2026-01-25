"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Tag } from "@/types";

interface TagCloudProps {
  tags: Tag[];
}

export function TagCloud({ tags }: TagCloudProps) {
  const maxCount = Math.max(...tags.map((t) => t.count || 0));
  const minCount = Math.min(...tags.map((t) => t.count || 0));

  // 1. 更戲劇化的字體大小計算 (增加 font-weight 的變化)
  const getSizeStyles = (count: number = 0) => {
    const range = maxCount - minCount;
    const normalized = (count - minCount) / (range || 1);

    // 回傳字體大小 class 與 透明度，讓熱門標籤更顯眼
    if (normalized > 0.8) return { className: "text-5xl md:text-7xl font-black", opacity: 1 };
    if (normalized > 0.6) return { className: "text-4xl md:text-6xl font-extrabold", opacity: 0.9 };
    if (normalized > 0.4) return { className: "text-3xl md:text-5xl font-bold", opacity: 0.8 };
    if (normalized > 0.2) return { className: "text-2xl md:text-4xl font-semibold", opacity: 0.7 };
    return { className: "text-xl md:text-2xl font-medium", opacity: 0.6 };
  };

  // 2. 顏色分配 (保持原本邏輯)
  const getColorClass = (index: number) => {
    const colors = ["text-primary", "text-secondary", "text-accent", "text-info", "text-success"];
    return colors[index % colors.length];
  };

  // 3. 偽隨機樣式生成器 (解決 Hydration Error)
  // 利用 index 來產生看起來隨機但其實固定的旋轉與位移
  const getRandomStyle = (index: number) => {
    const rotate = (index % 2 === 0 ? 1 : -1) * ((index * 7) % 15); // -15deg 到 15deg
    const marginX = (index * 3) % 20; // 0px 到 20px
    const marginY = (index * 5) % 15; // 0px 到 15px

    return {
      rotate: rotate,
      margin: `${marginY}px ${marginX}px`,
    };
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  return (
    <div className="relative flex h-full min-h-[400px] w-full items-center justify-center p-4">
      {/* 移除原本的背景框，改用完全透明的容器 */}
      <motion.div
        className="flex w-full max-w-4xl flex-wrap content-center items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tags.map((tag, index) => {
          const { className, opacity } = getSizeStyles(tag.count);
          const randomStyle = getRandomStyle(index);

          return (
            <motion.div
              key={tag.id}
              variants={itemVariants}
              style={{
                marginRight: randomStyle.margin.split(" ")[1],
                marginBottom: randomStyle.margin.split(" ")[0],
              }}
            >
              <Link
                href={`/tags/${tag.slug}`}
                className={` ${className} ${getColorClass(index)} hover:text-primary inline-block cursor-pointer drop-shadow-sm transition-all duration-300 ease-out hover:z-10 hover:scale-110 hover:opacity-100`}
                style={{
                  opacity: opacity,
                  transform: `rotate(${randomStyle.rotate}deg)`, // 初始旋轉
                }}
              >
                <span className="mr-1 align-middle text-[0.5em] opacity-50">#</span>
                {tag.name}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
