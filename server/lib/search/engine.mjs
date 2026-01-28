import { z } from "zod";

import { tokenize, extractYear, extractPartNumberCandidates, normalizeArabic } from "./arabic.mjs";
import { cosineSimilarity } from "./similarity.mjs";
import { createOpenAiClient, embedText } from "./openai-embeddings.mjs";
import { detectBrandFromQuery } from "./brands.mjs";

const productSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name_ar: z.string(),
  part_number: z.string().optional().default(""),
  brand: z.string().optional().default(""),
  car_type: z.string().optional().default(""),
  year: z.number().int().optional().nullable(),
  section_main: z.string().optional().default(""),
  section_sub: z.string().optional().default(""),
  description: z.string().optional().default(""),
  image: z.string().optional().default("/placeholder.svg"),
  price: z.number().optional().default(0),
  stock: z.number().optional().default(0),
  compatibility: z
    .object({
      brands: z.array(z.string()).optional(),
      car_types: z.array(z.string()).optional(),
      years: z.array(z.number().int()).optional(),
      notes: z.string().optional(),
    })
    .optional()
    .default({}),
  embedding: z.array(z.number()).optional().nullable(),
});

function buildSearchText(p) {
  const parts = [
    p.name_ar,
    p.description,
    p.part_number,
    p.brand,
    p.car_type,
    p.section_main,
    p.section_sub,
    ...(p.compatibility?.brands || []),
    ...(p.compatibility?.car_types || []),
    ...(p.compatibility?.years || []).map(String),
  ];
  return parts.filter(Boolean).join(" | ");
}

function keywordScore({ queryTokens, partNumbers, queryRaw }, p) {
  let score = 0;
  const hay = normalizeArabic(buildSearchText(p));

  // Strong boost for exact/contains part number.
  for (const pn of partNumbers) {
    const pnNorm = pn.toLowerCase();
    const pPn = String(p.part_number || "").toLowerCase();
    if (!pPn) continue;
    if (pPn === pnNorm) score += 50;
    else if (pPn.includes(pnNorm) || pnNorm.includes(pPn)) score += 25;
  }

  // Token overlap
  for (const t of queryTokens) {
    if (t.length <= 1) continue;
    if (hay.includes(t)) score += 2;
  }

  // Small boost if raw contains brand and product brand matches
  if (p.brand && queryRaw.toLowerCase().includes(p.brand.toLowerCase())) score += 2;

  return score;
}

function passesFilters(p, filters) {
  if (filters.in_stock === true && !(Number(p.stock) > 0)) return false;
  if (filters.brand && String(p.brand || "").toLowerCase() !== String(filters.brand).toLowerCase()) return false;
  if (filters.car_type && String(p.car_type || "").toLowerCase() !== String(filters.car_type).toLowerCase())
    return false;
  if (filters.year && Number(p.year || 0) !== Number(filters.year)) {
    // allow match via compatibility.years
    const years = p.compatibility?.years || [];
    if (!years.includes(Number(filters.year))) return false;
  }
  if (filters.section_main && normalizeArabic(p.section_main) !== normalizeArabic(filters.section_main)) return false;
  if (filters.section_sub && normalizeArabic(p.section_sub) !== normalizeArabic(filters.section_sub)) return false;
  return true;
}

function compatibilityScore(p, { brand, year, car_type }) {
  let s = 0;
  const brands = (p.compatibility?.brands || []).map((x) => x.toLowerCase());
  const types = (p.compatibility?.car_types || []).map((x) => x.toLowerCase());
  const years = p.compatibility?.years || [];

  if (brand) {
    if (String(p.brand || "").toLowerCase() === String(brand).toLowerCase()) s += 4;
    if (brands.includes(String(brand).toLowerCase())) s += 4;
  }
  if (car_type) {
    if (String(p.car_type || "").toLowerCase() === String(car_type).toLowerCase()) s += 2;
    if (types.includes(String(car_type).toLowerCase())) s += 2;
  }
  if (year) {
    if (Number(p.year) === Number(year)) s += 2;
    if (years.includes(Number(year))) s += 2;
  }

  return s;
}

function buildAlternatives(allProducts, baseProduct, { brand, year, car_type }) {
  const sameSection = allProducts.filter(
    (p) =>
      p.id !== baseProduct.id &&
      normalizeArabic(p.section_main) === normalizeArabic(baseProduct.section_main) &&
      normalizeArabic(p.section_sub) === normalizeArabic(baseProduct.section_sub)
  );
  const ranked = sameSection
    .map((p) => ({
      p,
      s: compatibilityScore(p, { brand, year, car_type }) + (Number(p.stock) > 0 ? 1 : 0),
    }))
    .sort((a, b) => b.s - a.s);
  return ranked.slice(0, 5).map(({ p }) => ({
    id: String(p.id),
    name_ar: p.name_ar,
    part_number: p.part_number || "",
    image: p.image || "/placeholder.svg",
    price: Number(p.price) || 0,
    stock: Number(p.stock) || 0,
    brand: p.brand || "",
    car_type: p.car_type || "",
    year: p.year ?? null,
  }));
}

export async function createAiSearchEngine({ products, openAiApiKey, embeddingModel, aiEnabled }) {
  const parsedProducts = products.map((p) => productSchema.parse(p));
  const openai = createOpenAiClient(openAiApiKey);
  const hasAi = Boolean(aiEnabled && openai);

  const normalized = parsedProducts.map((p) => ({
    ...p,
    _searchText: buildSearchText(p),
    _normSearchText: normalizeArabic(buildSearchText(p)),
  }));

  async function embedQueryIfPossible(query) {
    if (!hasAi) return null;
    return await embedText({ client: openai, model: embeddingModel, input: query });
  }

  async function search({ query, page, perPage, filters }) {
    const inferredYear = extractYear(query);
    const inferredBrand = detectBrandFromQuery(query);
    const partNumbers = extractPartNumberCandidates(query);
    const queryTokens = tokenize(query);

    const effectiveFilters = {
      ...filters,
      year: filters.year ?? inferredYear ?? undefined,
      brand: filters.brand ?? inferredBrand?.brand ?? undefined,
    };

    const queryEmbedding = await embedQueryIfPossible(query);

    const scored = normalized
      .filter((p) => passesFilters(p, effectiveFilters))
      .map((p) => {
        const kw = keywordScore({ queryTokens, partNumbers, queryRaw: query }, p);
        const compat = compatibilityScore(p, {
          brand: effectiveFilters.brand,
          year: effectiveFilters.year,
          car_type: effectiveFilters.car_type,
        });
        const stockBoost = Number(p.stock) > 0 ? 1 : 0;

        let vec = 0;
        if (queryEmbedding && Array.isArray(p.embedding) && p.embedding.length === queryEmbedding.length) {
          vec = cosineSimilarity(queryEmbedding, p.embedding);
        }

        // Hybrid: keep keyword competitive for part numbers
        // Final score is tuned for e-commerce:
        // - part number exact match dominates
        // - semantic helps for descriptive Arabic queries
        const score = kw * 0.35 + vec * 30 + compat * 2 + stockBoost;

        return { p, score, vec, kw, compat };
      })
      .sort((a, b) => b.score - a.score);

    const total = scored.length;
    const start = (page - 1) * perPage;
    const items = scored.slice(start, start + perPage).map(({ p, score, vec, kw, compat }) => ({
      id: String(p.id),
      name_ar: p.name_ar,
      part_number: p.part_number || "",
      brand: p.brand || "",
      car_type: p.car_type || "",
      year: p.year ?? null,
      section_main: p.section_main || "",
      section_sub: p.section_sub || "",
      description: p.description || "",
      image: p.image || "/placeholder.svg",
      price: Number(p.price) || 0,
      stock: Number(p.stock) || 0,
      score: Number(score.toFixed(4)),
      debug: {
        vector: Number(vec.toFixed(4)),
        keyword: kw,
        compatibility: compat,
      },
      alternatives: buildAlternatives(parsedProducts, p, {
        brand: effectiveFilters.brand,
        year: effectiveFilters.year,
        car_type: effectiveFilters.car_type,
      }),
    }));

    return {
      query,
      page,
      perPage,
      total,
      inferred: {
        brand: inferredBrand?.brand || null,
        year: inferredYear,
        partNumbers,
      },
      filters: effectiveFilters,
      items,
      meta: {
        hasAi,
        embeddingModel: hasAi ? embeddingModel : null,
      },
    };
  }

  async function regenerateEmbeddingsForAllProducts({ onProgress }) {
    if (!hasAi) throw new Error("AI is disabled or OPENAI_API_KEY is missing");

    const updated = [];
    for (let i = 0; i < parsedProducts.length; i++) {
      const p = parsedProducts[i];
      const text = buildSearchText(p);
      const embedding = await embedText({ client: openai, model: embeddingModel, input: text });
      updated.push({ ...p, embedding });
      onProgress?.({ index: i + 1, total: parsedProducts.length });
    }
    return updated;
  }

  return {
    search,
    regenerateEmbeddingsForAllProducts,
    meta: { hasAi },
  };
}

