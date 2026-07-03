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
        Schema::create('ling_six_sound_results', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_plan_id');

            $table->enum('sound', ['m', 'u', 'i', 'a', 'sh', 's']);

            $table->tinyInteger('level');
            // 0 Not detected
            // 1 Detected
            // 2 Discriminated
            // 3 Identified
            // 4 Comprehended

            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ling_six_sound_results');
    }
};