<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $therapist = User::where('role', 'praktisi_avt')->first();
        $parent = User::where('role', 'orang_tua')->first();

        if (!$therapist || !$parent) {
            return;
        }

        Patient::updateOrCreate(
            [
                'parent_id' => $parent->id,
                'therapist_id' => $therapist->id,
                'name' => 'Ananda Putri Lestari',
            ],
            [
                'birth_date' => now()->subYears(6)->subDays(20),
                'gender' => 'P',
                'status' => 'dalam_terapi',
                'progress' => 0,
            ]
        );
    }
}