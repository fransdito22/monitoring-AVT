<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\LessonPlan;
use App\Models\Patient;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChildProgressController extends Controller
{
    public function index()
    {
        $parentId = Auth::id();

        $primaryChild = Patient::query()
            ->where('parent_id', $parentId)
            ->orderByDesc('updated_at')
            ->first();
        if (!$primaryChild) {
            return Inertia::render('OrangTua/ChildProgress/index', [
                'progressSummary' => null,
                'progressChart' => [],
                'lingSixSounds' => [],
            ]);
        }

        // Ling Six Sound chart expects lessonPlans with lingSixSounds
        $lessonPlans = LessonPlan::query()
            ->where('patient_id', $primaryChild->id)
            ->with([
                'lingSixSounds',
            ])
            ->orderBy('session_date')
            ->orderBy('created_at')
            ->get();

        $lingSixSounds = $lessonPlans
            ->sortBy(function ($lp) {
                return $lp->session_date
                    ? $lp->session_date->toDateString()
                    : '9999-12-31';
            })->values()
            ->all();

        // progressChart must be the SAME source of truth as Praktisi dashboard:
        // TherapyService->buildChartData($reports) => uses Report.progress per session.
        $reports = Report::query()
            ->with(['details'])
            ->where('patient_id', $primaryChild->id)
            ->orderBy('session_date')
            ->get();

        $progressChart = [];
        $index = 0;

        foreach ($reports as $report) {
            $index++;

            $progressChart[] = [
                'session' => 'Sesi ' . $index,
                'progress' => (int) $report->progress,
                'date' => $report->session_date?->format('d M') ?? null,
            ];
        }

        // progressSummary derived from chartData (identical to TherapyService->buildInsights)
        if (count($progressChart) === 0) {
            $insights = [
                'scoreAwal' => null,
                'scoreTerbaru' => null,
                'selisih' => null,
                'trend' => 'stabil',
            ];
        } else {
            $scoreAwal = $progressChart[0]['progress'];
            $scoreTerbaru = $progressChart[count($progressChart) - 1]['progress'];
            $selisih = $scoreTerbaru - $scoreAwal;

            $trend = 'stabil';
            if ($selisih > 0) {
                $trend = 'naik';
            }
            if ($selisih < 0) {
                $trend = 'turun';
            }

            $insights = [
                'scoreAwal' => $scoreAwal,
                'scoreTerbaru' => $scoreTerbaru,
                'selisih' => $selisih,
                'trend' => $trend,
            ];
        }

        return Inertia::render('OrangTua/ChildProgress/index', [
            'progressSummary' => $insights,
            'progressChart' => $progressChart,
            'lingSixSounds' => $lingSixSounds,
        ]);
    }
}