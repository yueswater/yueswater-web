"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CodeBlock } from "@/components/markdown/CodeBlock";

import "highlight.js/styles/nord.css";
import "katex/dist/katex.min.css";

interface EditorPreviewProps {
  content: string;
}

export function EditorPreview({ content }: EditorPreviewProps) {
  const processedContent = content ? content.replace(
    /(@fig-[\w-]+)/g,
    (match) => match.replace("@", "#")
  ) : "";

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
    pre: ({ children, ...props }: any) => (
      <motion.div variants={itemVariants}>
        <CodeBlock {...props}>{children}</CodeBlock>
      </motion.div>
    ),
    table: ({ children }: any) => <motion.table variants={itemVariants}>{children}</motion.table>,
    img: ({ src, alt, width, height, id, style, ...props }: any) => (
      <motion.figure
        id={id}
        variants={itemVariants}
        className="my-8 flex w-full flex-col items-center justify-center [counter-increment:image-counter] scroll-mt-24 transition-all duration-500 target:ring-4 target:ring-primary/50 target:rounded-xl p-2"
      >
        <img
          src={src}
          alt={alt || ""}
          width={width}
          height={height}
          style={{ ...style, border: "none", boxShadow: "none", outline: "none" }}
          className="h-auto max-w-full"
          {...props}
        />
        {alt && (
          <figcaption className="text-foreground/40 mt-3 w-full text-center text-sm not-italic before:font-bold before:content-['圖_'counter(image-counter)'：']">
            {alt}
          </figcaption>
        )}
      </motion.figure>
    ),
  };

  return (
    <article
      className="prose prose-lg dark:prose-invert w-full max-none [counter-reset:image-counter]"
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
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          rehypeHighlight,
          [rehypeKatex, { output: "html", displayMode: true }],
        ]}
        components={components}
      >
        {processedContent || "*預覽內容將顯示於此...*"}
      </ReactMarkdown>
    </article>
  );
}