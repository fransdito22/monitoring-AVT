<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\LessonPlan;
use App\Models\Patient;
use App\Models\Report;
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
            ->with(['therapist:id,name'])
            ->orderByDesc('updated_at')
            ->first();

        $childProfile = null;
        $therapyProgress = [
            'totalSessions' => 0,
            'completedSessions' => 0,
            'currentProgress' => 0,
        ];
        $upcomingSchedules = [];
        $recentActivities = [];

        if ($primaryChild) {
            $birthDate = $primaryChild->birth_date ? \Carbon\Carbon::parse($primaryChild->birth_date) : null;

            $childProfile = [
                'id' => (string) $primaryChild->id,
                'name' => $primaryChild->name,
                'age' => $birthDate ? $birthDate->age : null,
                'gender' => $primaryChild->gender,
                'therapyStatus' => $primaryChild->status ?? 'Unknown',
            ];

            $lessonPlansQuery = LessonPlan::query()->where('patient_id', $primaryChild->id);

            $totalSessions = (clone $lessonPlansQuery)->count();

            $completedSessions = (clone $lessonPlansQuery)
                ->whereDate('session_date', '<=', now()->toDateString())
                ->count();

            $currentProgress = (int) round((float) ($primaryChild->progress ?? 0));

            $therapyProgress = [
                'totalSessions' => $totalSessions,
                'completedSessions' => $completedSessions,
                'currentProgress' => $currentProgress,
            ];

            $upcomingSchedules = LessonPlan::query()
                ->where('patient_id', $primaryChild->id)
                ->whereDate('session_date', '>=', now()->toDateString())
                ->orderBy('session_date')
                ->limit(5)
                ->get(['id', 'session_date', 'therapist_id'])
                ->map(function ($lessonPlan) use ($primaryChild) {
                    return [
                        'id' => (string) $lessonPlan->id,
                        'date' => optional($lessonPlan->session_date)->format('Y-m-d') ?? (string) $lessonPlan->session_date,
                        'time' => 'TBD',
                        'therapist' => $primaryChild->therapist?->name ?? 'Terapis belum ditentukan',
                        'status' => 'Scheduled',
                    ];
                })
                ->values()
                ->all();

            $recentActivities = Report::query()
                ->where('patient_id', $primaryChild->id)
                ->orderByDesc('session_date')
                ->orderByDesc('updated_at')
                ->limit(5)
                ->get(['id', 'session_date', 'progress', 'notes'])
                ->map(function ($report) {
                    return [
                        'id' => (string) $report->id,
                        'title' => 'Sesi terapi diperbarui',
                        'date' => optional($report->session_date)->format('Y-m-d') ?? (string) $report->session_date,
                        'note' => $report->notes ?: ('Progress sesi: ' . (int) ($report->progress ?? 0) . '%'),
                    ];
                })
                ->values()
                ->all();
        }

        return Inertia::render('OrangTua/Orangtua', [
            'childProfile' => $childProfile,
            'therapyProgress' => $therapyProgress,
            'upcomingSchedules' => $upcomingSchedules,
            'recentActivities' => $recentActivities,
        ]);
    }
}