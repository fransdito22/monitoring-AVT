<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['patient_id', 'schedule_id', 'session_date', 'session_number', 'long_term_goal', 'short_term_goal', 'home_program', 'therapist_note'])]
class LessonPlan extends Model
{


    public function lingSixSounds()
    {
        return $this->hasMany(LingSixSoundResult::class);
    }

    public function activities()
    {
        return $this->hasMany(LessonActivity::class);
    }

    public function evaluation()
    {
        return $this->hasOne(LessonEvaluation::class);
    }



    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}