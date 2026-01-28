<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiSearchAnalytics extends Model
{
    protected $table = 'ai_search_analytics';

    protected $guarded = [];

    protected $casts = [
        'no_results' => 'boolean',
        'results_count' => 'integer',
        'avg_score' => 'float',
    ];
}
