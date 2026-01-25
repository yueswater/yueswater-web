import { apiClient } from "@/services/apiClient";
import { Category } from "@/types";

export const getCategories = async (): Promise<Category[]> => {
  // 呼叫 API 取得分類列表並設定 60 秒快取
  const data = await apiClient<Category[]>("/categories/", {
    next: { revalidate: 60 },
  });

  // 確保 slug 存在
  // 若後端未回傳則使用 name 作為 slug
  return data.map((item) => ({
    ...item,
    slug: item.slug || item.name,
  }));
};
