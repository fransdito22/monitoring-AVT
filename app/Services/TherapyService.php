<?php

namespace App\Services;

use App\Models\LessonPlan;
use App\Models\Patient;
use App\Models\Report;
use Illuminate\Support\Collection;
use App\Services\LessonPlanService;

class TherapyService
{
    public function __construct(
        private readonly LessonPlanService $lessonPlanService
    ) {}

    public function assertCanAccessPatient(Patient $patient, int $therapistId): void
    {
        if ((int) $patient->therapist_id !== (int) $therapistId) {
            abort(403, 'Anda tidak memiliki akses ke pasien ini.');
        }
    }

    public function show(Patient $patient): array
    {
        $patient->load(['parent', 'therapist']);

        $lessonPlans = LessonPlan::query()
            ->with([
                'schedule',
                'activities',
                'evaluation',
                'lingSixSounds',
            ])
            ->where('patient_id', $patient->id)
            ->orderBy('session_date')
            ->get();

        $reports = Report::query()
            ->with(['details'])
            ->where('patient_id', $patient->id)
            ->orderBy('session_date')
            ->get();

        $statistics = $this->buildStatistics($patient, $lessonPlans, $reports);

        $chartData = $this->buildChartData($reports);

        $insights = $this->buildInsights($chartData, $reports);

        $timeline = $this->buildTimeline($lessonPlans, $reports);

        return [
            'patient' => $this->buildPatientPayload($patient),
            'statistics' => $statistics,
            'chartData' => $chartData,
            'insights' => $insights,
            'tabs' => [
                'lessonPlans' => $this->buildLessonPlansPayload($lessonPlans),
                'articulationReports' => $this->buildArticulationReportsPayload($reports),
                'timeline' => $timeline,
            ],
        ];
    }

    private function buildPatientPayload(Patient $patient): array
    {
        return [
            'id' => $patient->id,
            'name' => $patient->name,
            'photo' => $patient->photo,
            'status' => $patient->status,
            'progress' => (int) $patient->progress,
            'birth_date' => $patient->birth_date,
            'age' => $patient->birth_date ? \Carbon\Carbon::parse($patient->birth_date)->age : null,
            'gender' => $patient->gender,
            'parent' => [
                'id' => $patient->parent?->id,
                'name' => $patient->parent?->name,
            ],
            'therapist' => [
                'id' => $patient->therapist?->id,
                'name' => $patient->therapist?->name,
            ],
            'created_at' => $patient->created_at,
            'updated_at' => $patient->updated_at,
        ];
    }

    private function buildStatistics(Patient $patient, Collection $lessonPlans, Collection $reports): array
    {
        $totalLessonPlan = $lessonPlans->count();
        $totalTesArtikulasi = $reports->count();
        $totalPertemuan = $lessonPlans->count();

        return [
            'totalLessonPlan' => $totalLessonPlan,
            'totalTesArtikulasi' => $totalTesArtikulasi,
            'totalPertemuan' => $totalPertemuan,
            'progressPercent' => (int) $patient->progress,
        ];
    }

    private function buildChartData(Collection $reports): array
    {
        $sessions = $reports
            ->sortBy('session_date')
            ->values();

        $chart = [];
        $index = 0;

        foreach ($sessions as $report) {
            $index++;
            $chart[] = [
                'session' => 'Sesi ' . $index,
                'progress' => (int) $report->progress,
                'date' => $report->session_date?->format('d M') ?? null,
            ];
        }

        return $chart;
    }

    private function buildInsights(array $chartData, Collection $reports): array
    {
        if (count($chartData) === 0) {
            return [
                'scoreAwal' => null,
                'scoreTerbaru' => null,
                'selisih' => null,
                'trend' => 'stabil',
            ];
        }

        $scoreAwal = $chartData[0]['progress'];
        $scoreTerbaru = $chartData[count($chartData) - 1]['progress'];
        $selisih = $scoreTerbaru - $scoreAwal;

        $trend = 'stabil';
        if ($selisih > 0) $trend = 'naik';
        if ($selisih < 0) $trend = 'turun';

        return [
            'scoreAwal' => $scoreAwal,
            'scoreTerbaru' => $scoreTerbaru,
            'selisih' => $selisih,
            'trend' => $trend,
        ];
    }

    private function buildTimeline(Collection $lessonPlans, Collection $reports): array
    {
        $events = [];

        foreach ($lessonPlans as $lessonPlan) {
            $events[] = [
                'type' => 'lesson_plan',
                'label' => 'Lesson Plan dibuat',
                'date' => $lessonPlan->session_date,
                'meta' => [
                    'session_number' => $lessonPlan->session_number,
                    'id' => $lessonPlan->id,
                ],
            ];

            // update event placeholder if needed by domain later
            $events[] = [
                'type' => 'lesson_plan_updated',
                'label' => 'Lesson Plan diperbarui',
                'date' => $lessonPlan->updated_at,
                'meta' => [
                    'id' => $lessonPlan->id,
                ],
            ];
        }

        foreach ($reports as $report) {
            $events[] = [
                'type' => 'report',
                'label' => 'Tes Artikulasi',
                'date' => $report->session_date,
                'meta' => [
                    'id' => $report->id,
                    'progress' => (int) $report->progress,
                ],
            ];
        }

        usort($events, function ($a, $b) {
            $ad = $a['date'] ? (is_string($a['date']) ? strtotime($a['date']) : $a['date']->timestamp) : 0;
            $bd = $b['date'] ? (is_string($b['date']) ? strtotime($b['date']) : $b['date']->timestamp) : 0;
            return $ad <=> $bd;
        });

        $out = [];
        foreach ($events as $event) {
            $out[] = [
                'type' => $event['type'],
                'label' => $event['label'],
                'date' => $event['date'] instanceof \DateTimeInterface
                    ? $event['date']->format('Y-m-d')
                    : $event['date'],
                'meta' => $event['meta'] ?? null,
            ];
        }

        return $out;
    }

    private function buildLessonPlansPayload(Collection $lessonPlans): array
    {
        return $lessonPlans
            ->map(function (LessonPlan $lessonPlan) {
    
                return [
                    'id' => $lessonPlan->id,
    
                    'session_date' => $lessonPlan->session_date,
                    'session_number' => $lessonPlan->session_number,
    
                    'long_term_goal' => $lessonPlan->long_term_goal,
                    'short_term_goal' => $lessonPlan->short_term_goal,
    
                    'home_program' => $lessonPlan->home_program ?? [],
    
                    'therapist_note' => $lessonPlan->therapist_note,
    
                    'status' => $lessonPlan->status,
    
                    'activities' => $lessonPlan->activities
                        ->map(function ($activity) {
                            return [
                                'id' => $activity->id,
                                'activity_name' => $activity->activity_name,
                                'objective' => $activity->objective,
                                'score' => $activity->score,
                                'observation' => $activity->observation,
                            ];
                        })
                        ->values()
                        ->all(),
    
                    'evaluation' => $lessonPlan->evaluation
                        ? [
                            'listening' => $lessonPlan->evaluation->listening,
                            'speech' => $lessonPlan->evaluation->speech,
                            'language' => $lessonPlan->evaluation->language,
                            'attention' => $lessonPlan->evaluation->attention,
                            'recommendation' => $lessonPlan->evaluation->recommendation,
                        ]
                        : null,
    
                    'lingSixSounds' => $lessonPlan->lingSixSounds
                        ->map(function ($sound) {
                            return [
                                'id' => $sound->id,
                                'sound' => $sound->sound,
                                'level' => $sound->level,
                                'note' => $sound->note,
                            ];
                        })
                        ->values()
                        ->all(),
                ];
            })
            ->values()
            ->all();
    }
    
    private function buildArticulationReportsPayload(Collection $reports): array
    {
        return $reports
            ->map(function (Report $report) {
                return [
                    'id' => $report->id,
                    'tanggal' => $report->session_date,
                    'summary' => $report->summary,
                    'progress' => (int) $report->progress,
                    'detailArtikulasi' => $report->details
                        ->map(function ($detail) {
                            return [
                                'category' => $detail->category,
                                'note' => $detail->note,
                                'target_word' => $detail->target_word,
                                'target_phoneme' => $detail->target_phoneme,
                            ];
                        })
                        ->values()
                        ->all(),
                ];
            })
            ->values()
            ->all();
    }
}