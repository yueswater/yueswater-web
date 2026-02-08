"use client";

import React, { useState, useEffect } from "react";
import { Play, FileText, Loader2, Download } from "lucide-react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

import "prismjs/components/prism-latex";
import "prismjs/themes/prism-tomorrow.css";

export function LatexEditor({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [lang, setLang] = useState("zh");
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getBaseUrl = () => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    return rawUrl.endsWith("/api") ? rawUrl.slice(0, -4) : rawUrl;
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setError(null);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    try {
      const response = await fetch(`${getBaseUrl()}/api/posts/compile_latex/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, lang }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.log || "編譯失敗");
      }

      const blob = await response.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "latex-document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm text-left w-full">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-muted-foreground tracking-widest">LaTeX 編輯區</span>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="text-[10px] bg-background border border-border rounded px-1 py-0.5 focus:outline-none"
          >
            <option value="zh">繁體中文 (圖/表)</option>
            <option value="en">English (Figure/Table)</option>
          </select>
        </div>
        <div className="flex gap-2">
          {pdfUrl && (
            <button 
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-muted transition-colors text-foreground"
            >
              <Download className="h-3 w-3" />
              Download
            </button>
          )}
          <button 
            onClick={handleCompile} 
            disabled={isCompiling}
            className="flex items-center gap-1.5 rounded bg-foreground px-3 py-1 text-xs font-medium text-background disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isCompiling ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-current" />}
            Compile
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 divide-x divide-border">
        <div className="min-h-[600px] max-h-[800px] overflow-auto bg-[#2d2d2d] text-[#ccc]">
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => Prism.highlight(code, Prism.languages.latex, "latex")}
            padding={20}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              minHeight: "100%",
              color: "#ccc",
            }}
            className="focus:outline-none"
          />
        </div>
        <div className="relative flex min-h-[600px] flex-col bg-[#525659]">
          {pdfUrl ? (
            <iframe 
              src={`${pdfUrl}#toolbar=0&view=FitH`} 
              className="h-full w-full border-none bg-white" 
            />
          ) : (
            <div className="m-auto text-center opacity-30 text-white">
              <FileText className="h-16 w-16 mx-auto mb-2" />
              <p className="text-xs italic font-serif">Click compile to render via Server XeLaTeX</p>
            </div>
          )}
          {isCompiling && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
          {error && <div className="absolute inset-0 z-30 bg-background/95 p-4 text-xs text-red-500 overflow-auto whitespace-pre-wrap font-mono">{error}</div>}
        </div>
      </div>
    </div>
  );
}