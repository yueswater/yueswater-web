import { apiClient } from "./apiClient";

export const newsletterService = {
  subscribe: async (email: string, nickname?: string) => {
    return apiClient("/newsletter/subscribe/", {
      method: "POST",
      body: JSON.stringify({ email, nickname }),
    });
  },
};
