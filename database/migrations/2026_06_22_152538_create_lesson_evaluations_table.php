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
        Schema::create('lesson_evaluations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_plan_id');

            $table->integer('listening');
            $table->integer('speech');
            $table->integer('language');
            $table->integer('attention');

            $table->text('recommendation')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_evaluations');
    }
};
