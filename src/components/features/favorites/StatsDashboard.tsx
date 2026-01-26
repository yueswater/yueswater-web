"use client";

import { useMemo } from "react";
import { Tag, FolderOpen, Flame } from "lucide-react";

interface StatsDashboardProps {
  bookmarks: any[];
}

export function StatsDashboard({ bookmarks }: StatsDashboardProps) {
  const stats = useMemo(() => {
    const categories: Record<string, number> = {};
    const tags: Record<string, number> = {};
    const dates: Record<string, number> = {};

    bookmarks.forEach((b) => {
      // 1. 分類統計
      const cat = b.post?.category?.name || "未分類";
      categories[cat] = (categories[cat] || 0) + 1;

      // 2. 標籤統計
      const postTags = b.post?.tags || [];
      postTags.forEach((t: any) => {
        const tagName = t.name;
        if (tagName) {
          tags[tagName] = (tags[tagName] || 0) + 1;
        }
      });

      // 3. 日期統計
      const dateStr = new Date(b.created_at).toLocaleDateString();
      dates[dateStr] = (dates[dateStr] || 0) + 1;
    });

    const getTop = (obj: Record<string, number>) => {
      const entries = Object.entries(obj);
      if (entries.length === 0) return ["無數據", 0];
      return entries.sort((a, b) => b[1] - a[1])[0];
    };

    return {
      topCategory: getTop(categories),
      topTag: getTop(tags),
      topDate: getTop(dates),
    };
  }, [bookmarks]);

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-base-200 bg-base-100 p-6 flex items-center gap-4 hover:border-blue-400/30 transition-all">
        <div className="p-3 rounded-xl">
          <FolderOpen className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-bold opacity-40 uppercase tracking-wider">收藏最多的分類</p>
          <p className="text-xl font-black text-base-content/80">{stats.topCategory[0]}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-base-200 bg-base-100 p-6 flex items-center gap-4 hover:border-primary/30 transition-all">
        <div className="p-3 rounded-xl">
          <Tag className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-bold opacity-40 uppercase tracking-wider">熱衷的標籤</p>
          <p className="text-xl font-black text-base-content/80">
            {stats.topTag[0] === "無數據" ? "無標籤數據" : `#${stats.topTag[0]}`}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-base-200 bg-base-100 p-6 flex items-center gap-4 hover:border-orange-400/30 transition-all">
        <div className="p-3 rounded-xl">
          <Flame className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-bold opacity-40 uppercase tracking-wider">收藏頻率最高</p>
          <p className="text-xl font-black text-base-content/80">{stats.topDate[0]}</p>
        </div>
      </div>
    </div>
  );
}