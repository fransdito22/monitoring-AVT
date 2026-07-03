<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ParentSeeder extends Seeder
{
    public function run(): void
    {
        $parents = [
            [
                'name' => 'Sarah Thompson',
                'email' => 'sarah@example.com',
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael@example.com',
            ],
            [
                'name' => 'Emily Johnson',
                'email' => 'emily@example.com',
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david@example.com',
            ],
            [
                'name' => 'Jessica Brown',
                'email' => 'jessica@example.com',
            ],
            [
                'name' => 'Robert Davis',
                'email' => 'robert@example.com',
            ],
            [
                'name' => 'Linda Miller',
                'email' => 'linda@example.com',
            ],
            [
                'name' => 'Daniel Taylor',
                'email' => 'daniel@example.com',
            ],
        ];

        foreach ($parents as $parent) {
            User::updateOrCreate(
                ['email' => $parent['email']],
                [
                    'name' => $parent['name'],
                    'password' => Hash::make('password'),
                    'role' => 'orang_tua',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}