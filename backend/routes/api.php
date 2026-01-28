<?php

use App\Http\Controllers\Api\AiSearchAdminController;
use App\Http\Controllers\Api\AiSearchController;
use Illuminate\Support\Facades\Route;

Route::post('/ai-search', AiSearchController::class);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/ai-search/settings', [AiSearchAdminController::class, 'settings']);
    Route::put('/ai-search/settings', [AiSearchAdminController::class, 'updateSettings']);
    Route::post('/ai-search/rebuild', [AiSearchAdminController::class, 'rebuildEmbeddings']);
    Route::get('/ai-search/analytics', [AiSearchAdminController::class, 'analytics']);
});
