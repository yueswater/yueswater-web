"use client";

import Link from "next/link";
import { Category } from "@/types";
import { ArrowRight } from "lucide-react";

interface CategoryListTableProps {
  categories: Category[];
}

export function CategoryListTable({ categories }: CategoryListTableProps) {
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-base-100 relative flex h-full flex-col overflow-hidden rounded-3xl p-4">
      {/* 標題區 (可選，讓表格更完整) */}
      <div className="mb-4 px-2">
        <h3 className="text-base-content/80 text-lg font-bold">分類排行</h3>
        <p className="text-base-content/50 text-xs">依照文章數量排序</p>
      </div>

      <div className="custom-scrollbar -mr-2 flex-1 overflow-y-auto pr-2">
        <table className="table w-full border-separate border-spacing-y-2">
          {/* 表頭：更精緻的排版 */}
          <thead className="bg-base-100 sticky top-0 z-10">
            <tr className="text-base-content/50 border-base-200/50 border-b text-xs tracking-wider uppercase">
              <th className="w-16 py-3 text-center">排名</th>
              <th className="py-3">分類名稱</th>
              <th className="py-3 text-right">文章數</th>
              <th className="w-16"></th>
            </tr>
          </thead>

          <tbody>
            {sortedCategories.map((category, index) => (
              <tr
                key={category.id}
                className="group hover:bg-base-200/50 rounded-xl transition-all duration-200"
              >
                {/* 排名：前三名給予特殊顏色 */}
                <td className="rounded-l-xl text-center font-mono text-sm font-bold">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                      index === 0
                        ? "bg-yellow-400/20 text-yellow-600"
                        : index === 1
                          ? "bg-gray-300/30 text-gray-600"
                          : index === 2
                            ? "bg-orange-400/20 text-orange-600"
                            : "text-base-content/40"
                    } `}
                  >
                    {index + 1}
                  </span>
                </td>

                <td className="text-base font-bold md:text-lg">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="hover:text-primary block py-2 transition-colors"
                  >
                    {category.name}
                  </Link>
                </td>

                <td className="text-right">
                  <span className="badge badge-ghost bg-base-200/50 text-base-content/70 font-mono">
                    {category.count}
                  </span>
                </td>

                <td className="rounded-r-xl text-center">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="btn btn-ghost btn-xs btn-circle translate-x-[-10px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <ArrowRight className="text-primary h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
