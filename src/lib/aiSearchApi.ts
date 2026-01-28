import type { AiSearchFilters, AiSearchResponse } from "@/lib/aiSearchTypes";

export async function aiSearch(params: {
  query: string;
  page?: number;
  perPage?: number;
  filters?: AiSearchFilters;
}): Promise<AiSearchResponse> {
  const res = await fetch("/api/ai-search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: params.query,
      page: params.page ?? 1,
      perPage: params.perPage ?? 12,
      filters: params.filters ?? {},
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`AI_SEARCH_FAILED (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as AiSearchResponse;
}

