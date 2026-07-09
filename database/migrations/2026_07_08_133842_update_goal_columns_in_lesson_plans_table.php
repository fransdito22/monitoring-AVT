<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lesson_plans', function (Blueprint $table) {
            $table->renameColumn('goal', 'long_term_goal');

            $table->text('short_term_goal')
                ->nullable()
                ->after('long_term_goal');


        });
    }

    public function down(): void
    {
        Schema::table('lesson_plans', function (Blueprint $table) {
            $table->renameColumn('long_term_goal', 'goal');

            $table->dropColumn('short_term_goal');

            $table->dropConstrainedForeignId('therapist_id');

            $table->dropColumn('status');
        });
    }
};