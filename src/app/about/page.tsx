import { ArticleBody } from "@/components/features/posts/ArticleBody";
import { TableOfContents } from "@/components/features/posts/TableOfContents";
import Image from "next/image";

const ABOUT_MARKDOWN = `
## 關於岳氏礦泉水

大家好，我是 **岳氏礦泉水**。這是一個專注於全端開發技術分享的部落格。

我熱愛研究各種技術，包含：
* **Python / Django / FastAPI**
* **React / Next.js**
* **Flutter**
* **經濟學模型模擬**

## 我的技術堆疊

### Backend
我主要使用 Python 生態系。對於快速開發 API，我首選 **FastAPI**；如果是大型專案，我會使用 **Django**。

\`\`\`python
def hello_world():
    print("Hello from Yueswater!")
\`\`\`

### Frontend
目前全面轉向 **Next.js (App Router)**，搭配 TypeScript 與 Tailwind CSS，這能帶給我最好的開發體驗。

## 專案經歷

### 1. 岳氏礦泉水部落格
就是你現在看到的網站！使用 Next.js 14 + Django DRF 建構。

### 2. 經濟學模型模擬
透過 Python 建立供需模型，並試圖解決資訊不對稱的問題。

## 聯絡我
如果你有任何合作機會，歡迎透過 [Email](mailto:test@example.com) 聯繫我。
`;

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <main className="lg:col-span-8">
          <div className="mb-8 border-b border-[color:var(--border)] pb-8">
            <h1 className="text-foreground mb-4 text-4xl font-bold">關於我</h1>
            <div className="text-foreground/60 flex items-center gap-4">
              <span>最後更新：2026-01-12</span>
              <span>•</span>
              <span>台北，台灣</span>
            </div>
          </div>

          <div id="post-content">
            <ArticleBody content={ABOUT_MARKDOWN} />
          </div>
        </main>

        <aside className="hidden lg:col-span-4 lg:block">
          <TableOfContents content={ABOUT_MARKDOWN} />
        </aside>
      </div>
    </div>
  );
}
