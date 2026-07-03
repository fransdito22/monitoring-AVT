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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();

            $table->foreignId('therapist_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('created_by_admin_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->date('schedule_date');
            $table->time('schedule_time');

            $table->enum('status', ['scheduled', 'completed', 'cancelled'])
                ->default('scheduled');

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['therapist_id', 'schedule_date']);
            $table->index(['patient_id', 'schedule_date']);
            $table->unique(['therapist_id', 'patient_id', 'schedule_date', 'schedule_time'], 'schedules_unique_slot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};