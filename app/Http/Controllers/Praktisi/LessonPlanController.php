<?php

namespace App\Http\Controllers\Praktisi;

use App\Models\LessonActivity;
use App\Models\LessonEvaluation;
use App\Models\LessonPlan;
use App\Models\LingSixSoundResult;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LessonPlanController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $therapistId = auth()->id();

        // Ambil semua sesi per pasien (diurutkan DESC)
        $patients = \App\Models\Patient::query()
            ->where('therapist_id', $therapistId)
            ->with(['lessonPlans' => function ($q) {
                $q->orderBy('session_date', 'desc')
                    ->orderBy('id', 'desc');
            }])
            ->get(['id', 'name', 'photo', 'status', 'progress', 'therapist_id']);

        // Flatten semua lesson plan agar bisa ditampilkan dalam list per pasien
        $lessonPlans = $patients
            ->flatMap(function ($patient) {
                return $patient->lessonPlans->map(function (\App\Models\LessonPlan $lp) use ($patient) {
                    return [
                        'id' => (int) $lp->id,
                        'session_date' => $lp->session_date,
                        'session_number' => $lp->session_number,
                        'long_term_goal' => $lp->long_term_goal,
                        'short_term_goal' => $lp->short_term_goal,
                        'home_program' => $lp->home_program,
                        'therapist_note' => $lp->therapist_note,
                        'patient' => [
                            'id' => $patient->id,
                            'name' => $patient->name,
                            'photo' => $patient->photo,
                            'status' => $patient->status,
                            'progress' => $patient->progress,
                        ],
                    ];
                });
            })
            ->values();

        return Inertia::render(
            'Praktisi/LessonPlans/Reports',
            [
                'lessonPlans' => $lessonPlans,
            ]
        );
    }

    public function show(LessonPlan $lessonPlan)
    {


        $therapistId = auth()->id();

        // Authorization berbasis therapist_id patient
        $lessonPlan->load(['patient', 'lingSixSounds', 'activities', 'evaluation']);

        if ($lessonPlan->patient?->therapist_id !== $therapistId) {

            abort(403, 'Forbidden: lesson plan patient therapist mismatch');
        }



        $patientId = $lessonPlan->patient_id;

        $patientLessonPlans = LessonPlan::query()
            ->where('patient_id', $patientId)
            ->with(['lingSixSounds', 'evaluation'])
            ->orderBy('session_date')
            ->orderBy('id')
            ->get();

        $lingChartData = $patientLessonPlans->map(function (LessonPlan $lp) {
            $lingItems = $lp->lingSixSounds ?? collect();
            $avg = $lingItems->count()
                ? round($lingItems->avg('level'), 2)
                : 0;

            return [
                'session' => 'Sesi ' . $lp->session_number,
                'avg_level' => $avg,
                'date' => $lp->session_date,
            ];
        })->values();

        $evaluationChartData = $patientLessonPlans->map(function (LessonPlan $lp) {
            return [
                'session' => 'Sesi ' . $lp->session_number,
                'listening' => (int) ($lp->evaluation->listening ?? 0),
                'speech' => (int) ($lp->evaluation->speech ?? 0),
                'language' => (int) ($lp->evaluation->language ?? 0),
                'attention' => (int) ($lp->evaluation->attention ?? 0),
                'date' => $lp->session_date,
            ];
        })->values();

        return Inertia::render(
            'Praktisi/LessonPlans/DetailReports',
            [
                'lessonPlan' => $lessonPlan,
                'lingChartData' => $lingChartData,
                'evaluationChartData' => $evaluationChartData,
            ]
        );
    }

    public function create()
    {
        $therapistId = auth()->id();

        $schedules = Schedule::query()
            ->with(['patient:id,name,photo,progress,status,therapist_id'])
            ->where('therapist_id', $therapistId)
            ->where('status', 'scheduled')
            ->whereDoesntHave('lessonPlan')
            ->orderBy('schedule_date')
            ->orderBy('schedule_time')
            ->get()
            ->map(function (Schedule $schedule) {
                return [
                    'id' => $schedule->id,
                    'schedule_date' => $schedule->schedule_date,
                    'schedule_time' => $schedule->schedule_time,
                    'status' => $schedule->status,
                    'notes' => $schedule->notes,
                    'patient' => [
                        'id' => $schedule->patient?->id,
                        'name' => $schedule->patient?->name,
                        'photo' => $schedule->patient?->photo,
                        'progress' => $schedule->patient?->progress,
                        'status' => $schedule->patient?->status,
                        'therapist_id' => $schedule->patient?->therapist_id,
                    ],
                ];
            })
            ->values();

        return inertia('Praktisi/LessonPlans/CreateLessonPlan', [
            'schedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        $therapistId = auth()->id();

        $validated = $request->validate([
            'schedule_id' => ['required', 'integer', 'exists:schedules,id'],
            'session_date' => ['required', 'date'],
            'session_number' => ['required', 'integer', 'min:1'],
            'long_term_goal' => ['required', 'string'],
            'short_term_goal' => ['required', 'string'],
            'home_program' => ['required', 'string'],
            'therapist_note' => ['required', 'string'],

            'ling' => ['required', 'array'],
            'ling.m' => ['required', 'integer', 'between:0,4'],
            'ling.u' => ['required', 'integer', 'between:0,4'],
            'ling.i' => ['required', 'integer', 'between:0,4'],
            'ling.a' => ['required', 'integer', 'between:0,4'],
            'ling.sh' => ['required', 'integer', 'between:0,4'],
            'ling.s' => ['required', 'integer', 'between:0,4'],

            'activities' => ['required', 'array', 'min:1'],
            'activities.*.activity_name' => ['required', 'string', 'max:255'],
            'activities.*.objective' => ['required', 'string'],
            'activities.*.score' => ['required', 'numeric', 'min:0'],
            'activities.*.observation' => ['required', 'string'],

            'evaluation' => ['required', 'array'],
            'evaluation.listening' => ['required', 'integer', 'between:0,100'],
            'evaluation.speech' => ['required', 'integer', 'between:0,100'],
            'evaluation.language' => ['required', 'integer', 'between:0,100'],
            'evaluation.attention' => ['required', 'integer', 'between:0,100'],
            'evaluation.recommendation' => ['required', 'string'],
        ]);

        $schedule = Schedule::query()
            ->with('patient')
            ->where('id', $validated['schedule_id'])
            ->where('therapist_id', $therapistId)
            ->where('status', 'scheduled')
            ->whereDoesntHave('lessonPlan')
            ->first();

        if (! $schedule || ! $schedule->patient) {
            abort(403, 'Forbidden: invalid schedule for this therapist');
        }

        DB::transaction(function () use ($validated, $schedule) {
            $lesson = LessonPlan::create([
                'patient_id' => $schedule->patient_id,
                'schedule_id' => $schedule->id,
                'session_date' => $validated['session_date'],
                'session_number' => $validated['session_number'],
                'long_term_goal' => $validated['long_term_goal'] ?? '',
                'short_term_goal' => $validated['short_term_goal'] ?? null,
                'home_program' => $validated['home_program'] ?? null,
                'therapist_note' => $validated['therapist_note'] ?? null,
            ]);

            $allowedSounds = ['m', 'u', 'i', 'a', 'sh', 's'];
            foreach ($allowedSounds as $sound) {
                LingSixSoundResult::create([
                    'lesson_plan_id' => $lesson->id,
                    'sound' => $sound,
                    'level' => (int) ($validated['ling'][$sound] ?? 0),
                ]);
            }

            foreach (($validated['activities'] ?? []) as $activity) {
                LessonActivity::create([
                    'lesson_plan_id' => $lesson->id,
                    'activity_name' => $activity['activity_name'],
                    'objective' => $activity['objective'],
                    'score' => $activity['score'] ?? null,
                    'observation' => $activity['observation'] ?? null,
                ]);
            }

            $evaluation = $validated['evaluation'] ?? [];

            LessonEvaluation::create([
                'lesson_plan_id' => $lesson->id,
                'listening' => $evaluation['listening'] ?? 0,
                'speech' => $evaluation['speech'] ?? 0,
                'language' => $evaluation['language'] ?? 0,
                'attention' => $evaluation['attention'] ?? 0,
                'recommendation' => $evaluation['recommendation'] ?? null,
            ]);

            $schedule->update([
                'status' => 'completed',
            ]);
        });

        return redirect()->route('lesson-plans.index');
    }
}