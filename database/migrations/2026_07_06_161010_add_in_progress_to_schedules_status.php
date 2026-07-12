<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // MySQL enum alteration (schedules.status: scheduled, completed, cancelled)
        // Add: in_progress
        \Illuminate\Support\Facades\DB::statement("
            ALTER TABLE schedules
            MODIFY status ENUM('scheduled', 'in_progress', 'completed', 'cancelled')
            NOT NULL DEFAULT 'scheduled'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back (remove in_progress)
        \Illuminate\Support\Facades\DB::statement("
            ALTER TABLE schedules
            MODIFY status ENUM('scheduled', 'completed', 'cancelled')
            NOT NULL DEFAULT 'scheduled'
        ");
    }
};