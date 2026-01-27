"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { postService } from "@/services/postService";
import { useToast } from "@/context/ToastContext";

interface BookmarkSectionProps {
  postId: number;
}

export function BookmarkSection({ postId }: BookmarkSectionProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
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
      showToast(data.bookmarked ? "已加入我的收藏" : "已從收藏移除", "success");
    } catch (error) {
      showToast("操作失敗，請稍後再試", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center">
      <div className="relative flex h-16 items-center justify-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          disabled={isLoading}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            isBookmarked
              ? "border-[#2a7eff] bg-blue-50 text-[#2a7eff]"
              : "text-base-content/50 border-base-content/10 hover:border-[#4ea0ff] hover:text-[#4ea0ff]"
          } `}
        >
          <Bookmark
            className={`h-8 w-8 transition-all duration-300 ${isBookmarked ? "fill-current" : ""}`}
            strokeWidth={1.5}
          />
        </motion.button>
      </div>
      <span className="mt-2 text-xs font-black uppercase tracking-widest text-base-content/30">
        {isBookmarked ? "已收藏" : "收藏"}
      </span>
    </div>
  );
}