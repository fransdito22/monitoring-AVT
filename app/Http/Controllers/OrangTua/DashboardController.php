<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\LessonPlan;
use App\Models\Patient;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $parentId = Auth::id();

        $primaryChild = Patient::query()
            ->where('parent_id', $parentId)
            ->with([
                'parent:id,name',
                'therapist:id,name',
            ])
            ->orderByDesc('updated_at')
            ->first();

        if (!$primaryChild) {
            return Inertia::render('OrangTua/Orangtua', [
                'childProfile' => null,
                'statistics' => null,
                'currentGoal' => null,
                'nextSchedule' => null,
                'recentLessons' => [],
                'progressChart' => [],
                'lingSixSounds' => [],
                'homePrograms' => [],
            ]);
        }

        $birthDate = $primaryChild->birth_date
            ? Carbon::parse($primaryChild->birth_date)
            : null;

        // Therapist name fallback:
        // - Prefer therapist from active in_progress schedule (latest)
        // - If none, use the therapist from latest lesson plan (latest schedule therapist)
        $activeInProgressLessonPlan = LessonPlan::query()
            ->where('patient_id', $primaryChild->id)
            ->whereHas('schedule', fn($q) => $q->where('status', 'in_progress'))
            ->with(['schedule.therapist:id,name'])
            ->orderByDesc('session_date')
            ->orderByDesc('created_at')
            ->first();

        $childProfileTherapistName = $primaryChild->therapist?->name
            ?? ($activeInProgressLessonPlan?->schedule?->therapist?->name);

        $childProfile = [
            'id' => (string) $primaryChild->id,
            'name' => $primaryChild->name,
            'gender' => $primaryChild->gender,
            'therapyStatus' => $primaryChild->status ?? 'Unknown',
            'photoUrl' => $primaryChild->photo ?? null,
            'parentName' => $primaryChild->parent?->name,
            'therapistName' => $childProfileTherapistName,
        ];

        $lessonPlans = LessonPlan::query()
            ->where('patient_id', $primaryChild->id)
            ->with([
                'evaluation',
                'lingSixSounds',
                'activities',
                'schedule' => function ($q) {
                    $q->with('therapist:id,name');
                },
            ])
            ->orderBy('session_date')
            ->orderBy('created_at')
            ->get();

        // Progress chart from LessonEvaluation:
        // average(listening,speech,language,attention) => 0..100
        $progressChart = $lessonPlans
            ->filter(fn($lp) => $lp->evaluation)
            ->sortBy(function ($lp) {
                return $lp->session_date
                    ? $lp->session_date->toDateString()
                    : '9999-12-31';
            })
            ->map(function (LessonPlan $lp, int $idx) {
                $e = $lp->evaluation;

                $values = [
                    $e?->listening,
                    $e?->speech,
                    $e?->language,
                    $e?->attention,
                ];

                $numeric = array_values(array_filter($values, fn($v) => is_numeric($v)));

                if (count($numeric) === 0) {
                    $progress = 0;
                } else {
                    $avg = array_sum($numeric) / count($numeric);
                    $progress = (int) round(max(0, min(100, (float) $avg)));
                }

                $date = optional($lp->session_date)->format('Y-m-d');
                if (!$date) {
                    $date = $lp->created_at
                        ? optional($lp->created_at)->format('Y-m-d')
                        : null;
                }

                return [
                    'session' => 'S' . ($lp->session_number ?? ($idx + 1)),
                    'progress' => $progress,
                    'date' => optional($lp->session_date)->format('Y-m-d'),
                ];
            })
            ->values()
            ->all();

        $progressPercentLatest = 0;
        if (count($progressChart) > 0) {
            $progressPercentLatest = (int) ($progressChart[count($progressChart) - 1]['progress'] ?? 0);
        }

        // Statistics for StatisticCards
        $totalLessonPlan = $lessonPlans->count();
        $totalTesArtikulasi = $lessonPlans
            ->flatMap(fn($lp) => $lp->lingSixSounds ?? collect())
            ->count();
        $totalPertemuan = $totalLessonPlan;

        $statistics = [
            'totalLessonPlan' => $totalLessonPlan,
            'totalTesArtikulasi' => $totalTesArtikulasi,
            'totalPertemuan' => $totalPertemuan,
            'progressPercent' => $progressPercentLatest,
        ];

        // Current therapy goal (LessonPlan) with fallback rules:
        // 1) schedule.status = in_progress
        // 2) fallback latest session_date desc (or created_at desc)
        $currentGoalLessonPlan = LessonPlan::query()
            ->where('patient_id', $primaryChild->id)
            ->whereHas('schedule', fn($q) => $q->where('status', 'in_progress'))
            ->with(['schedule.therapist'])
            ->orderByDesc('session_date')
            ->orderByDesc('created_at')
            ->first();

        if (!$currentGoalLessonPlan) {
            $currentGoalLessonPlan = LessonPlan::query()
                ->where('patient_id', $primaryChild->id)
                ->with(['schedule.therapist'])
                ->orderByDesc('session_date')
                ->orderByDesc('created_at')
                ->first();
        }

        $currentGoal = null;
        $homePrograms = [];

        if ($currentGoalLessonPlan) {
            $homeProgram = $currentGoalLessonPlan->home_program ?? [];
            $homePrograms = is_array($homeProgram) ? $homeProgram : [];

            $currentGoal = [
                'title' => $currentGoalLessonPlan->long_term_goal ?: 'Target Terapi',
                'description' => $currentGoalLessonPlan->short_term_goal ?: '',
                'completion' => null,
                'long_term_goal' => $currentGoalLessonPlan->long_term_goal,
                'short_term_goal' => $currentGoalLessonPlan->short_term_goal,
            ];
        }

        // Next therapy schedule (scheduled, not in_progress)
        $nextSchedule = Schedule::query()
            ->where('patient_id', $primaryChild->id)
            ->where('status', 'scheduled')
            ->whereDate('schedule_date', '>=', now()->toDateString())
            ->with('therapist:id,name')
            ->orderBy('schedule_date')
            ->orderBy('schedule_time')
            ->first();

        $nextSchedulePayload = null;

        // Fallback therapist from lesson plan latest if schedule has no therapist
        $latestLessonPlanWithSchedule = LessonPlan::query()
            ->where('patient_id', $primaryChild->id)
            ->with(['schedule.therapist:id,name', 'schedule'])
            ->orderByDesc('session_date')
            ->orderByDesc('created_at')
            ->first();

        if ($nextSchedule) {
            $fallbackTherapistName = $latestLessonPlanWithSchedule?->schedule?->therapist?->name;

            $nextSchedulePayload = [
                'id' => (string) $nextSchedule->id,
                'date' => optional($nextSchedule->schedule_date)->format('Y-m-d'),
                'time' => optional($nextSchedule->schedule_time)->format('H:i'),
                'therapist' => $nextSchedule->therapist?->name ?? $fallbackTherapistName,
                'lokasi' => $nextSchedule->notes ?? null,
                // Extend payload for UI fields
                'sessionNumber' => (string) ($nextSchedule->lessonPlan?->session_number ?? null),
                'status' => $nextSchedule->status ?? null,
            ];
        } else {
            // If no "scheduled" future schedule exists, keep nextSchedule null.
            // Frontend will render "Belum ada jadwal terapi berikutnya".
        }

        // Recent therapy history (max 5)
        $recentLessons = LessonPlan::query()
            ->where('patient_id', $primaryChild->id)
            ->with(['evaluation', 'lingSixSounds', 'activities', 'schedule'])
            ->orderByDesc('session_date')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->values()
            ->all();

        // Ling Six Sound chart expects lessonPlans with lingSixSounds
        $lessonPlansForLingSix = $lessonPlans
            ->sortBy(function ($lp) {
                return $lp->session_date
                    ? $lp->session_date->toDateString()
                    : '9999-12-31';
            })
            ->values()
            ->all();

        return Inertia::render('OrangTua/Dashboard/index', [
            'childProfile' => $childProfile,
            'statistics' => $statistics,
            'currentGoal' => $currentGoal,
            'nextSchedule' => $nextSchedulePayload,
        ]);
    }
}