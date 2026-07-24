<?php

namespace Database\Seeders;

use App\Models\Schedule;
use App\Models\Patient;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ScheduleSeeder extends Seeder
{
    private const TOTAL_SESSIONS = 3;
    private const DAYS_BACK = 30;

    public function run(): void
    {
        $patients = Patient::all();

        if ($patients->count() < 8) {
            return;
        }

        $today = Carbon::today();
        $startDate = $today->copy()->subDays(self::DAYS_BACK);

        $schedules = [];

        foreach ($patients as $patientIndex => $patient) {
            for ($session = 1; $session <= self::TOTAL_SESSIONS; $session++) {
                // Distribute sessions ~1 week apart within the 30-day window
                $dayOffset = ($patientIndex * 3 + $session - 1) * 7;
                $sessionDate = $startDate->copy()->addDays($dayOffset);

                // Determine status
                // Session 3 for patient 0,1,2,3,4 = completed (sesi ke-3 dalam 30 hari masih masuk)
                // Patient 0 session 3 = day 14, patient 1 session 2 = day 10, all within 30 days
                // We want: 80% completed, 15% scheduled, 5% cancelled
                // 19 completed, 4 scheduled, 1 cancelled = 24 total (8 patients * 3 sessions)

                $status = 'completed';
                $scheduleTime = '08:00:00';

                // Last few sessions should be scheduled (future) or in_progress
                if ($patientIndex >= 6 && $session === 3) {
                    // Patient 7 (Aqila) session 3 -> scheduled (future)
                    $status = 'scheduled';
                    $sessionDate = $today->copy()->addDays(2);
                } elseif ($patientIndex === 5 && $session === 3) {
                    // Patient 6 (Aluna) session 3 -> scheduled (future)
                    $status = 'scheduled';
                    $sessionDate = $today->copy()->addDays(5);
                } elseif ($patientIndex === 4 && $session === 3) {
                    // Patient 5 (Nizam) session 3 -> cancelled
                    $status = 'cancelled';
                } elseif ($patientIndex === 3 && $session === 3) {
                    // Patient 4 (Kayla) session 3 -> scheduled (future)
                    $status = 'scheduled';
                    $sessionDate = $today->copy()->addDays(1);
                } elseif ($patientIndex === 2 && $session === 3) {
                    // Patient 3 (Arka) session 3 -> scheduled
                    $status = 'scheduled';
                    $sessionDate = $today->copy()->addDays(7);
                } elseif ($patientIndex === 0 && $session === 3) {
                    // Patient 1 (Rafa) session 3 -> in_progress (today)
                    $status = 'in_progress';
                    $sessionDate = $today->copy();
                }

                // Ensure dates are within range and sequential
                if ($sessionDate->gt($today) && $status !== 'scheduled') {
                    // If date would be in the future but not scheduled, adjust
                    $sessionDate = $today->copy()->subDays(rand(1, 5));
                }

                // Rotate time slots
                $timeSlots = ['08:00:00', '09:00:00', '10:00:00', '11:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00'];
                $scheduleTime = $timeSlots[($patientIndex * 3 + $session) % 8];

                $schedules[] = [
                    'patient_id' => $patient->id,
                    'therapist_id' => $patient->therapist_id,
                    'created_by_admin_id' => null,
                    'schedule_date' => $sessionDate->toDateString(),
                    'schedule_time' => $scheduleTime,
                    'status' => $status,
                    'notes' => $this->getNote($session, $status),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Sort by date to ensure sequential ordering
        usort($schedules, function ($a, $b) {
            return $a['schedule_date'] <=> $b['schedule_date'];
        });

        foreach ($schedules as $schedule) {
            Schedule::create($schedule);
        }
    }

    private function getNote(int $session, string $status): string
    {
        $notes = [
            1 => 'Sesi terapi awal fokus pada asesmen awal dan pengenalan stimulus dasar.',
            2 => 'Sesi terapi lanjutan dengan target peningkatan respons terhadap instruksi.',
            3 => 'Sesi terapi akhir dengan evaluasi perkembangan dan rencana tindak lanjut.',
        ];

        $note = $notes[$session] ?? 'Sesi terapi rutin.';

        if ($status === 'cancelled') {
            $note = 'Dibatalkan karena anak dalam kondisi kurang sehat.';
        } elseif ($status === 'scheduled') {
            $note = 'Jadwal terapi lanjutan.';
        } elseif ($status === 'in_progress') {
            $note = 'Sesi terapi sedang berlangsung.';
        }

        return $note;
    }
}