<?php

namespace App\Console\Commands;

use App\Jobs\GenerateProductEmbeddingJob;
use App\Models\Product;
use App\Services\AiSearchService;
use Illuminate\Console\Command;

class GenerateProductEmbeddings extends Command
{
    protected $signature = 'ai:generate-embeddings 
        {--force : Rebuild all embeddings} 
        {--queue : Dispatch jobs to the queue} 
        {--chunk=200 : Batch size per request}';

    protected $description = 'Generate OpenAI embeddings for products';

    public function handle(AiSearchService $service): int
    {
        $force = (bool) $this->option('force');
        $queue = (bool) $this->option('queue');
        $chunk = max(50, (int) $this->option('chunk'));

        $query = Product::query()->select('id');
        if (!$force) {
            $query->whereNull('embedding');
        }

        $total = $query->count();
        $this->info("Embedding queue size: {$total}");

        $query->chunkById($chunk, function ($products) use ($queue, $service) {
            $ids = $products->pluck('id')->all();
            if ($queue) {
                GenerateProductEmbeddingJob::dispatch($ids);
                $this->line('Queued batch: ' . implode(',', $ids));
                return;
            }

            $service->generateEmbeddingsForProducts(Product::query()->whereIn('id', $ids)->get());
            $this->line('Processed batch: ' . implode(',', $ids));
        });

        $this->info('Embedding generation completed.');

        return self::SUCCESS;
    }
}
