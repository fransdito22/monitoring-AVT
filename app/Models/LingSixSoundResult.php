<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['lesson_plan_id', 'sound', 'level','note'])]
class LingSixSoundResult extends Model {
    public function lessonPlan()
{
    return $this->belongsTo(LessonPlan::class);
}
}