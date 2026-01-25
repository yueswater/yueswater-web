"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Tag, User, TagIcon } from "lucide-react";
import { Post } from "@/types";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface PostCardProps {
  post: Post;
  variant?: "hero" | "grid" | "sidebar" | "list";
  ranking?: number;
}

export function PostCard({ post, variant = "grid", ranking }: PostCardProps) {
  const postLink = `/posts/${post.slug}`;

  // 安全地處理日期
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : new Date(post.created_at).toLocaleDateString("zh-TW");

  // Hero 卡片動畫
  const heroTitleVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.15 },
    },
  };

  const heroDescVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.2 },
    },
  };

  const heroFooterVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.25 },
    },
  };

  // =================================================================
  // 1. Hero 模式
  // =================================================================
  if (variant === "hero") {
    return (
      <motion.article
        className="group bg-card relative grid overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-muted relative aspect-video overflow-hidden md:aspect-auto">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="bg-primary/10 text-primary/40 flex h-full w-full items-center justify-center text-6xl font-bold">
              {post.title.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <motion.div
            className="flex items-center gap-3"
            variants={heroTitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
              精選貼文
            </span>
            <div className="text-foreground/60 flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4" />
              <time>{formattedDate}</time>
            </div>
          </motion.div>

          <motion.h2
            className="text-foreground group-hover:text-primary line-clamp-2 text-2xl font-black transition-colors md:text-4xl"
            variants={heroTitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link href={postLink}>
              <span className="absolute inset-0 z-10" />
              {post.title}
            </Link>
          </motion.h2>

          <motion.p
            className="text-foreground/70 line-clamp-3 text-base leading-relaxed md:text-lg"
            variants={heroDescVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {post.excerpt || post.content.replace(/[#*`]/g, "").substring(0, 100) + "..."}
          </motion.p>

          <motion.div
            className="mt-4 flex items-center justify-between border-t border-[color:var(--border)] pt-6"
            variants={heroFooterVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-muted relative h-10 w-10 overflow-hidden rounded-full">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.username}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
              <span className="text-foreground/80 font-medium">{post.author.username}</span>
            </div>

            <div className="text-primary flex items-center gap-2 font-bold transition-transform group-hover:translate-x-1">
              閱讀更多 <ArrowRight className="h-5 w-5" />
            </div>
          </motion.div>
        </div>
      </motion.article>
    );
  }

  // =================================================================
  // 2. Sidebar 模式
  // =================================================================
  if (variant === "sidebar") {
    return (
      <motion.article
        className="group hover:bg-card/50 relative flex items-start gap-4 rounded-xl p-3 transition-colors"
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4 }}
      >
        {ranking && (
          <motion.div
            className={`text-3xl leading-none font-black italic ${ranking <= 3 ? "text-primary" : "text-foreground/20"}`}
          >
            {String(ranking).padStart(2, "0")}
          </motion.div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-bold transition-colors">
            <Link href={postLink}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <time className="text-foreground/40 mt-1 block text-xs">{formattedDate}</time>
        </div>
      </motion.article>
    );
  }

  // =================================================================
  // 3. List 模式 (修正分類顯示與新增標籤)
  // =================================================================
  if (variant === "list") {
    return (
      <motion.article
        className="group border-border/60 border-b py-8 last:border-none"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-3">
          {/* 標題 */}
          <h2 className="text-foreground group-hover:text-primary text-2xl font-bold transition-colors md:text-3xl">
            <Link href={postLink}>{post.title}</Link>
          </h2>

          {/* 新增：標籤列表 (在標題下方) */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-1 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-secondary bg-secondary/10 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Metadata 行 (作者、日期、分類) */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <User className="text-muted-foreground/60 h-4 w-4" />
              {post.author.username}
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="text-muted-foreground/60 h-4 w-4" />
              {formattedDate}
            </span>

            <div className="flex items-center gap-1.5">
              <TagIcon className="text-muted-foreground/60 h-4 w-4" />
              <div className="flex gap-1">
                {post.category ? (
                  <span key={post.category.id} className="text-primary/80">
                    {post.category.name}
                  </span>
                ) : (
                  <span>Uncategorized</span>
                )}
              </div>
            </div>
          </div>

          {/* 摘要 */}
          <p className="text-foreground/70 mt-1 line-clamp-3 leading-relaxed md:line-clamp-2">
            {post.excerpt || post.content.replace(/[#*`]/g, "").substring(0, 120) + "..."}
          </p>
        </div>
      </motion.article>
    );
  }

  // =================================================================
  // 4. Grid 模式
  // =================================================================
  return (
    <motion.article
      className="group bg-card relative flex h-full w-full flex-col overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg sm:max-w-xs md:max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-muted relative aspect-square w-full overflow-hidden">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="from-primary/20 to-primary/5 text-primary/30 absolute inset-0 flex items-center justify-center bg-linear-to-br text-3xl font-bold">
            {post.title.charAt(0)}
          </div>
        )}
        <motion.div
          className="absolute top-2 left-2 z-20"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <span className="bg-background/90 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm">
            <Tag className="h-2.5 w-2.5" />
            {post.category?.name || "Uncategorized"}
          </span>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <motion.h3
          className="text-foreground group-hover:text-primary line-clamp-2 text-sm leading-tight font-bold transition-colors"
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Link href={postLink}>
            <span className="absolute inset-0 z-10" />
            {post.title}
          </Link>
        </motion.h3>

        <motion.p
          className="text-foreground/60 line-clamp-1 flex-1 text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          {post.excerpt || post.content.replace(/[#*`]/g, "").substring(0, 40) + "..."}
        </motion.p>

        <motion.div
          className="text-foreground/40 mt-2 flex items-center justify-between border-t border-[color:var(--border)] pt-2 text-[10px] font-medium tracking-widest uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="bg-primary/10 text-primary flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
              <User className="h-2.5 w-2.5" />
            </div>
            <span className="truncate">{post.author.username}</span>
          </div>
          <time className="shrink-0">{formattedDate}</time>
        </motion.div>
      </div>
    </motion.article>
  );
}
