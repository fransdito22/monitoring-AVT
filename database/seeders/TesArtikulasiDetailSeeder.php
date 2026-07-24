<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\ReportDetail;
use Illuminate\Database\Seeder;

class TesArtikulasiDetailSeeder extends Seeder
{
    private const DETAILS = [
        ['target_word' => 'sapu', 'target_phoneme' => 's', 'category' => 'Normal'],
        ['target_word' => 'mata', 'target_phoneme' => 'm', 'category' => 'Normal'],
        ['target_word' => 'buku', 'target_phoneme' => 'b', 'category' => 'Normal'],
        ['target_word' => 'rumah', 'target_phoneme' => 'r', 'category' => 'Substitusi'],
        ['target_word' => 'kaki', 'target_phoneme' => 'k', 'category' => 'Normal'],
        ['target_word' => 'tali', 'target_phoneme' => 't', 'category' => 'Omisi'],
        ['target_word' => 'dadu', 'target_phoneme' => 'd', 'category' => 'Normal'],
        ['target_word' => 'pita', 'target_phoneme' => 'p', 'category' => 'Normal'],
    ];

    public function run(): void
    {
        $reports = Report::all();

        if ($reports->isEmpty()) {
            return;
        }

        foreach ($reports as $reportIndex => $report) {
            // Each report gets 2-3 details
            $numDetails = ($reportIndex % 2 === 0) ? 3 : 2;
            $startIndex = ($reportIndex * 2) % count(self::DETAILS);

            for ($i = 0; $i < $numDetails; $i++) {
                $detailIndex = ($startIndex + $i) % count(self::DETAILS);
                $detail = self::DETAILS[$detailIndex];

                $note = $detail['category'] === 'Normal'
                    ? 'Anak mengucapkan kata target dengan jelas pada sebagian besar percobaan.'
                    : 'Anak masih kesulitan mengucapkan fonem target dengan tepat. Perlu latihan lanjutan.';

                ReportDetail::create([
                    'report_id' => $report->id,
                    'target_word' => $detail['target_word'],
                    'target_phoneme' => $detail['target_phoneme'],
                    'category' => $detail['category'],
                    'note' => $note,
                ]);
            }
        }
    }
}