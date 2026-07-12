<?php

namespace Database\Seeders;

use App\Models\LessonPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TherapyProgressReportSeeder extends Seeder
{
    public function run(): void
    {
        $lessonPlan = LessonPlan::first();
        if (!$lessonPlan) {
            return;
        }

        DB::table('therapy_progress_reports')->updateOrInsert(
            [
                'lesson_plan_id' => $lessonPlan->id,
            ],
            [
                'session_summary' => 'Pertemuan terapi berjalan dengan lancar. Ananda menunjukkan peningkatan pada fokus selama kegiatan inti dan mampu mengikuti instruksi terapis dengan lebih konsisten.',
                'child_achievements' => 'Ananda mampu menyelesaikan sebagian besar tugas terapi sesuai target sesi, serta menunjukkan kemajuan dalam merespons stimulasi yang diberikan.',
                'difficulties' => 'Masih terdapat kesulitan ketika tugas membutuhkan perpindahan perhatian cepat, terutama saat perubahan stimulus terjadi.',
                'child_response' => 'Ananda merespons dengan baik ketika instruksi disampaikan secara jelas dan menggunakan contoh visual sederhana.',
                'parent_recommendations' => 'Orang tua disarankan memberikan dukungan rutin di rumah melalui latihan singkat dan terjadwal agar kemajuan yang didapat tidak berhenti setelah sesi terapi.',
                'home_activities' => 'Latihan di rumah: membaca/menirukan bunyi secara bertahap, melakukan aktivitas singkat 10–15 menit, dan mencatat respons ananda.',
                'goals_for_next_session' => 'Memperkuat kemampuan transisi antar tugas, meningkatkan konsistensi respons terhadap stimulus, serta melatih keterampilan sesuai tujuan jangka pendek.',
                'status' => 'draft',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}