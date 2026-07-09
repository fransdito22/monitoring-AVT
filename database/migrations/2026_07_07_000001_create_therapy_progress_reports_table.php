<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('therapy_progress_reports', function (Blueprint $table) {
            $table->id();

            // Single report per lesson plan/session
            $table->foreignId('lesson_plan_id')->constrained('lesson_plans')->cascadeOnDelete();
            $table->unique('lesson_plan_id');

            $table->text('session_summary');
            $table->text('child_achievements');
            $table->text('difficulties');
            $table->text('child_response');
            $table->text('parent_recommendations');
            $table->text('home_activities');
            $table->text('goals_for_next_session');

            // optional therapist completion marker (not required, but helps future-proofing)
            $table->enum('status', ['draft', 'completed'])->default('draft');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('therapy_progress_reports');
    }
};