<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateProductEmbeddingJob;
use App\Models\AiSearchAnalytics;
use App\Models\AiSearchSetting;
use App\Models\Product;
use App\Services\AiSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AiSearchAdminController extends Controller
{
    public function settings()
    {
        $settings = AiSearchSetting::query()->first();

        return response()->json([
            'enabled' => $settings?->enabled ?? config('ai-search.enabled', true),
            'embedding_model' => $settings?->embedding_model ?? config('ai-search.embedding_model'),
            'vector_store' => $settings?->vector_store ?? config('ai-search.vector_store'),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
            'embedding_model' => ['nullable', 'string', 'max:120'],
            'vector_store' => ['nullable', 'string', 'max:60'],
        ]);

        $settings = AiSearchSetting::query()->firstOrCreate([]);
        $settings->fill($data)->save();

        return response()->json([
            'status' => 'ok',
            'settings' => $settings->fresh(),
        ]);
    }

    public function rebuildEmbeddings(Request $request, AiSearchService $service)
    {
        $force = (bool) $request->boolean('force', false);
        $queue = (bool) $request->boolean('queue', true);
        $chunk = max(50, (int) $request->input('chunk', 200));

        $query = Product::query()->select('id');
        if (!$force) {
            $query->whereNull('embedding');
        }

        $total = $query->count();

        $query->chunkById($chunk, function ($products) use ($queue, $service) {
            $ids = $products->pluck('id')->all();
            if ($queue) {
                GenerateProductEmbeddingJob::dispatch($ids);
                return;
            }

            $service->generateEmbeddingsForProducts(Product::query()->whereIn('id', $ids)->get());
        });

        return response()->json([
            'status' => 'queued',
            'queued' => $queue,
            'total' => $total,
        ]);
    }

    public function analytics()
    {
        $topQueries = AiSearchAnalytics::query()
            ->select([
                'query',
                DB::raw('count(*) as searches'),
                DB::raw('sum(no_results) as no_results'),
                DB::raw('avg(results_count) as avg_results'),
                DB::raw('avg(avg_score) as avg_score'),
            ])
            ->groupBy('query')
            ->orderByDesc('searches')
            ->limit(20)
            ->get();

        $popularBrands = AiSearchAnalytics::query()
            ->select([
                'brand',
                DB::raw('count(*) as searches'),
            ])
            ->whereNotNull('brand')
            ->groupBy('brand')
            ->orderByDesc('searches')
            ->limit(10)
            ->get();

        $noResults = AiSearchAnalytics::query()
            ->select([
                'query',
                DB::raw('count(*) as searches'),
            ])
            ->where('no_results', true)
            ->groupBy('query')
            ->orderByDesc('searches')
            ->limit(10)
            ->get();

        return response()->json([
            'top_queries' => $topQueries,
            'popular_brands' => $popularBrands,
            'no_results' => $noResults,
        ]);
    }
}
