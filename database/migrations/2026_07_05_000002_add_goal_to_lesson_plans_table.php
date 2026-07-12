<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lesson_plans', function (Blueprint $table) {
            // single goals field (refactor dari long_term_goal & short_term_goal)
            $table->text('goal')->nullable()->after('session_number');
        });

        // Backfill existing data (best-effort):
        // - if long_term_goal is filled, use it; else use short_term_goal
        // - ignore if columns don't exist in some environments
        try {
            DB::statement("
                UPDATE lesson_plans
                SET goal = COALESCE(long_term_goal, short_term_goal)
                WHERE goal IS NULL
            ");
        } catch (\Throwable $e) {
            // ignore backfill failures to keep migration safe across schemas
        }
    }

    public function down(): void
    {
        Schema::table('lesson_plans', function (Blueprint $table) {
            $table->dropColumn('goal');
        });
    }
};