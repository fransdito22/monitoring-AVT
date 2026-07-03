<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@avtconnect.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Dr. Rina Kusuma',
            'email' => 'terapis@avtconnect.id',
            'password' => Hash::make('password'),
            'role' => 'therapist',
        ]);

        User::create([
            'name' => 'Budi Santoso',
            'email' => 'orangtua@avtconnect.id',
            'password' => Hash::make('password'),
            'role' => 'parent',
        ]);
    }
}