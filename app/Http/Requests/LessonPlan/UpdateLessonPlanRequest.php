<?php

namespace App\Http\Requests\LessonPlan;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'session_date' => ['required', 'date'],
            'session_number' => ['required', 'integer', 'min:1'],

            'long_term_goal' => ['nullable', 'string'],
            'short_term_goal' => ['nullable', 'string'],
            'home_program' => ['nullable', 'string'],
            'therapist_note' => ['nullable', 'string'],

            /*
            |--------------------------------------------------------------------------
            | Ling Six
            |--------------------------------------------------------------------------
            */

            'ling_six_sounds' => ['required', 'array'],
            'ling_six_sounds.*.sound' => [
                'required',
                'in:m,u,i,a,sh,s',
            ],
            'ling_six_sounds.*.level' => [
                'required',
                'integer',
                'between:0,4',
            ],
            'ling_six_sounds.*.note' => [
                'nullable',
                'string',
            ],

            /*
            |--------------------------------------------------------------------------
            | Activities
            |--------------------------------------------------------------------------
            */

            'activities' => ['required', 'array', 'min:1'],

            'activities.*.activity_name' => [
                'required',
                'string',
                'max:255',
            ],

            'activities.*.objective' => [
                'nullable',
                'string',
            ],

            'activities.*.score' => [
                'nullable',
                'integer',
                'between:0,100',
            ],

            'activities.*.observation' => [
                'nullable',
                'string',
            ],

            /*
            |--------------------------------------------------------------------------
            | Evaluation
            |--------------------------------------------------------------------------
            */

            'evaluation' => ['required', 'array'],

            'evaluation.listening' => [
                'required',
                'integer',
                'between:1,5',
            ],

            'evaluation.speech' => [
                'required',
                'integer',
                'between:1,5',
            ],

            'evaluation.language' => [
                'required',
                'integer',
                'between:1,5',
            ],

            'evaluation.attention' => [
                'required',
                'integer',
                'between:1,5',
            ],

            'evaluation.recommendation' => [
                'nullable',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'activities.min' => 'Minimal harus ada satu aktivitas.',
            'ling_six_sounds.required' => 'Data Ling Six wajib diisi.',
        ];
    }
}