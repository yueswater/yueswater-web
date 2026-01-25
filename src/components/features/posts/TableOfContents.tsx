"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TableOfContentsProps {
  content: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-auto p-4">
      <div className="text-foreground mb-4 flex items-center gap-2 font-bold">
        <List className="text-primary h-5 w-5" />
        <span>目錄導覽</span>
      </div>
      <ul className="space-y-2 text-sm">
        {headings.map((heading, index) => (
          <li
            key={`${heading.id}-${index}`}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
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
                  : "text-foreground/60 hover:text-primary hover:bg-primary/5 hover:border-primary/50 border-transparent"
              } `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
