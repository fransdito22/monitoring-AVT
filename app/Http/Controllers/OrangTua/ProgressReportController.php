<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProgressReportController extends Controller
{
    public function index()
    {
        $patientIds = Patient::where('parent_id', Auth::id())
            ->pluck('id');

        $reports = Report::with(['patient', 'therapist', 'details'])
            ->whereIn('patient_id', $patientIds)
            ->orderByDesc('session_date')
            ->get()
            ->map(function (Report $report) {
                return [
                    'id' => $report->id,
                    'patient' => $report->patient?->name,
                    'therapist' => $report->therapist?->name,
                    'session_date' => optional($report->session_date)->format('d M Y'),
                    'progress' => $report->progress,
                    'summary' => $report->summary,
                    'details' => $report->details->map(function ($d) {
                        return [
                            'target_word' => $d->target_word,
                            'target_phoneme' => $d->target_phoneme,
                            'category' => $d->category,
                            'note' => $d->note,
                        ];
                    }),
                ];
            });

        $summary = $this->buildSummaryFromReports($reports->toArray());

        return Inertia::render('OrangTua/ProgressReports/index', [
            'reports' => $reports,
            'summary' => $summary,
        ]);
    }

    private function buildSummaryFromReports(array $reports): array
    {
        $totalSessions = count($reports);

        $avgProgress = $totalSessions > 0
            ? round(
                array_sum(
                    array_map(
                        fn($r) => (int) ($r['progress'] ?? 0),
                        $reports
                    )
                ) / $totalSessions
            )
            : 0;

        // Reports are sorted desc by session_date in the query.
        $lastSession = $totalSessions > 0
            ? ($reports[0]['session_date'] ?? null)
            : null;

        $dateRange = null;
        if ($totalSessions > 1) {
            $latest = $reports[0]['session_date'] ?? null;
            $earliest = $reports[$totalSessions - 1]['session_date'] ?? null;

            if ($latest && $earliest) {
                $dateRange = $earliest === $latest
                    ? $latest
                    : $earliest . ' - ' . $latest;
            }
        } elseif ($totalSessions === 1) {
            $dateRange = $reports[0]['session_date'] ?? null;
        }

        return [
            'totalSessions' => $totalSessions,
            'averageProgress' => $avgProgress,
            'lastSession' => $lastSession,
            'dateRange' => $dateRange,
        ];
    }
}