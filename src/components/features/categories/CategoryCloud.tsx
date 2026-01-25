"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Category } from "@/types";

interface CategoryCloudProps {
  categories: Category[];
}

export function CategoryCloud({ categories }: CategoryCloudProps) {
  const maxCount = Math.max(...categories.map((c) => c.count));
  const minCount = Math.min(...categories.map((c) => c.count));

  const getSizeStyles = (count: number) => {
    const range = maxCount - minCount;
    const normalized = (count - minCount) / (range || 1);

    if (normalized > 0.8) return { className: "text-6xl md:text-8xl font-black", opacity: 1 };
    if (normalized > 0.6) return { className: "text-5xl md:text-7xl font-extrabold", opacity: 0.9 };
    if (normalized > 0.4) return { className: "text-4xl md:text-6xl font-bold", opacity: 0.85 };
    if (normalized > 0.2) return { className: "text-3xl md:text-5xl font-semibold", opacity: 0.7 };
    return { className: "text-2xl md:text-3xl font-medium", opacity: 0.6 };
  };

  const getColorClass = (index: number) => {
    const colors = [
      "text-primary",
      "text-secondary",
      "text-accent",
      "text-neutral-content",
      "text-base-content",
    ];
    return colors[index % colors.length];
  };

  // 偽隨機生成器 (使用不同的係數，讓分類雲看起來跟標籤雲略有不同)
  const getRandomStyle = (index: number) => {
    // 角度小一點，因為分類字通常比較長
    const rotate = (index % 2 === 0 ? 1 : -1) * ((index * 13) % 10);
    const marginX = (index * 7) % 30;
    const marginY = (index * 4) % 20;

    return { rotate, margin: `${marginY}px ${marginX}px` };
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", bounce: 0.4 },
    },
  };

  return (
    <div className="relative flex h-full min-h-[500px] w-full items-center justify-center p-8">
      <motion.div
        className="flex w-full flex-wrap content-center items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category, index) => {
          const { className, opacity } = getSizeStyles(category.count);
          const randomStyle = getRandomStyle(index);

          return (
            <motion.div
              key={category.id}
              variants={itemVariants}
              style={{
                marginRight: randomStyle.margin.split(" ")[1],
                marginBottom: randomStyle.margin.split(" ")[0],
              }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className={` ${className} ${getColorClass(index)} hover:text-primary inline-block cursor-pointer drop-shadow-lg transition-all duration-300 ease-out hover:z-20 hover:scale-105 hover:rotate-0`}
                style={{
                  opacity: opacity,
                  transform: `rotate(${randomStyle.rotate}deg)`,
                }}
              >
                {category.name}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
