<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'patient_id',
    'schedule_id',
    'therapist_id',
    'session_date',
    'session_number',
    'long_term_goal',
    'short_term_goal',
    'home_program',
    'therapist_note',
    'status',
])]
class LessonPlan extends Model
{
    protected function casts(): array
    {
        return [
            'session_date' => 'date',
            'home_program' => 'array',
        ];
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function therapist()
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function activities()
    {
        return $this->hasMany(LessonActivity::class);
    }

    public function evaluation()
    {
        return $this->hasOne(LessonEvaluation::class);
    }

    public function lingSixSounds()
    {
        return $this->hasMany(
            LingSixSoundResult::class,
            'lesson_plan_id'
        );
    }
}