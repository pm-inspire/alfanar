// Lightweight Arabic normalization + tokenization helpers for search.

const arabicDiacritics = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const tatweel = /\u0640/g;
const punctuation = /[^\p{L}\p{N}\s]/gu;

export function toLatinDigits(input) {
  return String(input)
    .replace(/[٠-٩]/g, (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)])
    .replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
}

export function normalizeArabic(input) {
  const s = toLatinDigits(String(input || ""))
    .replace(arabicDiacritics, "")
    .replace(tatweel, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(punctuation, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return s;
}

export function tokenize(input) {
  const s = normalizeArabic(input);
  if (!s) return [];
  return s.split(" ").filter(Boolean);
}

export function extractYear(input) {
  const s = toLatinDigits(String(input || ""));
  const match = s.match(/\b(19\d{2}|20\d{2})\b/);
  if (!match) return null;
  const year = Number(match[1]);
  if (year < 1950 || year > 2100) return null;
  return year;
}

export function extractPartNumberCandidates(input) {
  const s = String(input || "");
  // Common auto-part patterns: digits, letters+digits, hyphen, slash.
  const candidates = s.match(/[A-Za-z0-9][A-Za-z0-9\-\/]{4,}/g) || [];
  const uniq = [...new Set(candidates.map((c) => c.trim()).filter(Boolean))];
  // Prefer mostly digits/alnum; drop pure words
  return uniq.filter((c) => /\d/.test(c));
}

