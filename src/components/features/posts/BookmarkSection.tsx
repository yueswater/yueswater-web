"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { postService } from "@/services/postService";

interface BookmarkSectionProps {
  postId: number;
}

export function BookmarkSection({ postId }: BookmarkSectionProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchStatus = async () => {
        try {
          const data = await postService.getBookmarkStatus(postId);
          setIsBookmarked(data.bookmarked);
        } catch (error) {
          console.error(error);
        }
      };
      fetchStatus();
    }
  }, [postId, user]);

  const handleToggle = async () => {
    if (!user) {
      window.location.href = `/login?redirect=${window.location.pathname}`;
      return;
    }

    setIsLoading(true);
    try {
      const data = await postService.toggleBookmark(postId);
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      alert("收藏操作失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-12 mb-8 flex w-full max-w-3xl flex-col items-center">
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          disabled={isLoading}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            isBookmarked
              ? "border-blue-500 bg-blue-50 text-blue-500"
              : "text-base-content/50 border-[color:var(--border)] hover:border-blue-400 hover:text-blue-400"
          } `}
        >
          <Bookmark
            className={`h-8 w-8 transition-all duration-300 ${isBookmarked ? "fill-current" : ""}`}
            strokeWidth={1.5}
          />
        </motion.button>
      </div>
      <span className="text-base-content/60 mt-3 text-sm font-medium">{isBookmarked ? "已收藏" : "收藏文章"}</span>
    </div>
  );
}