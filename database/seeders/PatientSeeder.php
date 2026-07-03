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

        $parents = User::where('role', 'orang_tua')->get();

        if (!$therapist || $parents->count() === 0) {
            return;
        }

        $patients = [
            [
                'name' => 'Leo Thompson',
                'status' => 'dalam_terapi',
                'progress' => 0,
                'gender' => 'L',
            ],
            [
                'name' => 'Mia Chen',
                'status' => 'aktif',
                'progress' => 0,
                'gender' => 'P',
            ],
            [
                'name' => 'Oliver Smith',
                'status' => 'tinjau_ulang',
                'progress' => 0,
                'gender' => 'L',
            ],
            [
                'name' => 'Emma Johnson',
                'status' => 'aktif',
                'progress' => 0,
                'gender' => 'P',
            ],
            [
                'name' => 'Noah Wilson',
                'status' => 'dalam_terapi',
                'progress' => 0,
                'gender' => 'L',
            ],
            [
                'name' => 'Sophia Brown',
                'status' => 'aktif',
                'progress' => 0,
                'gender' => 'P',
            ],
            [
                'name' => 'Liam Davis',
                'status' => 'tinjau_ulang',
                'progress' => 0,
                'gender' => 'L',
            ],
            [
                'name' => 'Ava Miller',
                'status' => 'aktif',
                'progress' => 0,
                'gender' => 'P',
            ],
            [
                'name' => 'Ethan Taylor',
                'status' => 'dalam_terapi',
                'progress' => 0,
                'gender' => 'L',
            ],
            [
                'name' => 'Isabella Anderson',
                'status' => 'aktif',
                'progress' => 0,
                'gender' => 'P',
            ],
        ];

        foreach ($patients as $index => $patient) {

            Patient::create([
                'name' => $patient['name'],
                'birth_date' => now()
                    ->subYears(rand(3, 10))
                    ->subDays(rand(1, 365)),
                'gender' => $patient['gender'],
                'status' => $patient['status'],
                'progress' => $patient['progress'],
                'parent_id' => $parents[$index % $parents->count()]->id,
                'therapist_id' => $therapist->id,
            ]);
        }
    }
}