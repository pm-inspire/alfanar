<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_search_analytics', function (Blueprint $table) {
            $table->id();
            $table->string('query');
            $table->string('normalized_query')->nullable();
            $table->string('brand')->nullable();
            $table->string('car_type')->nullable();
            $table->integer('year')->nullable();
            $table->string('section_main')->nullable();
            $table->string('section_sub')->nullable();
            $table->unsignedInteger('results_count')->default(0);
            $table->boolean('no_results')->default(false);
            $table->decimal('avg_score', 4, 3)->nullable();
            $table->timestamps();

            $table->index('query');
            $table->index(['brand', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_search_analytics');
    }
};
