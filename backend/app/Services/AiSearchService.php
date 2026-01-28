<?php

namespace App\Services;

use App\Models\AiSearchAnalytics;
use App\Models\AiSearchSetting;
use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use OpenAI;
use OpenAI\Client;

class AiSearchService
{
    private array $config;
    private ?Client $openAi;

    public function __construct()
    {
        $this->config = config('ai-search');
        $apiKey = $this->config['openai_api_key'] ?? null;
        $this->openAi = $apiKey ? OpenAI::client($apiKey) : null;
    }

    public function search(array $payload): array
    {
        $query = trim((string) ($payload['query'] ?? ''));
        $filters = [
            'brand' => $payload['brand'] ?? null,
            'car_type' => $payload['car_type'] ?? null,
            'year' => $payload['year'] ?? null,
            'section_main' => $payload['section_main'] ?? null,
            'section_sub' => $payload['section_sub'] ?? null,
        ];

        $page = max(1, (int) ($payload['page'] ?? 1));
        $perPage = (int) ($payload['per_page'] ?? ($this->config['limits']['results'] ?? 24));
        $perPage = min(max($perPage, 1), 60);

        $analysis = $this->analyzeQuery($query);
        $intent = $analysis['intent'];

        $filters['brand'] = $filters['brand'] ?: ($intent['brand'] ?? null);
        $filters['car_type'] = $filters['car_type'] ?: ($intent['car_type'] ?? null);
        $filters['year'] = $filters['year'] ?: ($intent['year'] ?? null);
        $filters['section_main'] = $filters['section_main'] ?: ($intent['section_main'] ?? null);

        $settings = $this->resolveSettings();
        $useAi = $settings['enabled'] && $this->openAi && $query !== '';

        $normalizedQuery = $analysis['normalized_query'] ?? $query;
        $embedding = null;
        if ($useAi) {
            $embedding = $this->getQueryEmbedding($analysis['corrected_query'] ?: $normalizedQuery);
        }

        $candidates = $this->fetchCandidates($analysis, $filters);
        $scored = $this->scoreCandidates($candidates, $analysis, $filters, $embedding, $useAi);

        $threshold = (float) ($this->config['score_threshold'] ?? 0.78);
        $filtered = $scored
            ->filter(fn (array $entry) => $entry['score'] >= $threshold || !$useAi)
            ->sortByDesc('score')
            ->values();

        if ($filtered->isEmpty() && $query !== '') {
            $filtered = $scored->sortByDesc('score')->values();
        }

        $total = $filtered->count();
        $offset = ($page - 1) * $perPage;
        $paginated = $filtered->slice($offset, $perPage)->values();

        $results = $paginated->map(fn (array $entry) => $this->formatResult($entry['product'], $entry['score'], $filters));
        $alternatives = $this->buildAlternatives($filtered, $filters);

        $this->logAnalytics($query, $analysis, $filters, $total, $filtered);

        return [
            'query' => $query,
            'corrected_query' => $analysis['corrected_query'],
            'intent' => $intent,
            'filters' => $filters,
            'use_ai' => $useAi,
            'page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'results' => $results,
            'alternatives' => $alternatives,
        ];
    }

    public function generateEmbeddingsForProducts(Collection $products): void
    {
        if (!$this->openAi) {
            throw new \RuntimeException('OpenAI client not configured.');
        }

        $inputs = $products->map(fn (Product $product) => $this->buildEmbeddingText($product))->values()->all();

        if (empty($inputs)) {
            return;
        }

        $response = $this->openAi->embeddings()->create([
            'model' => $this->config['embedding_model'],
            'input' => $inputs,
        ]);

        foreach ($products->values() as $index => $product) {
            $vector = $response->embeddings[$index]->embedding ?? null;
            if ($vector) {
                $product->forceFill(['embedding' => $vector])->save();
            }
        }
    }

    private function resolveSettings(): array
    {
        $settings = [
            'enabled' => (bool) ($this->config['enabled'] ?? true),
        ];

        try {
            $record = AiSearchSetting::query()->first();
            if ($record) {
                $settings['enabled'] = $record->enabled;
            }
        } catch (\Throwable $exception) {
            // Ignore when table is missing during first deploys.
        }

        return $settings;
    }

    private function buildEmbeddingText(Product $product): string
    {
        return trim(implode(' | ', array_filter([
            $product->name_ar,
            $product->part_number,
            $product->brand,
            $product->car_type,
            $product->year,
            $product->section_main,
            $product->section_sub,
            $product->description,
        ])));
    }

    private function getQueryEmbedding(string $query): ?array
    {
        if (!$this->openAi) {
            return null;
        }

        $cacheKey = 'ai-search:embedding:' . md5($query);

        return Cache::remember($cacheKey, 900, function () use ($query) {
            $response = $this->openAi->embeddings()->create([
                'model' => $this->config['embedding_model'],
                'input' => $query,
            ]);

            return $response->embeddings[0]->embedding ?? null;
        });
    }

    private function analyzeQuery(string $query): array
    {
        $normalized = $this->normalizeArabic($query);
        $normalized = $this->normalizeDigits($normalized);

        $intent = [
            'part_number' => $this->extractPartNumber($normalized),
            'year' => $this->extractYear($normalized),
            'brand' => $this->extractBrand($normalized),
            'car_type' => $this->extractCarType($normalized),
            'section_main' => $this->extractSection($normalized),
            'vin' => $this->extractVin($query),
        ];

        if (!empty($intent['vin'])) {
            $vinContext = $this->resolveVin($intent['vin']);
            $intent['brand'] = $intent['brand'] ?: ($vinContext['brand'] ?? null);
            $intent['car_type'] = $intent['car_type'] ?: ($vinContext['car_type'] ?? null);
            $intent['year'] = $intent['year'] ?: ($vinContext['year'] ?? null);
        }

        $intent['keywords'] = $this->extractKeywords($normalized, $intent);

        $correctedQuery = $this->applyFuzzyCorrections($query, $intent);

        return [
            'normalized_query' => $normalized,
            'corrected_query' => $correctedQuery,
            'intent' => $intent,
        ];
    }

    private function fetchCandidates(array $analysis, array $filters): Collection
    {
        $intent = $analysis['intent'];
        $keywords = $intent['keywords'] ?? [];
        $partNumber = $intent['part_number'] ?? null;

        $query = Product::query();

        if ($filters['brand']) {
            $query->where('brand', $filters['brand']);
        }
        if ($filters['car_type']) {
            $query->where('car_type', $filters['car_type']);
        }
        if ($filters['year']) {
            $query->where('year', $filters['year']);
        }
        if ($filters['section_main']) {
            $query->where('section_main', $filters['section_main']);
        }
        if ($filters['section_sub']) {
            $query->where('section_sub', $filters['section_sub']);
        }

        if ($partNumber || !empty($keywords)) {
            $query->where(function ($builder) use ($partNumber, $keywords) {
                if ($partNumber) {
                    $builder->orWhere('part_number', 'like', '%' . $partNumber . '%');
                }
                foreach ($keywords as $term) {
                    $builder->orWhere('name_ar', 'like', '%' . $term . '%')
                        ->orWhere('description', 'like', '%' . $term . '%')
                        ->orWhere('section_main', 'like', '%' . $term . '%')
                        ->orWhere('section_sub', 'like', '%' . $term . '%');
                }
            });
        }

        return $query
            ->limit($this->config['candidate_limit'] ?? 300)
            ->get();
    }

    private function scoreCandidates(
        Collection $products,
        array $analysis,
        array $filters,
        ?array $embedding,
        bool $useAi
    ): Collection {
        return $products->map(function (Product $product) use ($analysis, $filters, $embedding, $useAi) {
            $vectorScore = null;
            if ($useAi && $embedding && is_array($product->embedding)) {
                $vectorScore = $this->cosineSimilarity($embedding, $product->embedding);
            }

            $keywordScore = $this->keywordScore($product, $analysis, $filters);
            $score = $this->blendScores($vectorScore, $keywordScore, $product);

            return [
                'product' => $product,
                'score' => $score,
            ];
        });
    }

    private function keywordScore(Product $product, array $analysis, array $filters): float
    {
        $intent = $analysis['intent'];
        $score = 0.0;

        $normalizedName = $this->normalizeArabic((string) $product->name_ar);
        $normalizedDescription = $this->normalizeArabic((string) $product->description);
        $normalizedPartNumber = $this->normalizeArabic((string) $product->part_number);

        if (!empty($intent['part_number'])) {
            if (strcasecmp($product->part_number, $intent['part_number']) === 0) {
                $score += 0.8;
            } elseif (Str::contains($normalizedPartNumber, $intent['part_number'])) {
                $score += 0.6;
            }
        }

        foreach ($intent['keywords'] ?? [] as $term) {
            if (Str::contains($normalizedName, $term)) {
                $score += 0.12;
            }
            if (Str::contains($normalizedDescription, $term)) {
                $score += 0.06;
            }
        }

        if (!empty($filters['brand']) && strcasecmp($product->brand, $filters['brand']) === 0) {
            $score += (float) ($this->config['rerank']['boost_brand_match'] ?? 0.1);
        }
        if (!empty($filters['year']) && (int) $product->year === (int) $filters['year']) {
            $score += (float) ($this->config['rerank']['boost_year_match'] ?? 0.08);
        }

        if ($product->stock > 0) {
            $score += (float) ($this->config['rerank']['boost_in_stock'] ?? 0.05);
        }

        return min($score, 1.0);
    }

    private function blendScores(?float $vectorScore, float $keywordScore, Product $product): float
    {
        if ($vectorScore === null) {
            return $keywordScore;
        }

        $score = (0.65 * $vectorScore) + (0.35 * $keywordScore);

        if (!empty($product->part_number)) {
            $score += (float) ($this->config['rerank']['boost_exact_part_number'] ?? 0.3) * ($keywordScore >= 0.6 ? 1 : 0);
        }

        return min($score, 1.0);
    }

    private function buildAlternatives(Collection $scored, array $filters): array
    {
        $top = $scored->first();
        if (!$top) {
            return [];
        }

        /** @var Product $product */
        $product = $top['product'];
        $limit = (int) ($this->config['limits']['alternatives'] ?? 5);

        $query = Product::query()
            ->where('id', '!=', $product->id)
            ->where('section_main', $product->section_main)
            ->orderByDesc('stock')
            ->limit($limit);

        if ($filters['brand']) {
            $query->where('brand', $filters['brand']);
        }

        return $query->get()
            ->map(fn (Product $item) => $this->formatResult($item, 0.0, $filters))
            ->values()
            ->all();
    }

    private function formatResult(Product $product, float $score, array $filters): array
    {
        return [
            'id' => $product->id,
            'name_ar' => $product->name_ar,
            'part_number' => $product->part_number,
            'brand' => $product->brand,
            'car_type' => $product->car_type,
            'year' => $product->year,
            'section_main' => $product->section_main,
            'section_sub' => $product->section_sub,
            'description' => $product->description,
            'image' => $product->image,
            'price' => $product->price,
            'stock' => $product->stock,
            'compatibility' => $product->compatibility,
            'score' => round($score, 4),
            'compatibility_match' => $this->isCompatible($product, $filters),
        ];
    }

    private function isCompatible(Product $product, array $filters): bool
    {
        if (empty($filters['brand']) && empty($filters['car_type']) && empty($filters['year'])) {
            return false;
        }

        $compatibility = $product->compatibility ?? [];
        if (is_array($compatibility) && !empty($compatibility)) {
            foreach ($compatibility as $entry) {
                $brandMatch = empty($filters['brand']) || strcasecmp($entry['brand'] ?? '', $filters['brand']) === 0;
                $typeMatch = empty($filters['car_type']) || strcasecmp($entry['car_type'] ?? '', $filters['car_type']) === 0;
                $yearMatch = empty($filters['year']) || in_array((int) $filters['year'], $entry['years'] ?? [], true);
                if ($brandMatch && $typeMatch && $yearMatch) {
                    return true;
                }
            }
        }

        $brandMatch = empty($filters['brand']) || strcasecmp($product->brand, $filters['brand']) === 0;
        $typeMatch = empty($filters['car_type']) || strcasecmp($product->car_type, $filters['car_type']) === 0;
        $yearMatch = empty($filters['year']) || (int) $product->year === (int) $filters['year'];

        return $brandMatch && $typeMatch && $yearMatch;
    }

    private function logAnalytics(string $query, array $analysis, array $filters, int $total, Collection $results): void
    {
        try {
            $avgScore = $results->avg('score');

            AiSearchAnalytics::create([
                'query' => $query,
                'normalized_query' => $analysis['normalized_query'],
                'brand' => $filters['brand'],
                'car_type' => $filters['car_type'],
                'year' => $filters['year'],
                'section_main' => $filters['section_main'],
                'section_sub' => $filters['section_sub'],
                'results_count' => $total,
                'no_results' => $total === 0,
                'avg_score' => $avgScore,
            ]);
        } catch (\Throwable $exception) {
            // Analytics should never break search.
        }
    }

    private function extractPartNumber(string $query): ?string
    {
        if (preg_match('/[A-Z0-9\-]{4,}/i', $query, $matches)) {
            return $matches[0];
        }

        return null;
    }

    private function extractYear(string $query): ?int
    {
        if (preg_match('/(19|20)\d{2}/', $query, $matches)) {
            return (int) $matches[0];
        }

        return null;
    }

    private function extractBrand(string $query): ?string
    {
        foreach ($this->config['brand_aliases'] as $alias => $brand) {
            if (Str::contains($query, $this->normalizeArabic($alias))) {
                return $brand;
            }
        }

        $brands = $this->getBrandList();
        foreach ($brands as $brand) {
            if (Str::contains($query, $this->normalizeArabic($brand))) {
                return $brand;
            }
        }

        return $this->closestMatch($query, $brands, 3);
    }

    private function extractCarType(string $query): ?string
    {
        $types = $this->getCarTypes();
        foreach ($types as $type) {
            if (Str::contains($query, $this->normalizeArabic($type))) {
                return $type;
            }
        }

        return $this->closestMatch($query, $types, 3);
    }

    private function extractSection(string $query): ?string
    {
        foreach ($this->config['section_aliases'] as $alias => $section) {
            if (Str::contains($query, $this->normalizeArabic($alias))) {
                return $section;
            }
        }

        return null;
    }

    private function extractVin(string $query): ?string
    {
        $normalized = strtoupper(preg_replace('/\s+/', '', $query));
        if (preg_match('/\b[A-HJ-NPR-Z0-9]{17}\b/', $normalized, $matches)) {
            return $matches[0];
        }

        return null;
    }

    private function resolveVin(string $vin): array
    {
        $vinConfig = $this->config['vin'] ?? [];
        if (empty($vinConfig['api_url'])) {
            return [];
        }

        try {
            $response = Http::timeout(4)
                ->withHeaders(array_filter([
                    'Authorization' => $vinConfig['api_key'] ? 'Bearer ' . $vinConfig['api_key'] : null,
                ]))
                ->get($vinConfig['api_url'], ['vin' => $vin]);

            if (!$response->ok()) {
                return [];
            }

            $data = $response->json();

            return [
                'brand' => $data['brand'] ?? $data['make'] ?? null,
                'car_type' => $data['car_type'] ?? $data['model'] ?? null,
                'year' => isset($data['year']) ? (int) $data['year'] : null,
            ];
        } catch (\Throwable $exception) {
            return [];
        }
    }

    private function extractKeywords(string $query, array $intent): array
    {
        $tokens = preg_split('/\s+/u', $query);
        $stopWords = ['قطع', 'غيار', 'غيار', 'قطعه', 'قطع', 'سيارة', 'سيارات', 'أصلي', 'اصلي'];
        $tokens = array_filter($tokens, function ($token) use ($stopWords, $intent) {
            if (mb_strlen($token) < 2) {
                return false;
            }
            if (in_array($token, $stopWords, true)) {
                return false;
            }
            if (!empty($intent['brand']) && Str::contains($token, $this->normalizeArabic($intent['brand']))) {
                return false;
            }

            return true;
        });

        return array_values(array_unique($tokens));
    }

    private function getBrandList(): array
    {
        return Cache::remember('ai-search:brands', 3600, function () {
            try {
                return Product::query()
                    ->select('brand')
                    ->distinct()
                    ->whereNotNull('brand')
                    ->pluck('brand')
                    ->filter()
                    ->values()
                    ->all();
            } catch (\Throwable $exception) {
                return [];
            }
        });
    }

    private function getCarTypes(): array
    {
        return Cache::remember('ai-search:car-types', 3600, function () {
            try {
                return Product::query()
                    ->select('car_type')
                    ->distinct()
                    ->whereNotNull('car_type')
                    ->pluck('car_type')
                    ->filter()
                    ->values()
                    ->all();
            } catch (\Throwable $exception) {
                return [];
            }
        });
    }

    private function closestMatch(string $query, array $options, int $maxDistance): ?string
    {
        $best = null;
        $bestDistance = $maxDistance + 1;
        $normalizedQuery = $this->normalizeArabic($query);

        foreach ($options as $option) {
            $normalizedOption = $this->normalizeArabic($option);
            $distance = levenshtein($normalizedQuery, $normalizedOption);
            if ($distance < $bestDistance) {
                $bestDistance = $distance;
                $best = $option;
            }
        }

        return $bestDistance <= $maxDistance ? $best : null;
    }

    private function applyFuzzyCorrections(string $query, array $intent): ?string
    {
        $corrected = $query;

        if ($intent['brand']) {
            foreach ($this->config['brand_aliases'] as $alias => $brand) {
                if (Str::contains($this->normalizeArabic($query), $this->normalizeArabic($alias))) {
                    $corrected = str_replace($alias, $brand, $corrected);
                }
            }
        }

        if ($corrected === $query) {
            return null;
        }

        return $corrected;
    }

    private function normalizeArabic(string $value): string
    {
        $value = mb_strtolower($value);
        $value = preg_replace('/[إأآا]/u', 'ا', $value);
        $value = preg_replace('/[ى]/u', 'ي', $value);
        $value = preg_replace('/[ؤ]/u', 'و', $value);
        $value = preg_replace('/[ئ]/u', 'ي', $value);
        $value = preg_replace('/[ة]/u', 'ه', $value);
        $value = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $value);
        $value = preg_replace('/\s+/u', ' ', $value);

        return trim($value);
    }

    private function normalizeDigits(string $value): string
    {
        $map = [
            '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4',
            '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
        ];

        return strtr($value, $map);
    }

    private function cosineSimilarity(array $a, array $b): float
    {
        $dot = 0.0;
        $normA = 0.0;
        $normB = 0.0;
        $length = min(count($a), count($b));

        for ($i = 0; $i < $length; $i++) {
            $dot += $a[$i] * $b[$i];
            $normA += $a[$i] ** 2;
            $normB += $b[$i] ** 2;
        }

        if ($normA == 0.0 || $normB == 0.0) {
            return 0.0;
        }

        return $dot / (sqrt($normA) * sqrt($normB));
    }
}
