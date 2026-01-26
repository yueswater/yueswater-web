"use client";

import Link from "next/link";
import { ChevronRight, Calendar, BookmarkX } from "lucide-react";
import { motion } from "framer-motion";

interface FavoriteTableProps {
  bookmarks: any[];
}

export function FavoriteTable({ bookmarks }: FavoriteTableProps) {
  const displayItems = bookmarks.slice(0, 5);

  return (
    <div className="flex flex-col gap-3">
      {/* 表頭 */}
      <div className="flex px-6 py-3 text-xs font-bold uppercase tracking-widest text-base-content/40">
        <div className="flex-[3]">文章標題</div>
        <div className="flex-1 text-center">收藏日期</div>
        <div className="w-24 text-right">動作</div>
      </div>

      {/* 清單內容 */}
      <div className="flex flex-col gap-2">
        {displayItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex items-center rounded-2xl border border-base-200 bg-base-100 px-6 py-4 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
          >
            {/* 標題區 */}
            <div className="flex flex-[3] items-center gap-3 overflow-hidden">
              <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-base-content/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <BookmarkX className="h-4 w-4" />
              </div>
              <Link 
                href={`/posts/${item.slug}`}
                className="truncate font-bold text-base-content/80 group-hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
            </div>

            {/* 日期區 */}
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-2 rounded-lg bg-base-200/50 px-3 py-1 text-xs font-medium text-base-content/50">
                <Calendar className="h-3 w-3" />
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* 按鈕區 */}
            <div className="w-24 text-right">
              <Link
                href={`/posts/${item.slug}`}
                className="inline-flex items-center gap-1 text-sm font-black text-primary opacity-0 transition-all group-hover:opacity-100 hover:gap-2"
              >
                閱讀 <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {bookmarks.length > 5 && (
        <Link 
          href="/favorites/all" 
          className="mt-2 text-center text-xs font-bold text-base-content/30 hover:text-primary transition-colors"
        >
          查看全部 {bookmarks.length} 篇收藏
        </Link>
      )}
    </div>
  );
}