<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lesson_plans', function (Blueprint $table) {
            // Drop columns to match refactor that removed long_term_goal/short_term_goal
            $table->dropColumn('long_term_goal');
            $table->dropColumn('short_term_goal');
        });
    }

    public function down(): void
    {
        Schema::table('lesson_plans', function (Blueprint $table) {
            // Restore as nullable to be safe during rollback
            $table->text('long_term_goal')->nullable();
            $table->text('short_term_goal')->nullable();
        });
    }
};