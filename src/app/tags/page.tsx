import React from "react";
import { TagCloud } from "@/components/features/tags/TagCloud";
import { TagListTable } from "@/components/features/tags/TagListTable";
import { getTags } from "@/services/tagService";

export const metadata = {
  title: "標籤總覽 | 岳氏礦泉水",
  description: "透過標籤探索更多相關文章。",
};

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <main className="container mx-auto min-h-screen px-4 py-12 md:py-20 flex flex-col">
      <div className="mb-12 text-center md:text-left shrink-0">
        <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
          全部標籤
          <span className="text-secondary ml-2 align-top text-2xl md:text-3xl">#</span>
        </h1>
        <p className="text-base-content/60 max-w-2xl text-lg">
          標籤是文章的靈魂碎片。透過這些關鍵字，你可以更精準地找到感興趣的技術細節或主題。
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:h-[calc(100vh-350px)] lg:min-h-[500px]">
        <section className="h-[400px] w-full lg:h-full lg:w-[65%] shrink-0 lg:shrink">
          <div className="bg-base-100 group relative h-full overflow-hidden rounded-3xl p-1 border border-base-content/5">
            <div className="bg-secondary/5 pointer-events-none absolute top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
            <div className="bg-primary/5 pointer-events-none absolute right-0 bottom-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />
            <TagCloud tags={tags} />
          </div>
        </section>

        <section className="h-[500px] w-full lg:h-full lg:w-[35%]">
          <TagListTable tags={tags} />
        </section>
      </div>
    </main>
  );
}