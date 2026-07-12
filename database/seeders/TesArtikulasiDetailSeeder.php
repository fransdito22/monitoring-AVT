<?php

namespace Database\Seeders;

use App\Models\ReportDetail;
use App\Models\Report;
use App\Models\LessonPlan;
use Illuminate\Database\Seeder;

class TesArtikulasiDetailSeeder extends Seeder
{
    public function run(): void
    {
        $lessonPlan = LessonPlan::first();
        if (!$lessonPlan) {
            return;
        }

        // Model `Report` = tabel `tes_artikulasi`
        $report = Report::first();
        // Jika kolom lesson_plan_id tidak ada (berdasarkan migration),
        // fallback ambil report pertama.
        // (Seeder ini hanya butuh 1 data, jadi cukup aman.)
        if (!$report) {
            return;
        }

        ReportDetail::updateOrCreate(
            [
                'report_id' => $report->id,
            ],
            [
                'target_word' => 'sapu',
                'target_phoneme' => 's',
                'category' => 'Normal',
                'note' => 'Ananda mengucapkan kata target dengan jelas pada sebagian besar percobaan.',
            ]
        );
    }
}