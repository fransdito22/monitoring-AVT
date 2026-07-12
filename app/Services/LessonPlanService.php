<?php

namespace App\Services;

use App\Models\LessonActivity;
use App\Models\LessonEvaluation;
use App\Models\LessonPlan;
use App\Models\LingSixSoundResult;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LessonPlanService
{
    public function index(int $therapistId)
    {
        return LessonPlan::with([
            'schedule.patient',
            'activities',
            'evaluation',
            'lingSixSounds',
        ])
            ->whereHas('schedule', function ($query) use ($therapistId) {
                $query->where('therapist_id', $therapistId);
            })
            ->latest()
            ->get();
    }

    public function availableSchedules(int $therapistId)
    {
        return Schedule::with([
            'patient',
            // Ensure therapist data exists for UI (PatientInformation)
            'therapist:id,name',
        ])
            ->where('therapist_id', $therapistId)
            ->whereDoesntHave('lessonPlan')
            ->orderBy('schedule_date')
            ->get();
    }


    public function show(LessonPlan $lessonPlan)
    {
        return $lessonPlan->load([
            'schedule.patient',
            'activities',
            'evaluation',
            'lingSixSounds',
        ]);
    }

    public function store(array $data, int $therapistId): LessonPlan
    {
        return DB::transaction(function () use ($data, $therapistId) {
            try {
                Log::info('[LessonPlanService.store] start', [
                    'therapist_id' => $therapistId,
                    'payload_keys' => array_keys($data),
                ]);

                $schedule = Schedule::where('id', $data['schedule_id'])
                    ->where('therapist_id', $therapistId)
                    ->firstOrFail();

                $goal = $data['goal'] ?? null;
                $longTermGoal = $data['long_term_goal'] ?? ($goal ?? null);
                $shortTermGoal = $data['short_term_goal'] ?? null;

                Log::info('[LessonPlanService.store] goal mapping', [
                    'goal' => $goal,
                    'long_term_goal' => $longTermGoal,
                    'short_term_goal' => $shortTermGoal,
                ]);

                $lessonPlan = LessonPlan::create([
                    'patient_id'       => $schedule->patient_id,
                    'schedule_id'      => $schedule->id,
                    // therapist_id column may not exist on some schema versions
                    // so avoid inserting it to prevent SQLSTATE[42S22].
                    'session_date'     => $data['session_date'],
                    'session_number'   => $data['session_number'],
                    'long_term_goal'   => $longTermGoal,
                    'short_term_goal'  => $shortTermGoal,
                    'home_program'     => $data['home_program'] ?? [],
                    'therapist_note'   => $data['therapist_note'] ?? null,
                    'status'           => 'completed',
                ]);

                Log::info('[LessonPlanService.store] lesson_plan created', [
                    'lesson_plan_id' => $lessonPlan->id,
                ]);

                // Saat lesson plan berhasil disimpan, schedule langsung dianggap selesai
                $schedule->update([
                    'status' => 'completed',
                ]);

                $this->saveActivities($lessonPlan, $data);
                $this->saveEvaluation($lessonPlan, $data);
                $this->saveLingSixSound($lessonPlan, $data);

                Log::info('[LessonPlanService.store] relations saved', [
                    'lesson_plan_id' => $lessonPlan->id,
                    'activities_count' => count($data['activities'] ?? []),
                    'has_evaluation' => array_key_exists('evaluation', $data),
                    'has_ling_six_sounds' => array_key_exists('ling_six_sounds', $data),
                ]);

                return $lessonPlan->load([
                    'patient',
                    'schedule',
                    'activities',
                    'evaluation',
                    'lingSixSounds',
                ]);
            } catch (\Throwable $e) {
                Log::error('[LessonPlanService.store] failed', [
                    'therapist_id' => $therapistId,
                    'payload' => $data,
                    'exception' => $e,
                ]);

                throw $e;
            }
        });
    }


    public function update(
        LessonPlan $lessonPlan,
        array $data
    ): LessonPlan {

        DB::transaction(function () use ($lessonPlan, $data) {

            $lessonPlan->update([
                'session_date'     => $data['session_date'],
                'session_number'   => $data['session_number'],
                'long_term_goal'   => $data['long_term_goal'],
                'short_term_goal'  => $data['short_term_goal'],
                'home_program'     => $data['home_program'] ?? [],
                'therapist_note'   => $data['therapist_note'],
            ]);

            $lessonPlan->activities()->delete();

            $lessonPlan->lingSixSounds()->delete();

            $lessonPlan->evaluation()?->delete();

            $this->saveActivities($lessonPlan, $data);

            $this->saveEvaluation($lessonPlan, $data);

            $this->saveLingSixSound($lessonPlan, $data);
        });

        return $lessonPlan->fresh([
            'patient',
            'schedule',
            'activities',
            'evaluation',
            'lingSixSounds',
        ]);
    }

    public function destroy(LessonPlan $lessonPlan)
    {
        DB::transaction(function () use ($lessonPlan) {

            $lessonPlan->activities()->delete();

            $lessonPlan->lingSixSounds()->delete();

            optional($lessonPlan->evaluation)->delete();

            $lessonPlan->delete();
        });
    }


    protected function saveActivities(
        LessonPlan $lessonPlan,
        array $data
    ): void {

        foreach ($data['activities'] as $activity) {

            LessonActivity::create([

                'lesson_plan_id' => $lessonPlan->id,

                'activity_name' => $activity['activity_name'],

                'objective' => $activity['objective'] ?? null,

                'score' => $activity['score'] ?? null,

                'observation' => $activity['observation'] ?? null,

            ]);
        }
    }

    protected function saveLingSixSound(
        LessonPlan $lessonPlan,
        array $data
    ): void {

        if (!isset($data['ling_six_sounds'])) {
            return;
        }

        foreach ($data['ling_six_sounds'] as $sound) {

            LingSixSoundResult::create([

                'lesson_plan_id' => $lessonPlan->id,

                'sound' => $sound['sound'],

                // Backend schema still uses `level`, but frontend uses `response`.
                // Keep function behavior: store into `level`.
                'level' => isset($sound['response']) ? (int) $sound['response'] : (int) ($sound['level'] ?? 0),

                'note' => $sound['note'] ?? null,

            ]);
        }
    }

    protected function saveEvaluation(
        LessonPlan $lessonPlan,
        array $data
    ): void {

        if (!isset($data['evaluation'])) {
            return;
        }

        $lessonPlan->evaluation()->create([
            'listening'      => $data['evaluation']['listening'] ?? null,
            'speech'         => $data['evaluation']['speech'] ?? null,
            'language'       => $data['evaluation']['language'] ?? null,
            'attention'      => $data['evaluation']['attention'] ?? null,
            'recommendation' => $data['evaluation']['recommendation'] ?? null,
        ]);
    }
}