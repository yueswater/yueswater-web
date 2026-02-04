"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Calendar, Eye, Heart, MessageSquare, User, FileText, Loader2 } from "lucide-react";
import { Post } from "@/types";
import { postService } from "@/services/postService";

interface ClientArticleHeaderProps {
  post: Post;
}

export function ClientArticleHeader({ post }: ClientArticleHeaderProps) {
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isDownloading, setIsDownloading] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("zh-TW")
    : new Date(post.created_at).toLocaleDateString("zh-TW");

  useEffect(() => {
    const fetchLatestLikes = async () => {
      try {
        const status = await postService.getPostLikeStatus(post.id);
        setLikesCount(status.likes_count);
      } catch (error) {
        console.error("同步按讚數失敗", error);
      }
    };

    fetchLatestLikes();
  }, [post.id]);

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await postService.downloadPostPdf(post.slug); 
    } catch (error) {
      console.error("下載 PDF 失敗:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.h1
        className="text-foreground mb-4 text-4xl font-black md:text-5xl"
        variants={itemVariants}
      >
        {post.title}
      </motion.h1>

      <motion.div
        className="text-foreground/60 mb-8 flex flex-wrap items-center gap-6 border-b border-[var(--border)] pb-8"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="font-medium">{post.author?.username || "未知作者"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{post.view_count || 0} 次瀏覽</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span>{likesCount} 個讚</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments?.length || 0} 則留言</span>
        </div>
        
        <motion.button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all duration-300 disabled:opacity-50"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          <span>
            {isDownloading ? "產生中..." : "下載文章 PDF"}
          </span>
        </motion.button>
      </motion.div>

      {(post.category || (post.tags && post.tags.length > 0)) && (
        <motion.div className="mb-8 flex flex-wrap gap-2" variants={itemVariants}>
          {post.category && (
            <Link
              key={`cat-${post.category.id}`}
              href={`/categories/${post.category.slug || post.category.name}`}
            >
              <motion.span
                className="bg-primary/10 text-primary inline-block cursor-pointer rounded-full px-3 py-1 text-xs font-bold"
                whileHover={{ scale: 1.05 }}
              >
                {post.category.name}
              </motion.span>
            </Link>
          )}

          {post.tags &&
            post.tags.map((tag) => (
              <Link key={`tag-${tag.id}`} href={`/tags/${tag.slug || tag.name}`}>
                <motion.span
                  className="bg-secondary/10 text-secondary inline-block cursor-pointer rounded-full px-3 py-1 text-xs font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  #{tag.name}
                </motion.span>
              </Link>
            ))}
        </motion.div>
      )}
    </motion.div>
  );
}