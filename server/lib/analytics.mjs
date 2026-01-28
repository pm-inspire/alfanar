import fs from "fs";
import path from "path";

const ANALYTICS_PATH = path.resolve(process.cwd(), "server/storage/analytics.jsonl");

function nowIso() {
  return new Date().toISOString();
}

function safeWriteLine(line) {
  const dir = path.dirname(ANALYTICS_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(ANALYTICS_PATH, line + "\n", "utf8");
}

export const analytics = {
  track(evt) {
    try {
      safeWriteLine(
        JSON.stringify({
          ts: nowIso(),
          query: evt.query,
          filters: evt.filters || {},
          resultsCount: evt.resultsCount ?? null,
          tookMs: evt.tookMs ?? null,
          hasAi: Boolean(evt.hasAi),
        })
      );
    } catch {
      // ignore
    }
  },

  report({ days }) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const top = new Map();
    let total = 0;
    let noResults = 0;
    let withAi = 0;
    let tookMsSum = 0;
    let tookMsCount = 0;

    try {
      const raw = fs.readFileSync(ANALYTICS_PATH, "utf8");
      const lines = raw.split("\n").filter(Boolean);
      for (const line of lines) {
        const evt = JSON.parse(line);
        const ts = Date.parse(evt.ts);
        if (!Number.isFinite(ts) || ts < cutoff) continue;

        total += 1;
        if ((evt.resultsCount ?? 0) === 0) noResults += 1;
        if (evt.hasAi) withAi += 1;
        if (Number.isFinite(evt.tookMs)) {
          tookMsSum += evt.tookMs;
          tookMsCount += 1;
        }

        const q = String(evt.query || "").trim();
        if (!q) continue;
        top.set(q, (top.get(q) || 0) + 1);
      }
    } catch {
      // ignore
    }

    const topQueries = [...top.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([query, count]) => ({ query, count }));

    return {
      days,
      totals: {
        searches: total,
        noResults,
        withAi,
        avgTookMs: tookMsCount ? Math.round(tookMsSum / tookMsCount) : null,
      },
      topQueries,
    };
  },
};

