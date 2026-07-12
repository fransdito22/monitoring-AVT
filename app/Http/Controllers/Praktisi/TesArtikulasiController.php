<?php

namespace App\Http\Controllers\Praktisi;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TesArtikulasiController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $patients = Patient::query()
            ->with(['parent'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->get()
            ->map(function ($patient) {
                $totalReports = $patient->reports()->count();

                return [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'photo' => $patient->photo,
                    'status' => $patient->status,
                    'progress' => $patient->progress,
                    'parent' => [
                        'name' => $patient->parent?->name,
                    ],
                    'total_reports' => $totalReports,
                ];
            });

        return Inertia::render(
            'Praktisi/TesArtikulasi/Reports',
            [
                'patients' => $patients,
                'filters' => [
                    'search' => $search,
                ],
            ]
        );
    }

    public function create(Request $request)
    {
        $patient = Patient::query()
            ->where('therapist_id', auth()->id())
            ->findOrFail($request->input('childId'));

        return Inertia::render(
            'Praktisi/TesArtikulasi/CreateReports',
            [
                'patient' => [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'photo' => $patient->photo,
                    'progress' => $patient->progress,
                    'status' => $patient->status,
                ],
            ]
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => [
                'required',
                'exists:patients,id',
            ],
            'summary' => [
                'nullable',
                'string',
            ],
            'details' => [
                'required',
                'array',
                'min:1',
            ],
            'details.*.target_word' => [
                'required',
                'string',
            ],
            'details.*.target_phoneme' => [
                'required',
                'string',
            ],
            'details.*.category' => [
                'required',
                'in:Normal,Omisi,Distorsi,Adisi,Substitusi',
            ],
            'details.*.note' => [
                'nullable',
                'string',
            ],
        ]);

        $patient = Patient::query()
            ->where('therapist_id', auth()->id())
            ->findOrFail($validated['patient_id']);

        DB::transaction(function () use ($validated, $patient) {
            $scoreMap = [
                'Normal' => 100,
                'Distorsi' => 75,
                'Adisi' => 50,
                'Substitusi' => 25,
                'Omisi' => 0,
            ];

            $totalScore = collect($validated['details'])->sum(function ($item) use ($scoreMap) {
                return $scoreMap[$item['category']];
            });

            $maxScore = count($validated['details']) * 100;

            $sessionProgress = $maxScore > 0
                ? round(($totalScore / $maxScore) * 100)
                : 0;

            $report = Report::create([
                'patient_id' => $patient->id,
                'therapist_id' => auth()->id(),
                'session_date' => now(),
                'summary' => $validated['summary'] ?? null,
                'progress' => $sessionProgress,
            ]);

            foreach ($validated['details'] as $detail) {
                $report->details()->create([
                    'target_word' => $detail['target_word'],
                    'target_phoneme' => $detail['target_phoneme'],
                    'category' => $detail['category'],
                    'note' => $detail['note'] ?? null,
                ]);
            }

            $patientProgress = Report::query()
                ->where('patient_id', $patient->id)
                ->avg('progress');

            $patient->update([
                'progress' => (int) round($patientProgress),
            ]);
        });

        return redirect()
            ->route('reports.index')
            ->with('success', 'Penilaian berhasil disimpan');
    }

    public function show(Request $request)
    {
        $patient = Patient::query()
            ->with(['reports.details'])
            ->findOrFail($request->childId);

        $totals = [
            'Normal' => 0,
            'Omisi' => 0,
            'Distorsi' => 0,
            'Adisi' => 0,
            'Substitusi' => 0,
        ];

        foreach ($patient->reports as $report) {
            foreach ($report->details as $detail) {
                $totals[$detail->category]++;
            }
        }

        $chartData = $patient->reports
            ->sortBy('session_date')
            ->values()
            ->map(function ($report, $index) {
                return [
                    'session' => 'Sesi ' . ($index + 1),
                    'progress' => $report->progress,
                    'date' => $report->session_date?->format('d M'),
                ];
            });

        return Inertia::render(
            'Praktisi/TesArtikulasi/DetailReports',
            [
                'patient' => $patient,
                'totals' => $totals,
                'chartData' => $chartData,
            ]
        );
    }
}