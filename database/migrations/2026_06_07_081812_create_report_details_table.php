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
        Schema::create('tes_artikulasi_details', function (Blueprint $table) {

            $table->id();

            // Mengarah ke tabel yang sudah di-rename (reports -> tes_artikulasi)
            $table->foreignId('report_id')
                ->constrained('tes_artikulasi')
                ->cascadeOnDelete();

            $table->string('target_word');


            $table->string('target_phoneme');

            $table->enum('category', [
                'Normal',
                'Omisi',
                'Distorsi',
                'Adisi',
                'Substitusi',
            ]);

            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tes_artikulasi_details');
    }
};
