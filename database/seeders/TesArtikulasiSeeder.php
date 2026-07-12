<?php

namespace Database\Seeders;

use App\Models\LessonPlan;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class TesArtikulasiSeeder extends Seeder
{
    public function run(): void
    {
        $lessonPlan = LessonPlan::first();
        if (!$lessonPlan) {
            return;
        }

        $therapist = User::where('role', 'praktisi_avt')->first();
        if (!$therapist) {
            return;
        }

        // Tabel `tes_artikulasi` (model Report):
        // patient_id, therapist_id, session_date, summary
        Report::updateOrCreate(
            [
                'patient_id' => $lessonPlan->patient_id,
                'therapist_id' => $therapist->id,
            ],
            [
                'session_date' => now()->toDateString(),
                'summary' => 'Hasil tes artikulasi: Ananda mampu mengucapkan beberapa bunyi dengan cukup jelas. Perlu latihan bertahap untuk meningkatkan konsistensi pengucapan, terutama saat menyambungkan bunyi dalam rangkaian kata.',
            ]
        );
    }
}