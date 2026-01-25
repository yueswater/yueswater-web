"use client";

import { useEffect, useState, useRef } from "react";
import { postService } from "@/services/postService";
import { PostCard } from "@/components/features/posts/PostCard";
import { TrendingSidebar } from "@/components/features/posts/TrendingSidebar";
import { Post } from "@/types";
import { Loader2, ChevronLeft, ChevronRight, List } from "lucide-react";
import { AboutWidget } from "@/components/features/sidebar/AboutWidget";

const POSTS_PER_PAGE = 5;

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);

  // 用來定位列表頂端 (換頁時滾動用)
  const listTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await postService.getPublishedPosts();
        setPosts(data);
      } catch (error) {
        console.error("載入文章失敗:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // 換頁處理：滾動到列表頂部
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (listTopRef.current) {
      // 設定 offset，避免被 fixed navbar 擋住
      const y = listTopRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-foreground/40 animate-pulse text-sm font-medium">正在搬運礦泉水...</p>
      </div>
    );
  }

  // --- 資料處理邏輯 ---

  // 1. 左側列表：按時間排序 (最新 -> 最舊)
  const sortedByDate = [...posts].sort(
    (a, b) =>
      new Date(b.published_at || b.created_at).getTime() -
      new Date(a.published_at || a.created_at).getTime()
  );

  // 2. 右側側邊欄：按熱門度排序
  const sortedByPopularity = [...posts].sort((a, b) => {
    const viewDiff = (b.view_count || 0) - (a.view_count || 0);
    if (viewDiff !== 0) return viewDiff;
    return (b.likes_count || 0) - (a.likes_count || 0);
  });
  const trendingPosts = sortedByPopularity.slice(0, 5);

  // 3. 分頁計算 (只針對左側列表)
  const totalPages = Math.ceil(sortedByDate.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPaginatedPosts = sortedByDate.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* 雙欄佈局容器 */}
      <div className="grid items-start gap-8 md:grid-cols-7 lg:gap-12">
        {/* =========================================
            左側：文章列表區 (佔 5 欄)
           ========================================= */}
        <div className="flex flex-col md:col-span-5" ref={listTopRef}>
          {/* 標題 (可選) */}
          <div className="text-primary border-border/40 mb-6 flex items-center gap-2 border-b pb-4 text-xl font-black tracking-[0.2em] uppercase">
            <List className="h-4 w-4" />
            最新文章
          </div>

          {/* 文章列表 */}
          <div className="flex flex-col">
            {currentPaginatedPosts.length > 0 ? (
              currentPaginatedPosts.map((post) => (
                <PostCard
                  key={post.uuid}
                  post={post}
                  variant="list" // 使用你剛剛改好的列表樣式
                />
              ))
            ) : (
              <div className="text-muted-foreground py-20 text-center">目前沒有文章</div>
            )}
          </div>

          {/* 分頁按鈕區 */}
          {totalPages > 1 && (
            <div className="border-border/40 mt-12 flex items-center justify-center gap-6 border-t pt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="hover:bg-accent flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                前一頁
              </button>

              <span className="text-primary text-sm font-bold">
                {currentPage}{" "}
                <span className="text-muted-foreground font-normal">/ {totalPages}</span>
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="hover:bg-accent flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-30"
              >
                下一頁
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* =========================================
            右側：熱門文章側邊欄 (佔 2 欄)
           ========================================= */}
        <aside className="sticky top-24 hidden flex-col gap-10 md:col-span-2 md:flex">
          <TrendingSidebar posts={trendingPosts} />
          {/* <AboutWidget /> */}
        </aside>
      </div>
    </main>
  );
}
