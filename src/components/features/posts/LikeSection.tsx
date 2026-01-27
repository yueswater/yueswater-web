"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { postService } from "@/services/postService";
import { useToast } from "@/context/ToastContext";

interface LikeSectionProps {
  postId: number;
  initialLikes: number;
  isLiked?: boolean;
}

export function LikeSection({ postId, initialLikes, isLiked = false }: LikeSectionProps) {
  const { showToast } = useToast();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLiked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLatestStatus = async () => {
      try {
        const status = await postService.getPostLikeStatus(postId);
        setLiked(status.liked);
        setLikes(status.likes_count);
      } catch (error) {
        console.error("無法同步按讚狀態", error);
      }
    };
    fetchLatestStatus();
  }, [postId]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const previousLiked = liked;
    const previousLikes = likes;
    const newLikedState = !liked;

    setLiked(newLikedState);
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      const response = await postService.toggleLike(postId);
      setLiked(response.liked);
      setLikes(response.likes_count);
      if (response.liked) {
        showToast("感謝你的喜歡！", "success");
      }
    } catch (error) {
      setLiked(previousLiked);
      setLikes(previousLikes);
      showToast("操作失敗", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          disabled={isLoading}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            liked
              ? "border-[#f82834] bg-red-50 text-[#f82834]"
              : "text-base-content/50 border-base-content/10 hover:border-[#ff6266] hover:text-[#ff6266]"
          } `}
        >
          <Heart
            className={`h-8 w-8 transition-all duration-300 ${liked ? "fill-current" : ""}`}
            strokeWidth={1.5}
          />
        </motion.button>
      </div>
      <span className="mt-2 text-xs font-black uppercase tracking-widest text-base-content/30">
        {likes} 個讚
      </span>
    </div>
  );
}