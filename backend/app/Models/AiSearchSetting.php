<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiSearchSetting extends Model
{
    protected $table = 'ai_search_settings';

    protected $guarded = [];

    protected $casts = [
        'enabled' => 'boolean',
    ];
}
