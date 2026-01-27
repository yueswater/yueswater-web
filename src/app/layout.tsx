import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/features/theme/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-noto-sans",
  display: "swap",
});

const genJyuuGothic = localFont({
  src: [
    {
      path: "../../public/fonts/GenJyuuGothic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenJyuuGothic-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenJyuuGothic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gen-jyuu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "岳氏礦泉水",
  description: "全端開發技術與生活分享",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="zh-TW" 
      className={`${notoSansTC.variable} ${genJyuuGothic.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground font-sans flex min-h-screen flex-col pt-16 antialiased"
      >
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}