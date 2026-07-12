<?php

namespace App\Http\Controllers\Praktisi;

use App\Http\Controllers\Controller;
use App\Models\LessonPlan;
use App\Models\Patient;
use App\Models\Report;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $therapistId = Auth::id();

        // Ringkasan pasien
        $totalPatientsQuery = Patient::query()->where('therapist_id', $therapistId);
        $totalPatients = (clone $totalPatientsQuery)->count();

        $activePatients = (clone $totalPatientsQuery)
            ->where('status', 'aktif')
            ->count();

        $inTherapyPatients = (clone $totalPatientsQuery)
            ->where('status', 'dalam_terapi')
            ->count();

        $averageProgress = (clone $totalPatientsQuery)->avg('progress');

        $progressRate = $averageProgress !== null
            ? round((float) $averageProgress, 1)
            : 0;

        // Ringkasan lesson plan
        // Catatan: jika tabel lesson_plans belum ada, gunakan fallback 0.
        try {
            $lessonPlansCount = LessonPlan::query()
                ->where('therapist_id', $therapistId)
                ->count();

            $todayLessonPlansCount = LessonPlan::query()
                ->where('therapist_id', $therapistId)
                ->whereDate('session_date', now()->toDateString())
                ->count();
        } catch (\Throwable $e) {
            $lessonPlansCount = 0;
            $todayLessonPlansCount = 0;
        }

        // Ringkasan tes artikulasi
        $reportsQuery = Report::query()->where('therapist_id', $therapistId);
        $reportsTotal = (clone $reportsQuery)->count();
        $reportsToday = (clone $reportsQuery)
            ->whereDate('session_date', now()->toDateString())
            ->count();

        // Next Lesson Plan (based on nearest upcoming Schedule)
        $now = now();
        $today = $now->toDateString();
        $currentTime = $now->format('H:i:s');

        $nextSchedule = Schedule::query()
            ->where('therapist_id', $therapistId)
            ->with([
                'patient',
                'therapist',
                'lessonPlan',
            ])
            ->where(function ($query) use ($today, $currentTime) {
                $query->where('schedule_date', '>', $today)
                    ->orWhere(function ($q) use ($today, $currentTime) {
                        $q->where('schedule_date', '=', $today)
                            ->where('schedule_time', '>=', $currentTime);
                    });
            })
            ->orderBy('schedule_date', 'asc')
            ->orderBy('schedule_time', 'asc')
            ->first();

        $nextLessonPlan = null;

        if ($nextSchedule) {
            $nextLessonPlan = [
                'schedule' => [
                    'id' => (int) $nextSchedule->id,
                    'date' => $nextSchedule->schedule_date,
                    'time' => $nextSchedule->schedule_time,
                    'status' => $nextSchedule->status,
                    'notes' => $nextSchedule->notes,
                    'patient' => $nextSchedule->patient ? [
                        'id' => (int) $nextSchedule->patient->id,
                        'name' => $nextSchedule->patient->name,
                        'photo' => $nextSchedule->patient->photo ?? null,
                    ] : null,
                    'therapist' => $nextSchedule->therapist ? [
                        'id' => (int) $nextSchedule->therapist->id,
                        'name' => $nextSchedule->therapist->name ?? null,
                    ] : null,
                ],
                'lessonPlan' => $nextSchedule->lessonPlan ? [
                    'id' => (int) $nextSchedule->lessonPlan->id,
                    'patient_id' => (int) $nextSchedule->lessonPlan->patient_id,
                    'schedule_id' => (int) $nextSchedule->lessonPlan->schedule_id,
                    'therapist_id' => (int) $nextSchedule->lessonPlan->therapist_id,
                    'session_date' => $nextSchedule->lessonPlan->session_date,
                    'session_number' => (int) $nextSchedule->lessonPlan->session_number,
                    'long_term_goal' => $nextSchedule->lessonPlan->long_term_goal,
                    'short_term_goal' => $nextSchedule->lessonPlan->short_term_goal,
                    'home_program' => $nextSchedule->lessonPlan->home_program,
                    'therapist_note' => $nextSchedule->lessonPlan->therapist_note,
                    'status' => $nextSchedule->lessonPlan->status,
                ] : null,
                'lesson_plan_pending' => $nextSchedule->lessonPlan === null,
            ];
        }

        // Next: tampilkan pasien terdekat berdasarkan tanggal lesson plan / report terakhir (proxy)
        // Karena tabel jadwal/sesi belum ada di backend saat ini.
        $upcomingPatients = Patient::query()
            ->where('therapist_id', $therapistId)
            ->orderBy('updated_at', 'desc')
            ->with('parent')
            ->limit(5)
            ->get(['id', 'name', 'photo', 'status', 'progress', 'birth_date', 'parent_id']);

        $upcoming = $upcomingPatients->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'photo' => $p->photo,
                'status' => $p->status,
                'progress' => (int) ($p->progress ?? 0),
                'eta' => '—',
                'parent_name' => $p->parent?->name,
            ];
        });

        return Inertia::render('Praktisi/Dashboard/Dashboard', [
            'summary' => [
                'totalPatients' => $totalPatients,
                'activePatients' => $activePatients,
                'inTherapyPatients' => $inTherapyPatients,
                'progressRate' => $progressRate,
                'lessonPlansTotal' => $lessonPlansCount,
                'lessonPlansToday' => $todayLessonPlansCount,
                'reportsTotal' => $reportsTotal,
                'reportsToday' => $reportsToday,
            ],
            'nextLessonPlan' => $nextLessonPlan,
            'upcoming' => $upcoming,
        ]);
    }
}