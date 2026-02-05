"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CodeBlock } from "@/components/markdown/CodeBlock";
import { Info, HelpCircle, AlertTriangle, Lightbulb, Skull, FlaskConical } from "lucide-react";

import "highlight.js/styles/nord.css";
import "katex/dist/katex.min.css";

interface ArticleBodyProps {
  content: string;
}

function admonitionPlugin() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        data.hName = node.name;
        data.hProperties = {
          title: node.attributes?.title || ""
        };
      }
    });
  };
}

export function ArticleBody({ content }: ArticleBodyProps) {
  const processedContent = content 
    ? content
        .replace(/(@fig-[\w-]+)/g, (match) => match.replace("@", "#"))
        .replace(/([\u4e00-\u9fa5])(`)/g, "$1 $2")
        .replace(/(`)([\u4e00-\u9fa5])/g, "$1 $2")
    : "";

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

  const Admonition = ({ children, title, color, icon: Icon, label }: any) => (
    <div 
      className="my-6 rounded-r-lg border-l-4 p-4 border-solid text-left"
      style={{ backgroundColor: `${color}10`, borderColor: color }}
    >
      <div className="flex items-center gap-2 mb-2 font-bold text-sm tracking-widest uppercase" style={{ color: color }}>
        <Icon className="h-4 w-4" /> {title || label}
      </div>
      <div className="text-foreground/80">{children}</div>
    </div>
  );

  const components = {
    h2: ({ node, ...props }: any) => <motion.h2 variants={itemVariants} {...props} />,
    h3: ({ node, ...props }: any) => <motion.h3 variants={itemVariants} {...props} />,
    p: ({ children }: any) => <motion.p variants={itemVariants}>{children}</motion.p>,
    ul: ({ children }: any) => <motion.ul variants={itemVariants}>{children}</motion.ul>,
    ol: ({ children }: any) => <motion.ol variants={itemVariants}>{children}</motion.ol>,
    blockquote: ({ children }: any) => (
      <motion.blockquote variants={itemVariants}>{children}</motion.blockquote>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm font-bold text-primary"
            {...props}
          >
            {children}
          </code>
        );
      }
      return <code className={className} {...props}>{children}</code>;
    },
    pre: ({ children, ...props }: any) => (
      <motion.div variants={itemVariants} className="w-full">
        <CodeBlock {...props}>{children}</CodeBlock>
      </motion.div>
    ),
    table: ({ children }: any) => <motion.table variants={itemVariants}>{children}</motion.table>,
    img: ({ src, alt, width, height, id, style, ...props }: any) => (
      <motion.figure
        id={id}
        variants={itemVariants}
        className="my-8 flex w-full flex-col items-center justify-center [counter-increment:image-counter] scroll-mt-24"
      >
        <img
          src={src}
          alt={alt || ""}
          width={width}
          height={height}
          style={{ ...style, border: "none", boxShadow: "none", outline: "none" }}
          className="h-auto max-w-full transition-all duration-500 target:ring-4 target:ring-primary/50 target:rounded-xl p-2"
          {...props}
        />
        {alt && (
          <figcaption className="text-base-content/70 mt-3 w-full text-center text-sm not-italic before:font-bold before:content-['圖_'counter(image-counter)'：']">
            {alt}
          </figcaption>
        )}
      </motion.figure>
    ),
    note: (props: any) => <Admonition {...props} color="#448aff" icon={Info} label="NOTE" />,
    info: (props: any) => <Admonition {...props} color="#06b8d4" icon={Info} label="INFO" />,
    tip: (props: any) => <Admonition {...props} color="#01bfa5" icon={Lightbulb} label="TIP" />,
    question: (props: any) => <Admonition {...props} color="#64dd17" icon={HelpCircle} label="QUESTION" />,
    warning: (props: any) => <Admonition {...props} color="#ff9101" icon={AlertTriangle} label="WARNING" />,
    danger: (props: any) => <Admonition {...props} color="#ff1844" icon={Skull} label="DANGER" />,
    example: (props: any) => <Admonition {...props} color="#7d4dff" icon={FlaskConical} label="EXAMPLE" />,
  };

  return (
    <div className="flex w-full justify-center">
      <motion.article
        className="prose prose-lg text-base-content w-full max-w-3xl [counter-reset:image-counter] prose-code:before:content-none prose-code:after:content-none"
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
            "--tw-prose-quote-borders": "transparent",
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
          remarkPlugins={[remarkGfm, remarkMath, remarkDirective, admonitionPlugin]}
          rehypePlugins={[
            rehypeRaw,
            rehypeSlug,
            rehypeHighlight,
            [rehypeKatex, { output: "html", displayMode: true }],
          ]}
          components={components as any}
        >
          {processedContent}
        </ReactMarkdown>
      </motion.article>
    </div>
  );
}