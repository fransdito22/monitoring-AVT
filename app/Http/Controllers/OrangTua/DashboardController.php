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

        $homeProgramCard = null;

        if ($currentGoalLessonPlan) {
            $currentGoal = [
                'title' => $currentGoalLessonPlan->long_term_goal ?: 'Target Terapi',
                'description' => $currentGoalLessonPlan->short_term_goal ?: '',
                'completion' => null,
                'long_term_goal' => $currentGoalLessonPlan->long_term_goal,
                'short_term_goal' => $currentGoalLessonPlan->short_term_goal,
            ];

            $homeProgramRaw = $currentGoalLessonPlan->home_program ?? [];
            $homeProgramItems = is_array($homeProgramRaw) ? $homeProgramRaw : [];

            $homeProgramCard = [
                'id' => (string) $currentGoalLessonPlan->id,
                'sessionDate' => $currentGoalLessonPlan->session_date
                    ? $currentGoalLessonPlan->session_date->format('Y-m-d')
                    : null,
                'sessionNumber' => (string) ($currentGoalLessonPlan->session_number ?? null),
                'homeProgramItems' => $homeProgramItems,
                'status' => $currentGoalLessonPlan->status ?? null,
            ];
        }

        // If there is no currentGoalLessonPlan, keep homeProgramCard as null.

        // Next therapy schedule (from Schedule Admin table)
        $nextSchedule = Schedule::query()
            ->with([
                'patient:id,name,photo',
                'therapist:id,name',
            ])
            ->where('patient_id', $primaryChild->id)
            ->whereIn('status', ['scheduled', 'pending', 'confirmed'])
            ->orderBy('schedule_date')
            ->orderBy('schedule_time')
            ->first();

        $nextSchedulePayload = null;

        if ($nextSchedule) {
            $nextSchedulePayload = [
                'id' => $nextSchedule->id,
                'schedule_date' => $nextSchedule->schedule_date,
                'schedule_time' => $nextSchedule->schedule_time,
                'end_time' => $nextSchedule->end_time,
                'status' => $nextSchedule->status,
                'notes' => $nextSchedule->notes,
                'patient' => [
                    'id' => $nextSchedule->patient?->id,
                    'name' => $nextSchedule->patient?->name,
                    'photo' => $nextSchedule->patient?->photo,
                ],
                'therapist' => [
                    'id' => $nextSchedule->therapist?->id,
                    'name' => $nextSchedule->therapist?->name,
                ],
                'session_number' => $nextSchedule->session_number,
                'location' => $nextSchedule->location ?? $nextSchedule->notes,
            ];
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

        logger()->info('Next Schedule', [
            'nextSchedule' => $nextSchedule?->toArray(),
        ]);

        return Inertia::render('OrangTua/Dashboard/index', [
            'childProfile' => $childProfile,
            'statistics' => $statistics,
            'currentGoal' => $currentGoal,
            'nextSchedule' => $nextSchedulePayload,
            'homeProgramCard' => $homeProgramCard,
        ]);
    }
}