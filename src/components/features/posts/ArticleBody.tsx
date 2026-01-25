"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Image from "next/image";

import { CodeBlock } from "@/components/markdown/CodeBlock";

import "highlight.js/styles/nord.css";
import "katex/dist/katex.min.css";

interface ArticleBodyProps {
  content: string;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const components = {
    h2: ({ node, ...props }: any) => <motion.h2 variants={itemVariants} {...props} />,
    h3: ({ node, ...props }: any) => <motion.h3 variants={itemVariants} {...props} />,

    p: ({ children }: any) => <motion.p variants={itemVariants}>{children}</motion.p>,
    ul: ({ children }: any) => <motion.ul variants={itemVariants}>{children}</motion.ul>,
    ol: ({ children }: any) => <motion.ol variants={itemVariants}>{children}</motion.ol>,
    blockquote: ({ children }: any) => (
      <motion.blockquote variants={itemVariants}>{children}</motion.blockquote>
    ),

    img: ({ node, src, alt, ...props }: any) => (
      <motion.figure
        variants={itemVariants}
        className="my-8 flex w-full flex-col items-center justify-center"
      >
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={600}
          className="h-auto max-w-full rounded-lg border border-(--border) shadow-sm"
          {...props}
        />
        {alt && (
          <figcaption className="text-base-content/70 mt-3 w-full text-center text-sm not-italic">
            {alt}
          </figcaption>
        )}
      </motion.figure>
    ),

    pre: ({ children, ...props }: any) => (
      <motion.div variants={itemVariants} className="w-full">
        <CodeBlock {...props}>{children}</CodeBlock>
      </motion.div>
    ),

    table: ({ children }: any) => <motion.table variants={itemVariants}>{children}</motion.table>,
  };

  return (
    <div className="flex w-full justify-center">
      <motion.article
        className="prose prose-lg text-base-content w-full max-w-3xl"
        style={
          {
            "--tw-prose-body": "currentColor",
            "--tw-prose-headings": "currentColor",
            "--tw-prose-lead": "currentColor",
            "--tw-prose-links": "oklch(var(--p))",
            "--tw-prose-bold": "currentColor",
            "--tw-prose-counters": "currentColor",
            "--tw-prose-bullets": "currentColor",
            "--tw-prose-hr": "currentColor",
            "--tw-prose-quotes": "currentColor",
            "--tw-prose-quote-borders": "oklch(var(--p))",
            "--tw-prose-captions": "currentColor",
            "--tw-prose-code": "oklch(var(--p))",
            "--tw-prose-pre-code": "currentColor",
            "--tw-prose-pre-bg": "#2e3440",
            "--tw-prose-th-borders": "currentColor",
            "--tw-prose-td-borders": "currentColor",
          } as React.CSSProperties
        }
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[
            rehypeSlug,
            rehypeHighlight,
            [rehypeKatex, { output: "html", displayMode: true }],
          ]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </motion.article>
    </div>
  );
}
