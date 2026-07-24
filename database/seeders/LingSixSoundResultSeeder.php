<?php

namespace Database\Seeders;

use App\Models\LessonPlan;
use App\Models\LingSixSoundResult;
use Illuminate\Database\Seeder;

class LingSixSoundResultSeeder extends Seeder
{
    /**
     * Progressive Ling Six Sound levels per session.
     * Level mapping:
     * 0 = NR (Not Responded/Not detected)
     * 1 = Detection
     * 2 = Discriminated
     * 3 = Identification
     * 4 = Correct Response (Comprehended)
     */
    private const SOUNDS = ['m', 'a', 'u', 'i', 's', 'sh'];

    private const LEVEL_PROGRESSION = [
        // Session => [m, a, u, i, s, sh]
        1 => [1, 1, 0, 1, 0, 0],
        2 => [3, 3, 1, 3, 1, 1],
        3 => [4, 4, 3, 4, 3, 3],
    ];

    private const NOTES = [
        'Anak merespons bunyi dengan cukup baik pada sesi ini.',
        'Kemampuan deteksi bunyi mulai konsisten.',
        'Anak mampu mengidentifikasi bunyi dengan benar.',
        'Respons terhadap bunyi sudah sangat baik dan konsisten.',
        'Anak masih perlu latihan untuk bunyi ini.',
        'Perkembangan positif terlihat pada bunyi ini.',
    ];

    public function run(): void
    {
        $lessonPlans = LessonPlan::where('status', 'completed')
            ->orderBy('session_date')
            ->get();

        if ($lessonPlans->isEmpty()) {
            return;
        }

        foreach ($lessonPlans as $lessonPlan) {
            $sessionNum = min($lessonPlan->session_number, 3);
            $levels = self::LEVEL_PROGRESSION[$sessionNum];

            foreach (self::SOUNDS as $soundIndex => $sound) {
                $baseLevel = $levels[$soundIndex];

                // For sessions beyond 3, continue progressing: earlier sounds reach 4,
                // later sounds gradually improve
                if ($lessonPlan->session_number > 3) {
                    $baseLevel = $this->getExtendedLevel($soundIndex, $lessonPlan->session_number);
                }

                // Small variation (+/- 0 or 1) but never below 0 or above 4
                $variation = ($lessonPlan->session_number % 2 === 0) ? rand(0, 1) : 0;
                $level = min(4, max(0, $baseLevel + ($variation === 1 && $baseLevel < 4 ? 1 : 0)));

                $noteIndex = ($soundIndex + $lessonPlan->session_number) % count(self::NOTES);

                LingSixSoundResult::create([
                    'lesson_plan_id' => $lessonPlan->id,
                    'sound' => $sound,
                    'level' => $level,
                    'note' => self::NOTES[$noteIndex],
                ]);
            }
        }
    }

    private function getExtendedLevel(int $soundIndex, int $sessionNumber): int
    {
        // By session 4-8, most sounds should be at level 4 (Correct Response)
        // Earlier sounds progress faster than later ones
        $extraSessions = $sessionNumber - 3;

        // First sounds (m, a) reach 4 quickly
        if ($soundIndex <= 1) {
            return min(4, 3 + $extraSessions);
        }

        // Middle sounds (u, i) progress steadily
        if ($soundIndex <= 3) {
            return min(4, 2 + $extraSessions);
        }

        // Last sounds (s, sh) catch up
        return min(4, 1 + $extraSessions);
    }
}