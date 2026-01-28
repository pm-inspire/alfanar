<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'embedding')) {
                $table->json('embedding')->nullable()->after('description');
            }
            if (!Schema::hasColumn('products', 'compatibility')) {
                $table->json('compatibility')->nullable()->after('embedding');
            }

            $table->index('brand');
            $table->index('year');
            $table->index(['brand', 'car_type', 'year']);
            $table->index(['section_main', 'section_sub']);
            $table->index('part_number');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'embedding')) {
                $table->dropColumn('embedding');
            }
            if (Schema::hasColumn('products', 'compatibility')) {
                $table->dropColumn('compatibility');
            }

            $table->dropIndex(['brand']);
            $table->dropIndex(['year']);
            $table->dropIndex(['brand', 'car_type', 'year']);
            $table->dropIndex(['section_main', 'section_sub']);
            $table->dropIndex(['part_number']);
        });
    }
};
