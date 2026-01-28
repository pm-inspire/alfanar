import { normalizeArabic } from "./arabic.mjs";
import { bestFuzzyMatch } from "./fuzzy.mjs";

// Extend this list to match your catalog taxonomy.
export const KNOWN_BRANDS = [
  "Toyota",
  "Hyundai",
  "Kia",
  "Nissan",
  "Mitsubishi",
  "Honda",
  "Mazda",
  "Isuzu",
  "Suzuki",
  "Chery",
  "Geely",
  "MG",
  "Haval",
];

// Arabic spellings and common typos -> canonical brand.
const ARABIC_BRAND_SYNONYMS = {
  تويوتا: "Toyota",
  تويتا: "Toyota",
  هايونداي: "Hyundai",
  هيونداي: "Hyundai",
  هونداي: "Hyundai",
  كيا: "Kia",
  نيسان: "Nissan",
  نيسون: "Nissan",
  ميتسوبيشي: "Mitsubishi",
  متسوبيشي: "Mitsubishi",
  ميتسوبيشى: "Mitsubishi",
  هوندا: "Honda",
  مازدا: "Mazda",
  ايسوزو: "Isuzu",
  سوزوكي: "Suzuki",
  شيري: "Chery",
  جيلي: "Geely",
  امجي: "MG",
  هافال: "Haval",
};

export function detectBrandFromQuery(query) {
  const tokens = normalizeArabic(query).split(" ").filter(Boolean);
  for (const t of tokens) {
    if (ARABIC_BRAND_SYNONYMS[t]) return { brand: ARABIC_BRAND_SYNONYMS[t], source: "synonym" };
  }

  // Fuzzy match against Arabic synonyms keys
  const synonymKeys = Object.keys(ARABIC_BRAND_SYNONYMS);
  for (const t of tokens) {
    const m = bestFuzzyMatch(t, synonymKeys, { maxDistance: 2 });
    if (m) return { brand: ARABIC_BRAND_SYNONYMS[m.value], source: "fuzzy_synonym", matched: m.value };
  }

  // Direct English brand mention
  for (const brand of KNOWN_BRANDS) {
    if (query.toLowerCase().includes(brand.toLowerCase())) return { brand, source: "english" };
  }

  return null;
}

