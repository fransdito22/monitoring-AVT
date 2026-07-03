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
        Schema::table('lesson_plans', function (Blueprint $table) {
            $table->foreignId('schedule_id')
                ->nullable()
                ->after('patient_id')
                ->constrained('schedules')
                ->nullOnDelete();

            $table->unique('schedule_id', 'lesson_plans_unique_schedule_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lesson_plans', function (Blueprint $table) {
            $table->dropUnique('lesson_plans_unique_schedule_id');
            $table->dropConstrainedForeignId('schedule_id');
        });
    }
};