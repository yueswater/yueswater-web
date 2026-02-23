import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const siteName = "岳氏礦泉水";

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-4">隱私權政策</h1>
        <p className="text-sm opacity-60 mb-8">最後更新日期：{lastUpdated}</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">1. 關於本政策</h2>
          <p>
            歡迎造訪「{siteName}」（以下簡稱本網站）。我們非常重視您的隱私權，為了讓您能夠安心使用本網站的各項服務與資訊，特此說明本網站的隱私權保護政策，以保障您的權益。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">2. 資料收集與使用</h2>
          <p>當您造訪本網站或使用本網站所提供之功能服務時，我們將視服務功能性質，請您提供必要的個人資料：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>帳號註冊：</strong>當您註冊帳號時，我們會收集您的電子郵件地址、用戶名等資訊。</li>
            <li><strong>互動功能：</strong>當您使用留言、點讚、收藏功能時，系統會紀錄您的行為。</li>
            <li><strong>自動紀錄：</strong>當您瀏覽網頁時，伺服器會自動紀錄相關路徑，包括您使用連線設備的IP位址、使用時間、瀏覽器、瀏覽及點選資料紀錄等。</li>
          </ul>
        </section>

        <section className="mb-8 bg-base-200 p-6 rounded-2xl border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-primary">3. 廣告與 Google AdSense 說明</h2>
          <p>
            本網站使用 Google AdSense 投放廣告。Google 作為第三方供應商，會根據使用者先前造訪本網站或其他網站的紀錄，利用 Cookie 來向本網站使用者投放廣告。
          </p>
          <p className="mt-2">
            Google 使用廣告 Cookie，因此 Google 及其夥伴得根據使用者對本網站及/或其他網站的造訪紀錄，向使用者投放廣告。
          </p>
          <p className="mt-2">
            使用者可以前往{" "}
            <a 
              href="https://www.google.com/settings/ads" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              廣告設定
            </a>{" "}
            網頁，取消針對興趣投放的廣告。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">4. Cookie 之使用</h2>
          <p>
            為了提供您最佳的服務，本網站會在您的電腦中放置並取用我們的 Cookie，若您不願接受 Cookie 的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，即可拒絕 Cookie 的寫入，但可能會導至網站某些功能無法正常執行。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">5. 第三方連結</h2>
          <p>
            本網站的網頁提供其他網站的網路連結，您也可經由本網站所提供的連結，點選進入其他網站。但該連結網站不適用本網站的隱私權保護政策，您必須參考該連結網站中的隱私權保護政策。
          </p>
        </section>

        <section className="mb-8 border-t border-base-200 pt-8">
          <h2 className="text-xl font-bold mb-4">6. 政策修訂</h2>
          <p>本網站隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上。</p>
        </section>

        <div className="mt-12 text-center">
          <Link href="/" className="btn btn-primary btn-outline">
            回到首頁
          </Link>
        </div>
      </div>
    </main>
  );
}