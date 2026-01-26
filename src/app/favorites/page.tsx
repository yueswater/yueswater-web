"use client";

import { useEffect, useState } from "react";
import { postService } from "@/services/postService";
import { useAuth } from "@/context/AuthContext";
import { FavoriteTable } from "@/components/features/favorites/FavoriteTable";
import { StatsDashboard } from "@/components/features/favorites/StatsDashboard";
import { Bookmark } from "lucide-react";

export default function FavoritesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/login?redirect=/favorites";
      return;
    }

    const fetchFavorites = async () => {
      try {
        const data = await postService.getMyBookmarks();
        setBookmarks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchFavorites();
  }, [user, authLoading]);

  if (isLoading || authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-16">
      <header className="mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Bookmark className="h-6 w-6 text-primary-content fill-current" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">收藏文章</h1>
        </div>
      </header>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-base-300 rounded-3xl">
          <p className="opacity-40">尚未收藏任何文章</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-10">
          <div className="lg:col-span-6">
            <h2 className="mb-4 text-sm font-bold opacity-50 uppercase tracking-widest">最近收藏</h2>
            <FavoriteTable bookmarks={bookmarks} />
          </div>

          <div className="lg:col-span-4">
            <h2 className="mb-4 text-sm font-bold opacity-50 uppercase tracking-widest">收藏統計</h2>
            <StatsDashboard bookmarks={bookmarks} />
          </div>
        </div>
      )}
    </main>
  );
}