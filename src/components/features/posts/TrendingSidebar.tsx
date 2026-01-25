"use client";

import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { PostCard } from "./PostCard";
import { Post } from "@/types";

interface TrendingSidebarProps {
  posts: Post[];
}

export function TrendingSidebar({ posts }: TrendingSidebarProps) {
  // 容器動畫
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  // 列表項動畫
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <aside className="space-y-6">
      <motion.div
        className="flex items-center gap-2 border-b border-[color:var(--border)] pb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TrendingUp className="text-primary h-5 w-5" />
        <h2 className="text-foreground text-xl font-bold">熱門排行</h2>
      </motion.div>

      <motion.div
        className="flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts.length > 0 ? (
          posts.slice(0, 5).map((post, index) => (
            <motion.div
              key={post.uuid}
              className="border-b border-[color:var(--border)] last:border-0"
              variants={itemVariants}
              whileHover={{ x: 4 }}
            >
              <PostCard post={post} variant="sidebar" ranking={index + 1} />
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-foreground/40 py-4 text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            暫無數據
          </motion.p>
        )}
      </motion.div>
    </aside>
  );
}
