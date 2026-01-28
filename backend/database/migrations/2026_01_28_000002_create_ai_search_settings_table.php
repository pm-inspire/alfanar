<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_search_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('enabled')->default(true);
            $table->string('embedding_model')->nullable();
            $table->string('vector_store')->nullable();
            $table->timestamps();
        });

        DB::table('ai_search_settings')->insert([
            'enabled' => true,
            'embedding_model' => config('ai-search.embedding_model'),
            'vector_store' => config('ai-search.vector_store'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_search_settings');
    }
};
