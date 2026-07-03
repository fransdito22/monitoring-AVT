<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProgressReportsController extends Controller
{
    /**
     * Display progress reports for the authenticated parent.
     */
    public function index(Request $request)
    {
        $parent = Auth::user();


        // Filters
        $periodType = $request->input('periodType', 'month'); // month | year
        $reportType = $request->input('reportType', 'All'); // Monthly | Quarterly | Final Report | All

        // Expecting inputs from UI: month/year (e.g., "2026-05") or year only.
        // We keep it flexible for now.
        $year = $request->input('year');
        $month = $request->input('month');

        // If user doesn't provide filters, attempt to infer from current date.
        $year = $year ?: now()->format('Y');
        $month = $month ?: now()->format('m');

        $from = null;
        $to = null;

        // Derive date range for Monthly/Quarterly from the UI period.
        if ($periodType === 'month') {
            $from = now()->createFromDate((int) $year, (int) $month, 1)->startOfDay();
            $to = now()->createFromDate((int) $year, (int) $month, 1)->endOfMonth()->endOfDay();
        } else {
            // year
            $from = now()->createFromDate((int) $year, 1, 1)->startOfDay();
            $to = now()->createFromDate((int) $year, 12, 31)->endOfDay();
        }

        // Quarterly: calculate quarter inside the chosen year.
        if ($reportType === 'Quarterly' && $from && $to) {
            $q = (int) ceil(((int) $month) / 3); // 1..4
            $quarterStartMonth = (($q - 1) * 3) + 1;
            $from = now()->createFromDate((int) $year, $quarterStartMonth, 1)->startOfDay();
            $to = now()->createFromDate((int) $year, $quarterStartMonth + 2, 1)->endOfMonth()->endOfDay();
        }

        // Collect patients for this parent.
        $patients = Patient::query()
            ->where('parent_id', $parent->id)
            ->get(['id', 'name', 'photo']);

        $reportsQuery = Report::query()
            ->whereIn('patient_id', $patients->pluck('id'))
            ->with(['patient', 'therapist']);

        // Search title is not implemented server-side (we can add after we add naming schema).
        // For now, we rely on date/type.

        if ($from && $to) {
            // Monthly / Quarterly / All within the derived range
            $reportsQuery->whereBetween('session_date', [$from, $to]);
        }

        if ($reportType === 'Final Report') {
            // Latest report per patient within the selected year/month range.
            // (Pick max(id) per patient for reports inside the derived date range.)
            $reportsQuery = $reportsQuery
                ->whereIn('id', function ($sub) use ($reportsQuery) {
                    /** @var \Illuminate\Database\Eloquent\Builder $sub */
                    $sub->from('tes_artikulasi as t1')
                        ->selectRaw('MAX(t1.id)')
                        ->groupBy('t1.patient_id');
                });
        }

        $reports = $reportsQuery
            ->orderByDesc('session_date')
            ->orderByDesc('id')
            ->get();

        // Build DTO for frontend (keeping it close to ProgressReports.tsx)
        $reportDtos = $reports->map(function (Report $r) use ($periodType) {
            $createdAt = optional($r->created_at)->toISOString();

            $label = null;
            if ($periodType === 'month') {
                $label = $r->session_date ? $r->session_date->format('F Y') : '—';
            } else {
                $label = $r->session_date ? $r->session_date->format('Y') : '—';
            }

            // Objectives: approximate using detail rows by mapping categories.
            $details = $r->details ?? collect();
            $details = $details->values();

            $freqByCat = $details
                ->groupBy('category')
                ->map(fn($items) => $items->count());

            $total = max(1, $details->count());

            $objectives = [
                'Sound Detection' => 0,
                'Sound Discrimination' => 0,
                'Word Recognition' => 0,
                'Speech Imitation' => 0,
                'Verbal Communication' => 0,
            ];

            $objectives['Sound Detection'] = round(($freqByCat->get('Normal', 0) / $total) * 100);
            $objectives['Sound Discrimination'] = round(($freqByCat->get('Distorsi', 0) / $total) * 100);
            $objectives['Word Recognition'] = round(($freqByCat->get('Adisi', 0) / $total) * 100);
            $objectives['Speech Imitation'] = round(($freqByCat->get('Substitusi', 0) / $total) * 100);
            $objectives['Verbal Communication'] = round(($freqByCat->get('Omisi', 0) / $total) * 100);

            $objList = [];
            foreach ($objectives as $key => $pct) {
                $status = $pct >= 90 ? 'Completed' : ($pct >= 50 ? 'In Progress' : 'Not Started');
                $objList[] = [
                    'key' => $key,
                    'progress' => (int) $pct,
                    'status' => $status,
                ];
            }

            // We do not have attendance field in DB; reuse report->progress as proxy.
            $attendance = (float) ($r->progress ?? 0);

            $therapistEval = [
                'overallAssessment' => $r->summary ?: '—',
                'strengths' => ['Consistent listening engagement'],
                'areasForImprovement' => ['Generalization to new contexts'],
                'recommendations' => ['Practice daily short sessions'],
            ];

            $progressPct = (int) ($r->progress ?? 0);

            return [
                'id' => (string) $r->id,
                'title' => 'Progress Report',
                'reportingPeriodLabel' => $label,
                'childName' => $r->patient?->name ?? '—',
                'therapistName' => $r->therapist?->name ?? '—',
                'completedSessions' => 1,
                'progressPercentage' => $progressPct,
                'createdAt' => $createdAt ?: now()->toISOString(),
                'status' => 'Available',
                'pdfUrl' => '/mock/progress-report-' . $r->id . '.pdf',
                'therapySummary' => [
                    'totalScheduledSessions' => 1,
                    'completedSessions' => 1,
                    'missedSessions' => 0,
                    'attendancePercentage' => $attendance,
                ],
                'objectives' => $objList,
                'therapistEvaluation' => $therapistEval,
                'homePracticeRecommendations' => [
                    ['title' => 'Environmental sound spotting', 'description' => 'Practice identifying daily environmental sounds.'],
                    ['title' => 'Simple verbal conversations', 'description' => 'Encourage short turn-taking conversations.'],
                ],
                'conclusion' => $r->summary ?: '—',
            ];
        });
        // Summary cards
        $totalReports = $reportDtos->count();
        $latestReportDate = $reports->max('session_date')?->toISOString();
        $completedSessions = $reportDtos->sum('completedSessions');
        $overallProgressAvg = $totalReports > 0
            ? (int) round($reportDtos->avg('progressPercentage'))
            : 0;

        return Inertia::render('OrangTua/ProgressReports', [
            'reports' => $reportDtos,
            'summary' => [
                'totalReports' => $totalReports,
                'latestReportDate' => $latestReportDate,
                'completedSessions' => $completedSessions,
                'overallProgressAvg' => $overallProgressAvg,
            ],
        ]);
    }
}