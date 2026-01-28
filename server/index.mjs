import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";

import { loadConfig, saveConfig } from "./lib/config.mjs";
import { loadProductsFromSampleFile, saveProductsToSampleFile } from "./lib/products-sample.mjs";
import { createAiSearchEngine } from "./lib/search/engine.mjs";
import { requireAdmin } from "./lib/admin-auth.mjs";
import { analytics } from "./lib/analytics.mjs";

dotenv.config();

const PORT = Number(process.env.AI_SEARCH_PORT || 8787);

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const aiSearchRequestSchema = z.object({
  query: z.string().trim().min(1).max(400),
  page: z.number().int().min(1).optional().default(1),
  perPage: z.number().int().min(1).max(48).optional().default(12),
  filters: z
    .object({
      brand: z.string().trim().min(1).max(64).optional(),
      car_type: z.string().trim().min(1).max(64).optional(),
      year: z.number().int().min(1950).max(2100).optional(),
      section_main: z.string().trim().min(1).max(64).optional(),
      section_sub: z.string().trim().min(1).max(64).optional(),
      in_stock: z.boolean().optional(),
    })
    .optional()
    .default({}),
});

let config = loadConfig();

let products = await loadProductsFromSampleFile();
let engine = await createAiSearchEngine({
  products,
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  aiEnabled: String(process.env.AI_SEARCH_ENABLED || "true").toLowerCase() === "true",
});

async function reloadEngine() {
  products = await loadProductsFromSampleFile();
  engine = await createAiSearchEngine({
    products,
    openAiApiKey: process.env.OPENAI_API_KEY || "",
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    aiEnabled:
      (String(process.env.AI_SEARCH_ENABLED || "true").toLowerCase() === "true") &&
      Boolean(config.aiSearchEnabled),
  });
}

app.post("/api/ai-search", async (req, res) => {
  const parsed = aiSearchRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "INVALID_REQUEST",
      details: parsed.error.flatten(),
    });
  }

  const { query, page, perPage, filters } = parsed.data;

  try {
    const startedAt = Date.now();
    const result = await engine.search({
      query,
      page,
      perPage,
      filters,
    });
    const tookMs = Date.now() - startedAt;

    analytics.track({
      query,
      filters,
      resultsCount: result.total,
      tookMs,
      hasAi: result.meta.hasAi,
    });

    return res.json(result);
  } catch (e) {
    console.error("ai-search error", e);
    return res.status(500).json({ error: "SEARCH_FAILED" });
  }
});

// ---------------- Admin endpoints (token protected) ----------------

app.get("/api/admin/ai-search/config", requireAdmin, async (_req, res) => {
  config = loadConfig();
  res.json({
    aiSearchEnabled: config.aiSearchEnabled,
    dataSource: "sample_file",
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    aiEnabledEnv: String(process.env.AI_SEARCH_ENABLED || "true").toLowerCase() === "true",
  });
});

app.post("/api/admin/ai-search/toggle", requireAdmin, async (req, res) => {
  const body = z.object({ enabled: z.boolean() }).safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "INVALID_REQUEST" });

  config.aiSearchEnabled = body.data.enabled;
  saveConfig(config);
  await reloadEngine();

  return res.json({ ok: true, aiSearchEnabled: config.aiSearchEnabled });
});

app.post("/api/admin/ai-search/regenerate-embeddings", requireAdmin, async (_req, res) => {
  // For this repo demo: regenerate embeddings for the sample JSON file.
  // Production: move this to a queue/job system and generate from DB.
  try {
    const updated = await engine.regenerateEmbeddingsForAllProducts({
      onProgress: () => {},
    });
    await saveProductsToSampleFile(updated);
    await reloadEngine();
    return res.json({ ok: true, updatedCount: updated.length });
  } catch (e) {
    console.error("regenerate embeddings error", e);
    return res.status(500).json({ error: "REGENERATE_FAILED" });
  }
});

app.get("/api/admin/ai-search/analytics", requireAdmin, async (req, res) => {
  const days = Number(req.query.days || 7);
  const safeDays = Number.isFinite(days) ? Math.max(1, Math.min(90, days)) : 7;
  res.json(analytics.report({ days: safeDays }));
});

app.listen(PORT, () => {
  console.log(`[ai-search] API listening on http://localhost:${PORT}`);
});

