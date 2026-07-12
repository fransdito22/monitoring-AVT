<?php

namespace Database\Seeders;

use App\Models\LingSixSoundResult;
use App\Models\LessonPlan;
use Illuminate\Database\Seeder;

class LingSixSoundResultSeeder extends Seeder
{
    public function run(): void
    {
        $lessonPlan = LessonPlan::first();
        if (!$lessonPlan) {
            return;
        }

        LingSixSoundResult::updateOrCreate(
            [
                'lesson_plan_id' => $lessonPlan->id,
            ],
            [
                // sesuai migration 2026_06_22_152405_create_ling_six_sound_results_table
                'sound' => 'm',
                // level: 0..4 (0 Not detected, 1 Detected, 2 Discriminated, 3 Identified, 4 Comprehended)
                'level' => 3,
                'note' => 'Ananda merespons bunyi /m/ dengan cukup jelas pada sebagian besar percobaan.',
            ]
        );
    }
}