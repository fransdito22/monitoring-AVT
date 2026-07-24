<?php

namespace Database\Seeders;

use App\Models\LessonPlan;
use App\Models\Schedule;
use Illuminate\Database\Seeder;

class LessonPlanSeeder extends Seeder
{
    private const LONG_TERM_GOALS = [
        'Meningkatkan kemampuan komunikasi verbal.',
        'Mengembangkan bahasa reseptif.',
        'Mengembangkan bahasa ekspresif.',
        'Meningkatkan diskriminasi bunyi.',
        'Meningkatkan kemampuan mendengar percakapan sederhana.',
    ];

    private const SHORT_TERM_GOALS = [
        'Mengenali Ling Six Sound.',
        'Mengikuti instruksi sederhana.',
        'Meniru kata sederhana.',
        'Menyebut nama benda.',
        'Menjawab pertanyaan sederhana.',
    ];

    private const HOME_PROGRAMS = [
        'Latihan Ling Six Sound selama 15 menit.',
        'Membacakan buku cerita setiap malam.',
        'Bermain kartu bergambar.',
        'Mengajak anak berbicara selama aktivitas sehari-hari.',
        'Melatih respon terhadap suara lingkungan.',
    ];

    private const THERAPIST_NOTES = [
        'Anak menunjukkan respons yang baik terhadap stimulus bunyi. Perlu latihan konsisten di rumah.',
        'Kemampuan mengikuti instruksi mulai meningkat. Anak lebih fokus dibanding sesi sebelumnya.',
        'Anak mulai mampu menirukan kata sederhana dengan bantuan visual. Progress positif.',
        'Konsentrasi anak masih perlu ditingkatkan. Namun respons terhadap Ling Six Sound mulai konsisten.',
        'Anak mampu menyebutkan nama benda dengan benar pada sebagian besar percobaan.',
        'Kemampuan diskriminasi bunyi menunjukkan peningkatan. Anak merespons dengan tepat.',
        'Anak lebih percaya diri dalam merespons pertanyaan sederhana. Terapi berjalan efektif.',
        'Perkembangan bahasa ekspresif terlihat. Anak mulai menggunakan 2 kata dalam satu kalimat.',
        'Instruksi bertahap membantu anak menyelesaikan tugas dengan lebih mandiri.',
        'Anak mampu mengidentifikasi 4 dari 6 bunyi Ling Six Sound dengan benar.',
        'Sesi hari ini difokuskan pada penguatan pemahaman instruksi kompleks. Hasil memuaskan.',
        'Anak mulai menunjukkan inisiatif berkomunikasi secara verbal tanpa diminta.',
        'Respon terhadap suara lingkungan semakin baik. Anak menoleh saat mendengar suara bel pintu.',
        'Latihan pengucapan kata menunjukkan konsistensi. Artikulasi bunyi /m/ dan /a/ sudah jelas.',
        'Kemampuan mendengar percakapan sederhana meningkat. Anak mampu mengikuti dialog singkat.',
        'Sesi berjalan lancar. Anak kooperatif dan antusias mengikuti setiap aktivitas.',
        'Perhatian anak terhadap instruksi 2 langkah mulai terbentuk. Perlu penguatan di rumah.',
        'Evaluasi akhir menunjukkan progress signifikan pada seluruh aspek yang ditargetkan.',
        'Anak siap melanjutkan ke tahap terapi berikutnya dengan target yang lebih kompleks.',
    ];

    public function run(): void
    {
        $completedSchedules = Schedule::whereIn('status', ['completed', 'in_progress'])
            ->orderBy('schedule_date')
            ->get();

        if ($completedSchedules->isEmpty()) {
            return;
        }

        $sessionCounter = [];

        foreach ($completedSchedules as $index => $schedule) {
            $patientId = $schedule->patient_id;

            if (!isset($sessionCounter[$patientId])) {
                $sessionCounter[$patientId] = 0;
            }
            $sessionCounter[$patientId]++;

            $sessionNumber = $sessionCounter[$patientId];
            $goalIndex = ($sessionNumber - 1) % count(self::LONG_TERM_GOALS);
            $shortGoalIndex = ($sessionNumber - 1) % count(self::SHORT_TERM_GOALS);
            $homeIndex = ($sessionNumber - 1) % count(self::HOME_PROGRAMS);
            $noteIndex = $index % count(self::THERAPIST_NOTES);

            LessonPlan::create([
                'patient_id' => $patientId,
                'schedule_id' => $schedule->id,
                'session_date' => $schedule->schedule_date,
                'session_number' => $sessionNumber,
                'long_term_goal' => self::LONG_TERM_GOALS[$goalIndex],
                'short_term_goal' => self::SHORT_TERM_GOALS[$shortGoalIndex],
                'home_program' => json_encode([self::HOME_PROGRAMS[$homeIndex]]),
                'therapist_note' => self::THERAPIST_NOTES[$noteIndex],
                'status' => $schedule->status === 'in_progress' ? 'draft' : 'completed',
            ]);
        }
    }
}