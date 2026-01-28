export interface AiSearchSettings {
  enabled: boolean;
  embedding_model?: string | null;
  vector_store?: string | null;
}

export interface AiSearchAnalyticsRow {
  query?: string;
  brand?: string;
  searches: number;
  no_results?: number;
  avg_results?: number;
  avg_score?: number;
}

export interface AiSearchAnalytics {
  top_queries: AiSearchAnalyticsRow[];
  popular_brands: AiSearchAnalyticsRow[];
  no_results: AiSearchAnalyticsRow[];
}

const apiBase = import.meta.env.VITE_AI_SEARCH_API_BASE ?? "";
const useMock = (import.meta.env.VITE_AI_SEARCH_MOCK ?? "true") === "true";

let mockSettings: AiSearchSettings = {
  enabled: true,
  embedding_model: "text-embedding-3-small",
  vector_store: "database",
};

const mockAnalytics: AiSearchAnalytics = {
  top_queries: [
    { query: "ماء رديتر ميتسوبيشي", searches: 48, no_results: 2, avg_results: 6.2, avg_score: 0.84 },
    { query: "فرامل تويوتا 2010", searches: 32, no_results: 1, avg_results: 4.3, avg_score: 0.81 },
    { query: "فلتر زيت النترا", searches: 26, no_results: 0, avg_results: 5.1, avg_score: 0.88 },
  ],
  popular_brands: [
    { brand: "Mitsubishi", searches: 51 },
    { brand: "Toyota", searches: 44 },
    { brand: "Hyundai", searches: 38 },
  ],
  no_results: [
    { query: "قطعة جير نيسان 2005", searches: 6 },
    { query: "رديتر صيني 1999", searches: 4 },
  ],
};

export async function getAiSearchSettings(): Promise<AiSearchSettings> {
  if (useMock || !apiBase) {
    return mockSettings;
  }
  return requestJson(`${apiBase}/api/ai-search/settings`, { method: "GET" });
}

export async function updateAiSearchSettings(
  settings: AiSearchSettings
): Promise<AiSearchSettings> {
  if (useMock || !apiBase) {
    mockSettings = { ...mockSettings, ...settings };
    return mockSettings;
  }
  const response = await requestJson(`${apiBase}/api/ai-search/settings`, {
    method: "PUT",
    body: JSON.stringify(settings),
  });
  return response.settings ?? response;
}

export async function triggerEmbeddingRebuild(): Promise<{ status: string }> {
  if (useMock || !apiBase) {
    return { status: "queued" };
  }
  return requestJson(`${apiBase}/api/ai-search/rebuild`, { method: "POST" });
}

export async function getAiSearchAnalytics(): Promise<AiSearchAnalytics> {
  if (useMock || !apiBase) {
    return mockAnalytics;
  }
  return requestJson(`${apiBase}/api/ai-search/analytics`, { method: "GET" });
}

async function requestJson(url: string, options: RequestInit) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
