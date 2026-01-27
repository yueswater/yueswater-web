# 岳氏礦泉水的部落格前端

這是[岳氏礦泉水](https://www.yueswater.com/)的視覺呈現與內容編輯介面，基於 **Next.js 15** 與 **Tailwind CSS** 構建。前端實作了具有即時預覽功能的 Markdown 編輯器，並整合了複雜的圖片處理與交互參照邏輯。

## 技術組合

* **Next.js 15 (App Router)**：利用伺服器端渲染 (SSR) 提升 SEO 效果，並結合客戶端組件處理互動邏輯。
* **Tailwind CSS**：配合 **Typography (prose)** 插件進行文章樣式排版，確保 Markdown 內容具備專業的視覺層次。
* **Framer Motion**：為文章進入與編輯器切換提供流暢的過場動畫。
* **React Markdown**：支援標準 GFM、數學公式 (Katex) 及原生 HTML 渲染。
* **Lucide React**：提供編輯器工具列與 UI 介面的圖示支援。

## 專案結構

本專案將核心邏輯封裝於具備高度重用性的組件中：

* `app/admin/write`：核心編輯頁面，整合了自動儲存與快捷鍵功能。
* `components/features/posts`：包含文章主體渲染 (ArticleBody)、目錄導覽 (TableOfContents) 及互動區。
* `context`：管理全域狀態，包括身份驗證 (AuthContext) 與通知系統 (ToastContext)。
* `services`：封裝與後端 API 通訊的異步邏輯。
* `utils`：提供圖片縮放 (imageHelpers) 與 URL 處理等工具函式。

## 核心編輯器功能

### 智慧圖片處理與交互參照

編輯器整合了自定義的圖片上傳模組。上傳時可調整比例，系統會自動抓取原始尺寸並計算目標寬高，最後以 HTML `<img>` 格式插入文章。 透過為每張圖片生成唯一的 `id`，使用者可利用 `[文字](@fig-xxxx)` 語法實作文章內的交互參照跳轉。

### 自動編號與渲染邏輯

渲染引擎內建 CSS 計數器，能自動為文章中的圖片添加「圖 1」、「圖 2」等前綴。 為了確保跨平台顯示一致，透過 `rehype-raw` 解析原生 HTML，並強制移除圖片的所有預設外框與陰影，回歸純粹的內容呈現。

### 寫作保護機制

為防止內容遺失，編輯器具備以下機制：

* **自動儲存**：每 30 秒自動向後端提交當前內容快照。
* **快捷鍵支援**：支援 `Ctrl+S` (或 `Cmd+S`) 手動觸發草稿儲存。
* **狀態回復**：透過 JWT 刷新機制，確保編輯過程中的網路請求不因過期而失敗。

## 環境設定

請於 `.env.local` 配置以下參數：

* `NEXT_PUBLIC_API_URL`：指向後端 Django API 的網址。
* `SERVER_API_URL`：(選填) 用於伺服器端請求的內部網址。

## 快速啟動

```bash
npm install
npm run dev
```