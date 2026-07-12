<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Sesuai ketentuan task: 1 data per tabel + role konsisten dengan seeder/relasi lain di proyek.
        User::updateOrCreate(
            ['email' => 'admin@monitoring-avt.id'],
            [
                'name' => 'Admin Monitoring AVT',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'praktisi@monitoring-avt.id'],
            [
                'name' => 'Praktisi AVT',
                'password' => Hash::make('password'),
                'role' => 'praktisi_avt',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'orangtua@monitoring-avt.id'],
            [
                'name' => 'Orang Tua Anak Didik',
                'password' => Hash::make('password'),
                'role' => 'orang_tua',
                'email_verified_at' => now(),
            ]
        );
    }
}