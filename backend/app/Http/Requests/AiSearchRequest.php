<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AiSearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $maxYear = now()->year + 1;

        return [
            'query' => ['required', 'string', 'min:2', 'max:200'],
            'brand' => ['nullable', 'string', 'max:80'],
            'car_type' => ['nullable', 'string', 'max:80'],
            'year' => ['nullable', 'integer', 'between:1980,' . $maxYear],
            'section_main' => ['nullable', 'string', 'max:100'],
            'section_sub' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:60'],
        ];
    }
}
