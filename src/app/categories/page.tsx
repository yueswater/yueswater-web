import React from "react";
import { CategoryCloud } from "@/components/features/categories/CategoryCloud";
import { CategoryListTable } from "@/components/features/categories/CategoryListTable";
import { getCategories } from "@/services/categoryService";

export const metadata = {
  title: "分類總覽 | 岳氏礦泉水",
  description: "探索所有文章分類，從機器學習到生活隨筆。",
};

export default async function CategoriesPage() {
  // 1. 在 Server Component 取得資料
  const categories = await getCategories();

  return (
    <main className="container mx-auto min-h-screen px-4 py-12 md:py-20">
      {/* 頁面標題 */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
          全部分類
          <span className="text-primary ml-2 align-top text-2xl md:text-3xl">.</span>
        </h1>
        <p className="text-base-content/60 max-w-2xl text-lg">
          這裡匯集了所有寫過的主題。你可以透過左側的文字雲直觀探索熱門領域，或在右側列表中查找特定分類。
        </p>
      </div>

      {/* 核心佈局：左 65% | 右 35% */}
      <div className="flex h-auto flex-col gap-8 lg:h-[600px] lg:flex-row">
        {/* 左側：文字雲 (佔 65%) */}
        <section className="flex h-full w-full flex-col lg:w-[65%]">
          <div className="bg-base-100 group relative h-full overflow-hidden rounded-3xl p-1">
            {/* 裝飾背景 */}
            <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
            <div className="bg-secondary/5 pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />

            {/* 這裡引用你之前寫好的元件 */}
            <CategoryCloud categories={categories} />
          </div>
        </section>

        {/* 右側：列表 (佔 35%) */}
        <section className="flex h-full w-full flex-col lg:w-[35%]">
          {/* 這裡引用你之前寫好的元件 */}
          <CategoryListTable categories={categories} />
        </section>
      </div>
    </main>
  );
}
