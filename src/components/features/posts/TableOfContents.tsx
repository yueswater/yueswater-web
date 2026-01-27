"use client";

import { useEffect, useState, useRef } from "react";
import { List, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReadingProgressCircle } from "./ReadingProgressCircle";

interface TableOfContentsProps {
  content: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

type Quadrant = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [quadrant, setQuadrant] = useState<Quadrant>("bottom-right");
  
  const constraintsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentElement = document.getElementById("post-content");
    if (!contentElement) return;
    const elements = Array.from(contentElement.querySelectorAll("h2, h3"));
    const extracted: Heading[] = elements.map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: Number(el.tagName.replace("H", "")),
    }));
    setHeadings(extracted);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const element = document.getElementById(heading.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(heading.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleDragEnd = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const isTop = rect.top + rect.height / 2 < centerY;
    const isLeft = rect.left + rect.width / 2 < centerX;

    if (isTop && isLeft) setQuadrant("top-left");
    else if (isTop && !isLeft) setQuadrant("top-right");
    else if (!isTop && isLeft) setQuadrant("bottom-left");
    else setQuadrant("bottom-right");
  };

  const getMenuStyles = () => {
    switch (quadrant) {
      case "top-left": return "top-20 left-0 origin-top-left";
      case "top-right": return "top-20 right-0 origin-top-right";
      case "bottom-left": return "bottom-20 left-0 origin-bottom-left";
      case "bottom-right": return "bottom-20 right-0 origin-bottom-right";
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      <nav className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-auto lg:p-4">
        <div className="text-foreground mb-4 flex items-center gap-2 font-bold">
          <List className="text-primary h-5 w-5" />
          <span>目錄導覽</span>
        </div>
        <ul className="space-y-2 text-sm">
          {headings.map((heading, index) => (
            <li key={`${heading.id}-${index}`} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(heading.id);
                }}
                className={`block rounded-r-md border-l-2 px-3 py-1.5 transition-all duration-200 ${
                  activeId === heading.id
                    ? "bg-primary/10 text-primary border-primary translate-x-1 font-medium"
                    : "text-foreground/60 hover:text-primary hover:bg-primary/5 border-transparent"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={constraintsRef} className="pointer-events-none fixed inset-6 z-50 lg:hidden">
        <motion.div
          ref={buttonRef}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          className="pointer-events-auto absolute bottom-20 right-0"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`absolute bg-base-100 border-base-content/10 max-h-[50vh] w-64 overflow-y-auto rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${getMenuStyles()}`}
              >
                <div className="mb-3 flex items-center justify-between border-b border-base-content/5 pb-2">
                  <span className="text-sm font-black uppercase tracking-widest text-base-content/50">目錄</span>
                  <button onClick={() => setIsOpen(false)}><X className="h-4 w-4" /></button>
                </div>
                <ul className="space-y-1">
                  {headings.map((heading, index) => (
                    <li key={`mob-${heading.id}-${index}`} style={{ paddingLeft: `${(heading.level - 2) * 8}px` }}>
                      <button
                        onClick={() => {
                          document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                          setActiveId(heading.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeId === heading.id ? "bg-primary text-primary-content font-bold" : "text-base-content/70"
                        }`}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex h-14 w-14 items-center justify-center">
            <ReadingProgressCircle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="bg-primary text-primary-content relative z-10 flex h-full w-full items-center justify-center rounded-full shadow-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}