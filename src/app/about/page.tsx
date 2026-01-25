import { ArticleBody } from "@/components/features/posts/ArticleBody";
import { TableOfContents } from "@/components/features/posts/TableOfContents";
import Image from "next/image";

const ABOUT_MARKDOWN = `
> 「技術應如礦泉水般純粹。」

我是阿岳，一名穿梭在 Python 後端與 React 前端之間的開發者。比起盲目追求新技術，我更著迷於如何構建穩定、可擴展的系統架構，並將邏輯思維帶入軟體工程中。

程式碼不只是實現功能的工具，更是一種表達邏輯的藝術。在這個資訊爆炸的時代，我致力於提供如礦泉水般透明、純粹且易於吸收的技術見解。

## 技術雷達

我目前的技術選型以實用主義為核心，確保每一項工具都能在效能與開發效率之間取得最佳平衡。

### 核心採用 (Adopt)
* **後端開發**: Django / Django REST Framework (DRF)
* **前端工藝**: Next.js (App Router) / TypeScript / Tailwind CSS
* **基礎設施**: Cloudinary (雲端媒體儲存) / Docker / PostgreSQL

### 評估中 (Trial)
* **FastAPI**: 用於處理高併發的異步微服務。
* **React Easy Crop**: 用於前端圖片裁剪與預覽優化。
* **Motion (Framer Motion)**: 建立更流暢的使用者介面轉場。

### 持續觀測 (Assess)
* **Rust**: 探索系統底層效能優化的可能性。
* **HTMX**: 評估在輕量級交互專案中替代複雜前端框架的潛力。

## 技術執著

### 介面哲學
我堅持極簡主義的視覺風格。在我的專案中，你會發現大量的純色塊與邊框運用，我傾向於移除所有不必要的陰影 (Shadow-none)，利用色差與線條來建立層次感。

### 跨領域邏輯
我熱衷於將經濟學模型轉化為演算法模擬。我認為軟體開發中的狀態管理與經濟體系的運作原理有著高度的相似性。

### 安全與架構
從 JWT 認證流程到 SMTP 郵件驗證系統，我對系統安全性與使用者流程的嚴謹度有著近乎苛求的堅持。


## 聯絡方式

如果你有技術合作、專案開發需求，或者單純想討論技術架構，歡迎透過以下方式與我聯繫：

* **官方網站**: [yueswater.com](https://www.yueswater.com)
* **電子郵件**: [sungpunyue@gmail.com](mailto:sungpunyue@gmail.com)
`;

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <main className="lg:col-span-8">
          <div className="mb-8 border-b border-[color:var(--border)] pb-8">
            <h1 className="text-foreground mb-4 text-4xl font-bold">關於岳氏礦泉水</h1>
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
