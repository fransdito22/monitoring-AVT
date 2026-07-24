<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $therapists = User::where('role', 'praktisi_avt')->get();
        $parents = User::where('role', 'orang_tua')->get();

        if ($therapists->count() < 5 || $parents->count() < 8) {
            return;
        }

        $patientData = [
            // Patient 1 - Therapist Faris(0)
            [
                'name' => 'Rafa Pratama',
                'birth_date' => now()->subYears(4)->subDays(150),
                'gender' => 'L',
                'parent_index' => 0, // Siti Aisyah
                'therapist_index' => 0, // Faris
            ],
            // Patient 2 - Therapist Faris(0)
            [
                'name' => 'Naura Azzahra',
                'birth_date' => now()->subYears(3)->subDays(200),
                'gender' => 'P',
                'parent_index' => 1, // Budi Santoso
                'therapist_index' => 0, // Faris
            ],
            // Patient 3 - Therapist Anisa(1)
            [
                'name' => 'Arka Mahendra',
                'birth_date' => now()->subYears(5)->subDays(80),
                'gender' => 'L',
                'parent_index' => 2, // Nur Hidayah
                'therapist_index' => 1, // Anisa
            ],
            // Patient 4 - Therapist Anisa(1)
            [
                'name' => 'Kayla Putri',
                'birth_date' => now()->subYears(3)->subDays(300),
                'gender' => 'P',
                'parent_index' => 3, // Agus Setiawan
                'therapist_index' => 1, // Anisa
            ],
            // Patient 5 - Therapist Rizky(2)
            [
                'name' => 'Nizam Akbar',
                'birth_date' => now()->subYears(7)->subDays(45),
                'gender' => 'L',
                'parent_index' => 4, // Rina Wulandari
                'therapist_index' => 2, // Rizky
            ],
            // Patient 6 - Therapist Rizky(2)
            [
                'name' => 'Aluna Maharani',
                'birth_date' => now()->subYears(2)->subDays(180),
                'gender' => 'P',
                'parent_index' => 5, // Dedi Kurniawan
                'therapist_index' => 2, // Rizky
            ],
            // Patient 7 - Therapist Dewi(3)
            [
                'name' => 'Farel Ramadhan',
                'birth_date' => now()->subYears(8)->subDays(20),
                'gender' => 'L',
                'parent_index' => 6, // Yuni Lestari
                'therapist_index' => 3, // Dewi
            ],
            // Patient 8 - Therapist Andi(4)
            [
                'name' => 'Aqila Putri',
                'birth_date' => now()->subYears(5)->subDays(90),
                'gender' => 'P',
                'parent_index' => 7, // Hendra Wijaya
                'therapist_index' => 4, // Andi
            ],
        ];

        foreach ($patientData as $data) {
            Patient::create([
                'name' => $data['name'],
                'birth_date' => $data['birth_date'],
                'gender' => $data['gender'],
                'parent_id' => $parents[$data['parent_index']]->id,
                'therapist_id' => $therapists[$data['therapist_index']]->id,
                'status' => 'aktif',
                'progress' => 0,
            ]);
        }
    }
}