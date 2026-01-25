import { apiClient } from "@/services/apiClient";
import { Tag } from "@/types";

export const getTags = async (): Promise<Tag[]> => {
  // 呼叫 API 取得標籤列表並設定 60 秒快取
  const data = await apiClient<Tag[]>("/tags/", {
    next: { revalidate: 60 },
  });

  // 後端 Tag Model 沒有 slug 欄位，我們用 name 來當作 slug (前端路由需要)
  return data.map((item) => ({
    ...item,
    slug: item.slug || item.name,
  }));
};
