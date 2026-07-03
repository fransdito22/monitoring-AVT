<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\LessonActivity;
use App\Models\LessonEvaluation;
use App\Models\LessonPlan;
use App\Models\Patient;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TherapyScheduleController extends Controller
{
    public function index(Request $request)
    {
        $parentId = Auth::id();

        $primaryChild = Patient::query()
            ->where('parent_id', $parentId)
            ->orderByDesc('updated_at')
            ->first(['id', 'name']);

        if (!$primaryChild) {
            return Inertia::render('OrangTua/Jadwal', [
                'sessions' => [],
            ]);
        }

        $sessions = Schedule::query()
            ->where('patient_id', $primaryChild->id)
            ->with([
                'therapist:id,name',
                'lessonPlan' => function ($q) {
                    $q->select([
                        'id',
                        'schedule_id',
                        'patient_id',
                        'session_date',
                        'session_number',
                        'long_term_goal',
                        'short_term_goal',
                        'home_program',
                        'therapist_note',
                    ])->with([
                        'activities:id,lesson_plan_id,activity_name,objective,score,observation',
                        'evaluation:id,lesson_plan_id,listening,speech,language,attention,recommendation',
                    ]);
                },
            ])
            ->orderBy('schedule_date', 'asc')
            ->orderBy('schedule_time', 'asc')
            ->get()
            ->map(function (Schedule $schedule) {
                $lessonPlan = $schedule->lessonPlan;

                $status = match ($schedule->status) {
                    // Practical mapping (backend values)
                    'completed' => 'Completed',
                    'cancelled' => 'Cancelled',
                    'approved' => 'Completed',
                    'draft' => 'Cancelled',
                    default => 'Upcoming',
                };

                $activities = $lessonPlan?->activities
                    ? $lessonPlan->activities->map(function (LessonActivity $a) {
                        return [
                            'name' => $a->activity_name,
                            'objective' => $a->objective,
                            'score' => $a->score,
                            'observation' => $a->observation,
                        ];
                    })->values()->all()
                    : [];

                $evaluation = $lessonPlan?->evaluation ? [
                    'listening' => $lessonPlan->evaluation->listening,
                    'speech' => $lessonPlan->evaluation->speech,
                    'language' => $lessonPlan->evaluation->language,
                    'attention' => $lessonPlan->evaluation->attention,
                    'recommendation' => $lessonPlan->evaluation->recommendation,
                ] : null;

                $time = $schedule->schedule_time;

                return [
                    'id' => (string) $schedule->id,
                    'therapyTitle' => 'Therapy Session',
                    'date' => optional($schedule->schedule_date)->format('Y-m-d') ?? null,
                    'time' => $time,
                    'therapistName' => $schedule->therapist?->name ?? 'Terapis belum ditentukan',
                    'status' => $status,
                    'therapyLocation' => 'Online Meeting',
                    'sessionObjectives' => [
                        'longTermGoal' => $lessonPlan?->long_term_goal,
                        'shortTermGoal' => $lessonPlan?->short_term_goal,
                        'homeProgram' => $lessonPlan?->home_program,
                    ],
                    'plannedActivities' => $activities,
                    'notesForParents' => $lessonPlan?->therapist_note ?? $schedule->notes,
                    'currentStatus' => $status,
                    'evaluation' => $evaluation,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('OrangTua/Jadwal', [
            'sessions' => $sessions,
        ]);
    }
}