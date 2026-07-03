<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'praktisi@avt.com'],
            [
                'name' => 'Praktisi AVT',
                'password' => Hash::make('password'),
                'role' => 'praktisi_avt',
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            UserSeeder::class,
            ParentSeeder::class,
            PatientSeeder::class,
        ]);
    }
}