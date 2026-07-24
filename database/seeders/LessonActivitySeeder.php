<?php

namespace Database\Seeders;

use App\Models\LessonActivity;
use App\Models\LessonPlan;
use Illuminate\Database\Seeder;

class LessonActivitySeeder extends Seeder
{
    private const ACTIVITIES = [
        [
            'name' => 'Latihan Ling Six Sound',
            'objective' => 'Melatih kemampuan deteksi dan identifikasi enam bunyi dasar (m, a, u, i, s, sh).',
            'scores' => [60, 65, 70, 75, 78, 80, 82, 85],
        ],
        [
            'name' => 'Instruksi Sederhana',
            'objective' => 'Melatih kemampuan mengikuti instruksi satu langkah secara mandiri.',
            'scores' => [55, 60, 65, 70, 75, 80, 83, 86],
        ],
        [
            'name' => 'Meniru Kata',
            'objective' => 'Mengembangkan kemampuan meniru kata sederhana dengan artikulasi yang jelas.',
            'scores' => [50, 55, 62, 68, 73, 78, 82, 85],
        ],
        [
            'name' => 'Menyebut Nama Benda',
            'objective' => 'Melatih kemampuan mengidentifikasi dan menyebutkan nama benda di sekitar.',
            'scores' => [58, 62, 68, 72, 77, 81, 84, 88],
        ],
        [
            'name' => 'Diskriminasi Bunyi',
            'objective' => 'Melatih kemampuan membedakan bunyi-bunyi yang berbeda dalam lingkungan sekitar.',
            'scores' => [52, 58, 64, 70, 75, 80, 83, 86],
        ],
    ];

    public function run(): void
    {
        $lessonPlans = LessonPlan::orderBy('session_date')->get();

        if ($lessonPlans->isEmpty()) {
            return;
        }

        foreach ($lessonPlans as $index => $lessonPlan) {
            $activityIndex = $index % count(self::ACTIVITIES);
            $activity = self::ACTIVITIES[$activityIndex];
            $sessionNum = $lessonPlan->session_number - 1;
            $scoreIndex = min($sessionNum, count($activity['scores']) - 1);
            $score = $activity['scores'][$scoreIndex];

            $observation = $score >= 80
                ? 'Anak mampu menyelesaikan aktivitas dengan sangat baik tanpa bantuan.'
                : ($score >= 65
                    ? 'Anak mampu menyelesaikan aktivitas dengan bantuan minimal.'
                    : 'Anak masih membutuhkan bimbingan penuh dalam menyelesaikan aktivitas.');

            LessonActivity::create([
                'lesson_plan_id' => $lessonPlan->id,
                'activity_name' => $activity['name'],
                'objective' => $activity['objective'],
                'score' => $score,
                'observation' => $observation,
            ]);
        }
    }
}