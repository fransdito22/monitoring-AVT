<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin - 1 akun
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $therapists = [
           
            ['name' => 'Anisa Rahmawati', 'email' => 'anisarahmawati@gmail.com'],
            ['name' => 'Rizky Prasetyo', 'email' => 'rizkyprasetyo@gmail.com'],
            ['name' => 'Dewi Kartika', 'email' => 'dewikartika@gmail.com'],
            ['name' => 'Andi Saputra', 'email' => 'andisaputra@gmail.com'],
        ];

        foreach ($therapists as $therapist) {
            User::create([
                'name' => $therapist['name'],
                'email' => $therapist['email'],
                'password' => Hash::make('password'),
                'role' => 'praktisi_avt',
                'email_verified_at' => now(),
            ]);
        }

        $parents = [
            ['name' => 'Siti Aisyah', 'email' => 'ibusitisyah@gmail.com'],
            ['name' => 'Budi Santoso', 'email' => 'budisantoso79@yahoo.com'],
            ['name' => 'Nur Hidayah', 'email' => 'nur.hidayah.family@gmail.com'],
            ['name' => 'Agus Setiawan', 'email' => 'setiawan.agus84@gmail.com'],
            ['name' => 'Rina Wulandari', 'email' => 'rina.wulandari@outlook.com'],
            ['name' => 'Dedi Kurniawan', 'email' => 'dedikurniawan88@yahoo.co.id'],
            ['name' => 'Yuni Lestari', 'email' => 'yuni.lestari23@gmail.com'],
            ['name' => 'Hendra Wijaya', 'email' => 'wijaya.hendra@icloud.com'],
        ];

        foreach ($parents as $parent) {
            User::create([
                'name' => $parent['name'],
                'email' => $parent['email'],
                'password' => Hash::make('password'),
                'role' => 'orang_tua',
                'email_verified_at' => now(),
            ]);
        }
    }
}