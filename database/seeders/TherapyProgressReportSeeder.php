<?php

namespace Database\Seeders;

use App\Models\LessonPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TherapyProgressReportSeeder extends Seeder
{
    private const SESSION_SUMMARIES = [
        'Pertemuan terapi berjalan dengan lancar. Anak mulai mengenali beberapa suara dasar namun masih membutuhkan bantuan penuh dalam merespons stimulus.',
        'Sesi terapi menunjukkan peningkatan. Anak mulai merespons instruksi sederhana dengan lebih konsisten dibanding sesi sebelumnya.',
        'Perkembangan signifikan terlihat hari ini. Anak mampu mengidentifikasi sebagian besar bunyi Ling Six Sound dan mulai berkomunikasi lebih aktif.',
        'Anak menunjukkan antusiasme tinggi selama sesi. Kemampuan mengikuti instruksi 2 langkah mulai terbentuk dengan bantuan minimal.',
        'Progress yang stabil terlihat pada sesi ini. Anak mampu menyelesaikan tugas terapi dengan lebih mandiri.',
        'Sesi berlangsung efektif. Fokus dan perhatian anak meningkat, mampu mengikuti seluruh rangkaian aktivitas dengan baik.',
    ];

    private const ACHIEVEMENTS = [
        'Anak mampu merespons 4 dari 6 bunyi Ling Six Sound dengan benar.',
        'Anak mampu mengikuti instruksi satu langkah secara konsisten.',
        'Anak mampu menirukan kata sederhana dengan artikulasi yang cukup jelas.',
        'Anak mampu menyebutkan 3 nama benda di sekitarnya.',
        'Anak mampu membedakan bunyi lingkungan seperti bel pintu dan telepon.',
        'Anak mampu merespons pertanyaan "apa" dan "siapa" dengan tepat.',
    ];

    private const DIFFICULTIES = [
        'Masih terdapat kesulitan pada bunyi /s/ dan /sh/ yang perlu latihan lanjutan.',
        'Konsentrasi anak mudah teralihkan oleh suara di sekitar.',
        'Anak masih kesulitan dalam mengucapkan kata dengan 3 suku kata.',
        'Perlu penguatan pada kemampuan diskriminasi bunyi yang mirip.',
        'Anak masih membutuhkan bantuan visual untuk mengikuti instruksi.',
        'Transisi antar aktivitas masih memerlukan arahan dari terapis.',
    ];

    private const CHILD_RESPONSES = [
        'Anak merespons dengan baik ketika instruksi disampaikan dengan jelas dan perlahan.',
        'Anak menunjukkan respons positif terhadap pendekatan bermain dalam terapi.',
        'Anak kooperatif dan mau mengikuti seluruh rangkaian aktivitas yang diberikan.',
        'Anak sesekali menunjukkan inisiatif untuk bertanya menggunakan kata sederhana.',
        'Anak lebih percaya diri dalam merespons stimulus tanpa bantuan terapis.',
        'Anak mampu mempertahankan kontak mata selama sesi terapi berlangsung.',
    ];

    private const PARENT_RECOMMENDATIONS = [
        'Orang tua disarankan melatih Ling Six Sound selama 15 menit setiap hari di rumah.',
        'Bacakan buku cerita bergambar setiap malam untuk merangsang perkembangan bahasa.',
        'Ajak anak berbicara selama aktivitas sehari-hari seperti mandi dan makan.',
        'Latih anak untuk merespons panggilan dan suara lingkungan di rumah.',
        'Berikan pujian saat anak berusaha berkomunikasi secara verbal.',
        'Catat perkembangan anak di rumah untuk dibahas pada sesi berikutnya.',
    ];

    private const HOME_ACTIVITIES = [
        'Latihan Ling Six Sound 15 menit dan bermain kartu bergambar.',
        'Membacakan buku cerita dan menirukan suara binatang.',
        'Bermain tebak-tebakan bunyi dan menyebutkan nama benda.',
        'Latihan instruksi sederhana seperti "ambil bola" dan "taruh di meja".',
        'Menyanyi lagu anak-anak sambil menunjuk gambar.',
        'Latihan pengucapan kata melalui permainan kartu kata.',
    ];

    private const NEXT_SESSION_GOALS = [
        'Memperkuat deteksi bunyi Ling Six Sound terutama /s/ dan /sh/.',
        'Melatih kemampuan mengikuti instruksi 2 langkah secara mandiri.',
        'Meningkatkan kosakata ekspresif menjadi 10 kata baru.',
        'Melatih diskriminasi bunyi yang mirip seperti /b/ dan /p/.',
        'Mengembangkan kemampuan menjawab pertanyaan "mengapa" sederhana.',
        'Melatih artikulasi kata dengan 3 suku kata.',
    ];

    public function run(): void
    {
        $lessonPlans = LessonPlan::where('status', 'completed')
            ->orderBy('session_date')
            ->get();

        if ($lessonPlans->isEmpty()) {
            return;
        }

        foreach ($lessonPlans as $index => $lessonPlan) {
            $narrationIndex = $index % count(self::SESSION_SUMMARIES);

            DB::table('therapy_progress_reports')->insert([
                'lesson_plan_id' => $lessonPlan->id,
                'session_summary' => self::SESSION_SUMMARIES[$narrationIndex],
                'child_achievements' => self::ACHIEVEMENTS[$narrationIndex],
                'difficulties' => self::DIFFICULTIES[$narrationIndex],
                'child_response' => self::CHILD_RESPONSES[$narrationIndex],
                'parent_recommendations' => self::PARENT_RECOMMENDATIONS[$narrationIndex],
                'home_activities' => self::HOME_ACTIVITIES[$narrationIndex],
                'goals_for_next_session' => self::NEXT_SESSION_GOALS[$narrationIndex],
                'status' => 'completed',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}