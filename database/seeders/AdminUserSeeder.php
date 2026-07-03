<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Seeder khusus untuk akun admin agar bisa login ke dashboard admin.
        // password default: admin123
        User::updateOrCreate(
            ['email' => 'admin@avt.test'],
            [
                'name' => 'Admin AVT',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );
    }
}