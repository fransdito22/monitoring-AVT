<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ParentSeeder::class,
            PatientSeeder::class,

            // Seeding tabel relasi (urutan sesuai FK)
            ScheduleSeeder::class,
            LessonPlanSeeder::class,
            LessonActivitySeeder::class,
            LessonEvaluationSeeder::class,
            LingSixSoundResultSeeder::class,
            TesArtikulasiSeeder::class,
            TesArtikulasiDetailSeeder::class,
            TherapyProgressReportSeeder::class,
        ]);
    }
}