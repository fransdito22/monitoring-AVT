<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['lesson_plan_id', 'activity_name', 'objective', 'score', 'observation'])]
class LessonActivity extends Model
{
    public function lessonPlan()
    {
        return $this->belongsTo(LessonPlan::class);
    }
}