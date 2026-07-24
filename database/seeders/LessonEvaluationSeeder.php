<?php

namespace Database\Seeders;

use App\Models\LessonEvaluation;
use App\Models\LessonPlan;
use Illuminate\Database\Seeder;

class LessonEvaluationSeeder extends Seeder
{
    /**
     * Progressive evaluation data per session number (1-indexed).
     * Sesekali turun 1-2 poin agar grafik terlihat alami.
     */
    private const EVALUATIONS = [
        1 => ['listening' => 30, 'speech' => 25, 'language' => 20, 'attention' => 35],
        2 => ['listening' => 35, 'speech' => 30, 'language' => 26, 'attention' => 40],
        3 => ['listening' => 42, 'speech' => 36, 'language' => 34, 'attention' => 47],
        4 => ['listening' => 50, 'speech' => 45, 'language' => 42, 'attention' => 55],
        5 => ['listening' => 58, 'speech' => 53, 'language' => 50, 'attention' => 63],
        6 => ['listening' => 66, 'speech' => 60, 'language' => 58, 'attention' => 70],
        7 => ['listening' => 74, 'speech' => 68, 'language' => 66, 'attention' => 78],
        8 => ['listening' => 82, 'speech' => 76, 'language' => 74, 'attention' => 86],
    ];

    private const RECOMMENDATIONS = [
        'Fokus pada penguatan deteksi bunyi dasar melalui permainan interaktif.',
        'Latih instruksi 2 langkah secara bertahap dengan pengulangan yang konsisten.',
        'Perbanyak stimulasi bahasa ekspresif melalui tanya jawab sederhana.',
        'Tingkatkan durasi terapi secara perlahan untuk melatih konsentrasi.',
        'Gunakan variasi media terapi agar anak tetap antusias selama sesi.',
        'Latihan home program perlu ditingkatkan intensitasnya menjadi 20 menit per hari.',
        'Fokus pada pengucapan kata dengan artikulasi yang lebih jelas.',
        'Pertahankan konsistensi terapi untuk memaksimalkan hasil perkembangan.',
    ];

    public function run(): void
    {
        $lessonPlans = LessonPlan::orderBy('session_date')->get();

        if ($lessonPlans->isEmpty()) {
            return;
        }

        foreach ($lessonPlans as $index => $lessonPlan) {
            $sessionNum = $lessonPlan->session_number;
            $sessionNum = min($sessionNum, count(self::EVALUATIONS));

            $evaluation = self::EVALUATIONS[$sessionNum];

            // Sesekali turun 1-2 poin agar natural
            $dip = ($index % 3 === 0) ? rand(1, 2) : 0;

            LessonEvaluation::create([
                'lesson_plan_id' => $lessonPlan->id,
                'listening' => max(20, $evaluation['listening'] - $dip),
                'speech' => max(20, $evaluation['speech'] - $dip),
                'language' => max(15, $evaluation['language'] - $dip),
                'attention' => max(30, $evaluation['attention'] - $dip),
                'recommendation' => self::RECOMMENDATIONS[$sessionNum % count(self::RECOMMENDATIONS)],
            ]);
        }
    }
}