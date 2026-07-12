<?php

namespace Database\Seeders;

use App\Models\Schedule;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $therapist = User::where('role', 'praktisi_avt')->first();
        $patient = Patient::first();

        if (!$therapist || !$patient) {
            return;
        }

        Schedule::updateOrCreate(
            [
                'patient_id' => $patient->id,
                'therapist_id' => $therapist->id,
                'schedule_date' => Carbon::today()->toDateString(),
                'schedule_time' => Carbon::createFromTime(10, 0, 0)->format('H:i:s'),
            ],
            [
                'created_by_admin_id' => null,
                'status' => 'in_progress',
                'notes' => 'Rencana terapi sesi hari ini difokuskan untuk stimulasi kemampuan mendengar dan perhatian anak.',
            ]
        );
    }
}