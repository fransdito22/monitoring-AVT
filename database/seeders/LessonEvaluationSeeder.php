<?php

namespace Database\Seeders;

use App\Models\LessonEvaluation;
use App\Models\LessonPlan;
use Illuminate\Database\Seeder;

class LessonEvaluationSeeder extends Seeder
{
    public function run(): void
    {
        $lessonPlan = LessonPlan::first();
        if (!$lessonPlan) {
            return;
        }

        LessonEvaluation::updateOrCreate(
            [
                'lesson_plan_id' => $lessonPlan->id,
            ],
            [
                // Kolom sesuai migration: listening/speech/language/attention
                'listening' => 75,
                'speech' => 70,
                'language' => 72,
                'attention' => 78,
                'recommendation' => 'Rekomendasi: gunakan instruksi singkat bertahap dengan contoh visual; perkuat dengan pengulangan terarah dan jeda istirahat pendek.',
            ]
        );
    }
}