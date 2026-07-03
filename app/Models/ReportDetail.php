<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['report_id', 'target_word', 'target_phoneme', 'category', 'note',])]
class ReportDetail extends Model
{
    protected $table = 'tes_artikulasi_details';

    public function report()
    {
        return $this->belongsTo(
            Report::class
        );
    }
}
