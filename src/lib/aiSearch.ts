import { autoParts, brandLabels, type AutoPart } from "@/data/autoParts";

export interface AiSearchQuery {
  query: string;
  brand?: string;
  car_type?: string;
  year?: number;
  section_main?: string;
  section_sub?: string;
  page?: number;
  per_page?: number;
}

export interface AiSearchResult extends AutoPart {
  score: number;
  compatibility_match?: boolean;
}

export interface AiSearchSuggestion {
  id: string;
  label: string;
  type: "part" | "brand" | "car" | "section" | "partNumber";
}

export interface AiSearchResponse {
  query: string;
  corrected_query?: string | null;
  intent?: Record<string, string | number | null>;
  filters?: Record<string, string | number | null>;
  use_ai?: boolean;
  page?: number;
  per_page?: number;
  total: number;
  results: AiSearchResult[];
  alternatives: AiSearchResult[];
  suggestions: AiSearchSuggestion[];
}

const apiBase = import.meta.env.VITE_AI_SEARCH_API_BASE ?? "";
const useMock = (import.meta.env.VITE_AI_SEARCH_MOCK ?? "true") === "true";

const brandAliases: Record<string, string> = {
  "ميتسوبيشي": "Mitsubishi",
  "متسوبيشي": "Mitsubishi",
  "تويوتا": "Toyota",
  "تيوتا": "Toyota",
  "هيونداي": "Hyundai",
  "هيونداى": "Hyundai",
  "كيا": "Kia",
  "نيسان": "Nissan",
  "مازدا": "Mazda",
  "هوندا": "Honda",
  "شانجان": "Changan",
  "جيلي": "Geely",
};

const sectionAliases: Record<string, string> = {
  "رديتر": "تبريد",
  "راديتر": "تبريد",
  "ماء": "تبريد",
  "فرامل": "فرامل",
  "مكابح": "فرامل",
  "بريك": "فرامل",
  "زيت": "زيوت",
  "فلتر": "فلاتر",
  "فلتر زيت": "فلاتر",
  "مكيف": "تكييف",
};

const stopWords = new Set(["قطع", "غيار", "قطعه", "سيارة", "اصلي", "أصلي"]);

export async function searchAiParts(payload: AiSearchQuery): Promise<AiSearchResponse> {
  if (useMock || !apiBase) {
    return mockAiSearch(payload);
  }

  try {
    const response = await fetch(`${apiBase}/api/ai-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.warn("AI search fallback to mock:", error);
    return mockAiSearch(payload);
  }
}

function mockAiSearch(payload: AiSearchQuery): AiSearchResponse {
  const query = payload.query.trim();
  const normalizedQuery = normalizeDigits(normalizeArabic(query));
  const corrected = applyBrandCorrections(query, normalizedQuery);
  const partNumber = extractPartNumber(query);
  const year = payload.year ?? extractYear(normalizedQuery);
  const brand = payload.brand ?? extractBrand(normalizedQuery);
  const carType = payload.car_type ?? extractCarType(normalizedQuery);
  const sectionMain = payload.section_main ?? extractSection(normalizedQuery);

  const keywords = extractKeywords(normalizedQuery, { brand, carType, sectionMain });

  const results = autoParts
    .filter((part) => {
      if (brand && part.brand !== brand) return false;
      if (carType && part.car_type !== carType) return false;
      if (year && part.year !== year) return false;
      if (sectionMain && part.section_main !== sectionMain) return false;
      if (payload.section_sub && part.section_sub !== payload.section_sub) return false;
      return true;
    })
    .map((part) => {
      const score = scorePart(part, {
        normalizedQuery,
        keywords,
        partNumber,
        brand,
        carType,
        year,
        sectionMain,
      });
      return {
        ...part,
        score,
        compatibility_match: matchesCompatibility(part, { brand, carType, year }),
      };
    })
    .filter((part) => part.score > 0.15 || query.length > 0)
    .sort((a, b) => b.score - a.score);

  const alternatives = buildAlternatives(results);
  const suggestions = buildSuggestions(results, brand, carType, sectionMain);

  return {
    query,
    corrected_query: corrected,
    intent: {
      brand,
      car_type: carType,
      year,
      section_main: sectionMain,
      part_number: partNumber,
    },
    filters: {
      brand,
      car_type: carType,
      year,
      section_main: sectionMain,
      section_sub: payload.section_sub ?? null,
    },
    use_ai: false,
    total: results.length,
    results,
    alternatives,
    suggestions,
  };
}

function scorePart(
  part: AutoPart,
  context: {
    normalizedQuery: string;
    keywords: string[];
    partNumber: string | null;
    brand: string | null;
    carType: string | null;
    year: number | null;
    sectionMain: string | null;
  }
): number {
  let score = 0;
  const name = normalizeArabic(part.name_ar);
  const description = normalizeArabic(part.description);
  const partNumber = part.part_number.toLowerCase();

  if (context.partNumber) {
    if (partNumber === context.partNumber.toLowerCase()) {
      score += 0.6;
    } else if (partNumber.includes(context.partNumber.toLowerCase())) {
      score += 0.4;
    }
  }

  if (context.brand && part.brand === context.brand) score += 0.15;
  if (context.carType && part.car_type === context.carType) score += 0.12;
  if (context.year && part.year === context.year) score += 0.1;
  if (context.sectionMain && part.section_main === context.sectionMain) score += 0.08;

  for (const token of context.keywords) {
    if (name.includes(token)) score += 0.06;
    if (description.includes(token)) score += 0.04;
  }

  if (part.stock > 0) score += 0.03;

  return Math.min(score, 1);
}

function buildAlternatives(results: AiSearchResult[]): AiSearchResult[] {
  const top = results[0];
  if (!top) return [];

  return autoParts
    .filter((part) => part.id !== top.id)
    .filter((part) => part.section_main === top.section_main || part.car_type === top.car_type)
    .slice(0, 5)
    .map((part) => ({ ...part, score: 0.2 }));
}

function buildSuggestions(
  results: AiSearchResult[],
  brand: string | null,
  carType: string | null,
  sectionMain: string | null
): AiSearchSuggestion[] {
  const suggestions: AiSearchSuggestion[] = results.slice(0, 5).map((part) => ({
    id: part.id,
    label: `${part.name_ar} • ${part.part_number}`,
    type: "part",
  }));

  if (brand) {
    suggestions.unshift({
      id: `brand-${brand}`,
      label: `عرض جميع قطع ${brandLabels[brand] ?? brand}`,
      type: "brand",
    });
  }

  if (carType) {
    suggestions.push({
      id: `car-${carType}`,
      label: `قطع متوافقة مع ${carType}`,
      type: "car",
    });
  }

  if (sectionMain) {
    suggestions.push({
      id: `section-${sectionMain}`,
      label: `قسم ${sectionMain}`,
      type: "section",
    });
  }

  return suggestions.slice(0, 6);
}

function matchesCompatibility(
  part: AutoPart,
  filters: { brand: string | null; carType: string | null; year: number | null }
): boolean {
  if (!filters.brand && !filters.carType && !filters.year) {
    return false;
  }

  return part.compatibility.some((entry) => {
    const brandMatch = !filters.brand || entry.brand === filters.brand;
    const typeMatch = !filters.carType || entry.car_type === filters.carType;
    const yearMatch = !filters.year || entry.years.includes(filters.year);
    return brandMatch && typeMatch && yearMatch;
  });
}

function normalizeArabic(value: string): string {
  return value
    .toLowerCase()
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit).toString());
}

function extractPartNumber(query: string): string | null {
  const match = query.match(/[A-Z0-9-]{4,}/i);
  return match ? match[0] : null;
}

function extractYear(query: string): number | null {
  const match = query.match(/(19|20)\d{2}/);
  return match ? Number(match[0]) : null;
}

function extractBrand(query: string): string | null {
  for (const [alias, brand] of Object.entries(brandAliases)) {
    if (query.includes(normalizeArabic(alias))) {
      return brand;
    }
  }

  return null;
}

function extractCarType(query: string): string | null {
  const carTypes = Array.from(new Set(autoParts.map((part) => part.car_type)));
  return carTypes.find((type) => query.includes(normalizeArabic(type))) ?? null;
}

function extractSection(query: string): string | null {
  for (const [alias, section] of Object.entries(sectionAliases)) {
    if (query.includes(normalizeArabic(alias))) {
      return section;
    }
  }
  return null;
}

function extractKeywords(
  query: string,
  context: { brand: string | null; carType: string | null; sectionMain: string | null }
): string[] {
  return query
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 1)
    .filter((token) => !stopWords.has(token))
    .filter((token) => {
      if (context.brand && token.includes(normalizeArabic(context.brand))) return false;
      if (context.carType && token.includes(normalizeArabic(context.carType))) return false;
      if (context.sectionMain && token.includes(normalizeArabic(context.sectionMain))) return false;
      return true;
    });
}

function applyBrandCorrections(query: string, normalizedQuery: string): string | null {
  for (const [alias, brand] of Object.entries(brandAliases)) {
    if (normalizedQuery.includes(normalizeArabic(alias))) {
      return query.replace(alias, brand);
    }
  }
  return null;
}
