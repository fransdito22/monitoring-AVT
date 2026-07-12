<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\LessonPlan;
use App\Models\Patient;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TherapyController extends Controller
{
    public function index()
    {
        $parentId = Auth::id();

        $primaryChild = Patient::query()
            ->where('parent_id', $parentId)
            ->orderByDesc('updated_at')
            ->first();

        if (!$primaryChild) {
            return Inertia::render('OrangTua/Therapy/index', [
                'currentGoal' => null,
                'homeProgram' => [],
                'evaluation' => null,
                'recentLessons' => [],
                'timeline' => [],
            ]);
        }

        $lessonPlans = LessonPlan::query()
            ->where('patient_id', $primaryChild->id)
            ->with([
                'evaluation',
                'schedule' => function ($q) {
                    $q->with('therapist');
                },
                'activities',
                'lingSixSounds',
            ])
            ->orderByDesc('session_date')
            ->orderByDesc('created_at')
            ->get();

        // Current therapy goal (LessonPlan) fallback rules:
        // 1) schedule.status = in_progress
        // 2) fallback latest session_date/created_at desc
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
        if ($currentGoalLessonPlan) {
            $currentGoal = [
                'title' => $currentGoalLessonPlan->long_term_goal ?: 'Target Terapi',
                'description' => $currentGoalLessonPlan->short_term_goal ?: '',
            ];
        }

        // Home program from current goal lesson plan
        $homeProgram = [];
        if ($currentGoalLessonPlan) {
            $homeProgramRaw = $currentGoalLessonPlan->home_program ?? [];
            $homeProgram = is_array($homeProgramRaw) ? $homeProgramRaw : [];
        }

        // Latest evaluation + timeline based on LessonEvaluation
        $latestEvaluationLesson = $lessonPlans->firstWhere('evaluation', fn($value) => (bool) $value);

        $evaluation = null;
        if ($latestEvaluationLesson && $latestEvaluationLesson->evaluation) {
            $e = $latestEvaluationLesson->evaluation;

            $evaluation = [
                'date' => $latestEvaluationLesson->session_date
                    ? $latestEvaluationLesson->session_date->format('Y-m-d')
                    : ($latestEvaluationLesson->created_at
                        ? $latestEvaluationLesson->created_at->format('Y-m-d')
                        : null),
                'therapistName' => $latestEvaluationLesson->schedule?->therapist?->name ?? '—',
                'overallAssessment' => $e->overall_assessment ?? ($e->assessment ?? '—'),
                'strengths' => $e->strengths ?? [],
                'areasForImprovement' => $e->areas_for_improvement ?? [],
                'homePracticeRecommendations' => $e->home_practice_recommendations ?? [],
            ];
        }

        $timeline = [];
        $lessonPlansWithEvaluation = $lessonPlans->filter(fn($lp) => (bool) $lp->evaluation);

        foreach ($lessonPlansWithEvaluation as $lp) {
            $timeline[] = [
                'sessionNumber' => $lp->session_number ?? null,
                'date' => $lp->session_date ? $lp->session_date->format('Y-m-d') : null,
                'therapistName' => $lp->schedule?->therapist?->name ?? '—',
                'evaluation' => $lp->evaluation->overall_assessment ?? ($lp->evaluation->assessment ?? '—'),
                'improvementNotes' => $lp->evaluation->improvement_notes ?? '—',
            ];
        }

        // Recent therapy history (max 5) for LessonPlanCard usage
        $recentLessons = $lessonPlans->take(5)->values()->all();

        return Inertia::render('OrangTua/Therapy/index', [
            'currentGoal' => $currentGoal,
            'homeProgram' => $homeProgram,
            'evaluation' => $evaluation,
            'recentLessons' => $recentLessons,
            'timeline' => $timeline,
        ]);
    }
}