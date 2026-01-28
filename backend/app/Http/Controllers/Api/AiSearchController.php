<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AiSearchRequest;
use App\Services\AiSearchService;

class AiSearchController extends Controller
{
    public function __invoke(AiSearchRequest $request, AiSearchService $service)
    {
        return response()->json($service->search($request->validated()));
    }
}
