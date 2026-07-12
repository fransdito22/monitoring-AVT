<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ParentSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'orangtua.utama@monitoring-avt.id'],
            [
                'name' => 'Siti Rahmawati',
                'password' => Hash::make('password'),
                'role' => 'orang_tua',
                'email_verified_at' => now(),
            ]
        );
    }
}