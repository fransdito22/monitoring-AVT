<?php

namespace Database\Seeders;

use App\Models\LessonActivity;
use App\Models\LessonPlan;
use Illuminate\Database\Seeder;

class LessonActivitySeeder extends Seeder
{
    public function run(): void
    {
        $lessonPlan = LessonPlan::first();
        if (!$lessonPlan) {
            return;
        }

        LessonActivity::updateOrCreate(
            [
                'lesson_plan_id' => $lessonPlan->id,
            ],
            [
                'activity_name' => 'Latihan perintah sederhana 1',
                'objective' => 'Meningkatkan kemampuan anak memahami instruksi singkat melalui contoh visual dan pengulangan bertahap.',
                'score' => 80,
                'observation' => 'Ananda mampu merespons dengan baik pada percobaan pertama; perlu bantuan minimal ketika tugas berpindah dari satu tahap ke tahap berikutnya.',
            ]
        );
    }
}