<?php

namespace App\Jobs;

use App\Models\Product;
use App\Services\AiSearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateProductEmbeddingJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(public array $productIds)
    {
    }

    public function handle(AiSearchService $service): void
    {
        $products = Product::query()
            ->whereIn('id', $this->productIds)
            ->get();

        $service->generateEmbeddingsForProducts($products);
    }
}
