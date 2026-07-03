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
        // Jika tabel sudah pernah ada (karena kondisi DB dev yang tidak konsisten),
        // buat operasi rename idempotent.
        if (Schema::hasTable('reports') && !Schema::hasTable('tes_artikulasi')) {
            Schema::rename('reports', 'tes_artikulasi');
        }

        if (
            Schema::hasTable('report_details') &&
            !Schema::hasTable('tes_artikulasi_details')
        ) {
            Schema::rename('report_details', 'tes_artikulasi_details');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('tes_artikulasi', 'reports');
        Schema::rename('tes_artikulasi_details', 'report_details');
    }
};
