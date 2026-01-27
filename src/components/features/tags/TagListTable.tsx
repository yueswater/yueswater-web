"use client";

import Link from "next/link";
import { Tag } from "@/types";
import { ArrowRight, Hash } from "lucide-react";

interface TagListTableProps {
  tags: Tag[];
}

export function TagListTable({ tags }: TagListTableProps) {
  const sortedTags = [...tags].sort((a, b) => (b.count || 0) - (a.count || 0));

  return (
    <div className="bg-base-100 flex h-full flex-col overflow-hidden rounded-3xl p-4 border border-base-content/5 shadow-sm">
      <div className="mb-4 px-2 shrink-0">
        <h3 className="text-base-content/80 text-lg font-bold">熱門標籤</h3>
        <p className="text-base-content/50 text-xs">共 {tags.length} 個標籤</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="table w-full border-separate border-spacing-y-1">
          <thead className="sticky top-0 z-20 bg-base-100">
            <tr className="text-base-content/50 text-xs tracking-wider uppercase">
              <th className="w-16 py-3 text-center bg-base-100">#</th>
              <th className="py-3 bg-base-100">TAG</th>
              <th className="py-3 text-right bg-base-100">COUNT</th>
              <th className="w-12 bg-base-100"></th>
            </tr>
          </thead>
          <tbody className="before:block before:h-2">
            {sortedTags.map((tag, index) => (
              <tr
                key={tag.id}
                className="group hover:bg-base-200/50 transition-all duration-200"
              >
                <td className="text-base-content/40 rounded-l-xl text-center font-mono text-xs">
                  {index + 1}
                </td>
                <td>
                  <Link
                    href={`/tags/${tag.slug}`}
                    className="text-md hover:text-primary flex items-center gap-2 py-2 font-medium transition-colors"
                  >
                    <Hash className="text-primary/40 group-hover:text-primary h-3 w-3 transition-colors" />
                    {tag.name}
                  </Link>
                </td>
                <td className="text-right">
                  <span className="text-base-content/60 bg-base-200 group-hover:bg-primary/10 group-hover:text-primary rounded-md px-2 py-1 font-mono text-xs transition-colors">
                    {tag.count || 0}
                  </span>
                </td>
                <td className="rounded-r-xl">
                  <Link
                    href={`/tags/${tag.slug}`}
                    className="btn btn-ghost btn-xs btn-circle translate-x-[-5px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <ArrowRight className="text-primary h-3 w-3" />
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