<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProgressReportsController extends Controller
{
    public function index()
    {
        $patientIds = Patient::where('parent_id', Auth::id())
            ->pluck('id');

        $reports = Report::with(['patient', 'therapist'])
            ->whereIn('patient_id', $patientIds)
            ->latest('session_date')
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'patient' => $report->patient?->name,
                    'therapist' => $report->therapist?->name,
                    'session_date' => optional($report->session_date)->format('d M Y'),
                    'progress' => $report->progress,
                    'summary' => $report->summary,
                ];
            });

        return Inertia::render('OrangTua/ProgressReports', [
            'reports' => $reports,
        ]);
    }
}