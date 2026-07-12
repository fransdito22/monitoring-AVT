<?php

namespace Database\Seeders;

use App\Models\LessonPlan;
use App\Models\Patient;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class LessonPlanSeeder extends Seeder
{
    public function run(): void
    {
        $patient = Patient::first();
        if (!$patient) {
            return;
        }

        LessonPlan::updateOrCreate(
            [
                'patient_id' => $patient->id,
            ],
            [
                'schedule_id' => null,
                'session_date' => Carbon::today()->toDateString(),
                'session_number' => 1,

                // Skema goal setelah rangkaian migration:
                // - goal -> long_term_goal
                // - short_term_goal nullable
                'long_term_goal' => 'Meningkatkan kemampuan pemahaman instruksi sederhana dan konsistensi perhatian selama aktivitas terapi.',
                'short_term_goal' => 'Ananda mampu mengikuti minimal 3 instruksi sederhana bertahap dengan jeda bantuan yang berkurang setiap sesi.',

                'home_program' => 'Latihan 10 menit setiap hari: ikuti instruksi sederhana (“duduk”, “ambil”, “taruh”) sambil menunjukkan gambar.',
                'therapist_note' => 'Ananda menunjukkan respons baik saat diberi petunjuk visual; perlu variasi aktivitas agar perhatian tetap terjaga.',
                'status' => 'draft',
            ]
        );
    }
}