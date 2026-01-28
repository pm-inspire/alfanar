// Minimal Damerau-Levenshtein distance for typo tolerance.
export function damerauLevenshtein(a, b) {
  a = String(a || "");
  b = String(b || "");
  const alen = a.length;
  const blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;

  const dp = Array.from({ length: alen + 1 }, () => new Array(blen + 1).fill(0));
  for (let i = 0; i <= alen; i++) dp[i][0] = i;
  for (let j = 0; j <= blen; j++) dp[0][j] = j;

  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost); // transposition
      }
    }
  }
  return dp[alen][blen];
}

export function bestFuzzyMatch(query, options, { maxDistance } = {}) {
  const q = String(query || "").trim();
  if (!q) return null;
  let best = null;
  for (const opt of options || []) {
    const d = damerauLevenshtein(q, opt);
    if (!best || d < best.distance) best = { value: opt, distance: d };
  }
  if (!best) return null;
  if (typeof maxDistance === "number" && best.distance > maxDistance) return null;
  return best;
}

