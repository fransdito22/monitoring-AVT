<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['patient_id', 'therapist_id', 'session_date', 'summary', 'progress',])]
class Report extends Model
{
    protected $table = 'tes_artikulasi';

    protected $casts = [
        'session_date' => 'date',
    ];

    /**
     * Pasien yang dinilai
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Praktisi yang membuat laporan
     */
    public function therapist()
    {
        return $this->belongsTo(
            User::class,
            'therapist_id'
        );
    }

    /**
     * Detail penilaian artikulasi
     */
    public function details()
    {
        return $this->hasMany(
            ReportDetail::class
        );
    }
}
