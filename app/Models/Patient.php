<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'birth_date', 'gender', 'photo', 'user_id', 'parent_id', 'therapist_id', 'status', 'progress',])]
class Patient extends Model
{
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function therapist()
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    public function lessonPlans()
    {
        return $this->hasMany(LessonPlan::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function tesArtikulasi()
    {
        return $this->hasMany(
            Report::class
        );
    }

    // Backward compat
    public function reports()
    {
        return $this->tesArtikulasi();
    }

    public function user()
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }

}