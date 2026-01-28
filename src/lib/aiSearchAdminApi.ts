export async function adminGetConfig(token: string) {
  const res = await fetch("/api/admin/ai-search/config", {
    headers: {
      "x-admin-token": token,
    },
  });
  if (!res.ok) throw new Error("UNAUTHORIZED_OR_FAILED");
  return (await res.json()) as {
    aiSearchEnabled: boolean;
    dataSource: string;
    embeddingModel: string;
    aiEnabledEnv: boolean;
  };
}

export async function adminToggle(token: string, enabled: boolean) {
  const res = await fetch("/api/admin/ai-search/toggle", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-token": token,
    },
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) throw new Error("UNAUTHORIZED_OR_FAILED");
  return (await res.json()) as { ok: true; aiSearchEnabled: boolean };
}

export async function adminRegenerateEmbeddings(token: string) {
  const res = await fetch("/api/admin/ai-search/regenerate-embeddings", {
    method: "POST",
    headers: {
      "x-admin-token": token,
    },
  });
  if (!res.ok) throw new Error("UNAUTHORIZED_OR_FAILED");
  return (await res.json()) as { ok: true; updatedCount: number };
}

export async function adminAnalytics(token: string, days: number) {
  const res = await fetch(`/api/admin/ai-search/analytics?days=${encodeURIComponent(String(days))}`, {
    headers: {
      "x-admin-token": token,
    },
  });
  if (!res.ok) throw new Error("UNAUTHORIZED_OR_FAILED");
  return (await res.json()) as {
    days: number;
    totals: { searches: number; noResults: number; withAi: number; avgTookMs: number | null };
    topQueries: { query: string; count: number }[];
  };
}

