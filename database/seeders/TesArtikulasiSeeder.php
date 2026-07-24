<?php

namespace Database\Seeders;

use App\Models\LessonPlan;
use App\Models\Report;
use Illuminate\Database\Seeder;

class TesArtikulasiSeeder extends Seeder
{
    public function run(): void
    {
        // Get the last completed lesson plan per patient
        $patients = \App\Models\Patient::all();

        if ($patients->isEmpty()) {
            return;
        }

        foreach ($patients as $patient) {
            $lastLesson = LessonPlan::where('patient_id', $patient->id)
                ->where('status', 'completed')
                ->orderByDesc('session_date')
                ->first();

            if (!$lastLesson) {
                continue;
            }

            Report::create([
                'patient_id' => $patient->id,
                'therapist_id' => $patient->therapist_id,
                'session_date' => $lastLesson->session_date,
                'summary' => 'Hasil tes artikulasi menunjukkan perkembangan yang positif. Anak mampu mengucapkan sebagian besar bunyi dengan jelas. Beberapa bunyi masih memerlukan latihan lanjutan untuk mencapai konsistensi yang optimal.',
                'progress' => rand(60, 85),
            ]);
        }
    }
}