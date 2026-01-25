"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { postService } from "@/services/postService";

interface LikeSectionProps {
  postId: number;
  initialLikes: number;
  isLiked?: boolean;
}

export function LikeSection({ postId, initialLikes, isLiked = false }: LikeSectionProps) {
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
    } catch (error) {
      setLiked(previousLiked);
      setLikes(previousLikes);
      console.error("按讚失敗", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-12 mb-8 flex w-full max-w-3xl flex-col items-center">
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          disabled={isLoading}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            liked
              ? "border-red-500 bg-red-50 text-red-500"
              : "text-base-content/50 border-[color:var(--border)] hover:border-red-400 hover:text-red-400"
          } `}
        >
          <Heart
            className={`h-8 w-8 transition-all duration-300 ${liked ? "fill-current" : ""}`}
            strokeWidth={1.5}
          />
        </motion.button>
      </div>
      <span className="text-base-content/60 mt-3 text-sm font-medium">{likes} 人喜歡這篇文章</span>
    </div>
  );
}
