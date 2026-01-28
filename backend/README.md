# AI Search Backend (Laravel)

This folder contains the Laravel-side implementation for AI semantic search
with Arabic RTL support, typo correction, and vehicle compatibility matching.

## Install dependencies

```bash
composer require openai-php/client
composer require teddy/mpociot/elasticsearch
# Optional vector store fallback
composer require meilisearch/meilisearch-php
```

## Environment variables

```bash
OPENAI_API_KEY=sk-...
AI_SEARCH_ENABLED=true
AI_SEARCH_EMBEDDING_MODEL=text-embedding-3-small
AI_SEARCH_SCORE_THRESHOLD=0.78
AI_SEARCH_CANDIDATE_LIMIT=300
AI_SEARCH_VECTOR_STORE=database
AI_SEARCH_TYPO_MODE=fuzzy

# Optional VIN decoding
VIN_API_URL=https://your-vin-provider.example/api/lookup
VIN_API_KEY=your_api_key

# Optional Meilisearch vector store
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey
MEILISEARCH_AI_INDEX=products
```

## Migrations

```bash
php artisan migrate
```

Notes:
- MySQL stores embeddings as JSON. If you use PostgreSQL + pgvector, replace
  the `embedding` JSON column with `vector` and perform vector search in SQL.
- Indexes are added for brand/year/section/part_number to speed filters.

## Generate embeddings

```bash
# One-time batch
php artisan ai:generate-embeddings

# Rebuild all embeddings
php artisan ai:generate-embeddings --force

# Queue batch jobs (recommended for large catalogs)
php artisan ai:generate-embeddings --queue
```

Register the command in `app/Console/Kernel.php`:

```php
protected $commands = [
    \App\Console\Commands\GenerateProductEmbeddings::class,
];
```

## API endpoints

```
POST /api/ai-search
GET  /api/ai-search/settings        (auth:sanctum)
PUT  /api/ai-search/settings        (auth:sanctum)
POST /api/ai-search/rebuild         (auth:sanctum)
GET  /api/ai-search/analytics       (auth:sanctum)
```

### Example request

```json
{
  "query": "ماء رديتر ميتسوبيشي ازرق",
  "brand": "Mitsubishi",
  "year": 2015
}
```

### Example response

```json
{
  "query": "ماء رديتر ميتسوبيشي ازرق",
  "corrected_query": "ماء رديتر Mitsubishi ازرق",
  "intent": { "brand": "Mitsubishi", "year": 2015 },
  "results": [
    { "id": 12, "name_ar": "رديتر ماء ميتسوبيشي لانسر", "score": 0.92 }
  ],
  "alternatives": []
}
```

## Deployment notes

- Run embedding generation in a queue worker to avoid timeouts.
- Cache query embeddings for faster response times (already in the service).
- Protect admin endpoints with auth middleware.

## Test queries (Arabic RTL)

1. "ماء radiator ميتسوبيشي 2015"
2. "قطع غيار تويوتا 2010 فرامل"
3. "فلتر زيت النترا 2017"
4. "ميتسوبيشي لانسر بريك امامي" (typo correction)
5. "VIN: JHMCM56557C404453" (VIN decode when API is configured)
