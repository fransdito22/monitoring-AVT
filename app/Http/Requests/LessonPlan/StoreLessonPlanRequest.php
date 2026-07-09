<?php

namespace App\Http\Requests\LessonPlan;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | Lesson Plan
            |--------------------------------------------------------------------------
            */

            'schedule_id' => [
                'required',
                'exists:schedules,id',
            ],

            'session_date' => [
                'required',
                'date',
            ],

            'session_number' => [
                'required',
                'integer',
                'min:1',
            ],

            // New schema uses `goal`
            'goal' => [
                'nullable',
                'string',
            ],

            // Backward compatibility with older frontend/payloads
            'long_term_goal' => [
                'nullable',
                'string',
            ],

            'short_term_goal' => [
                'nullable',
                'string',
            ],

            'home_program' => [
                'nullable',
                'array',
            ],

            'home_program.*.title' => [
                'nullable',
                'string',
            ],

            'home_program.*.instruction' => [
                'nullable',
                'string',
            ],

            'home_program.*.frequency' => [
                'nullable',
                'string',
            ],

            'therapist_note' => [
                'nullable',
                'string',
            ],

            /*
            |--------------------------------------------------------------------------
            | Activities
            |--------------------------------------------------------------------------
            */
            'activities' => [
                'required',
                'array',
                'min:1',
            ],

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
                'between:1,5',
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

            'evaluation.listening' => [
                'nullable',
                'integer',
                'between:1,5',
            ],

            'evaluation.speech' => [
                'nullable',
                'integer',
                'between:1,5',
            ],

            'evaluation.language' => [
                'nullable',
                'integer',
                'between:1,5',
            ],

            'evaluation.attention' => [
                'nullable',
                'integer',
                'between:1,5',
            ],

            'evaluation.recommendation' => [
                'nullable',
                'string',
            ],

            /*
            |--------------------------------------------------------------------------
            | Ling Six Sound
            |--------------------------------------------------------------------------
            */

            'ling_six_sounds' => [
                'nullable',
                'array',
            ],

            'ling_six_sounds.*.sound' => [
                'required_with:ling_six_sounds',
                'in:m,u,i,a,sh,s',
            ],

            'ling_six_sounds.*.level' => [
                'required_with:ling_six_sounds',
                'integer',
                'between:0,5',
            ],

            'ling_six_sounds.*.note' => [
                'nullable',
                'string',
            ],
        ];
    }
}
