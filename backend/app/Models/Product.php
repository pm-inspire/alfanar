<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $guarded = [];

    protected $casts = [
        'embedding' => 'array',
        'compatibility' => 'array',
        'year' => 'integer',
        'price' => 'float',
        'stock' => 'integer',
    ];
}
