<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['lesson_plan_id', 'listening', 'speech', 'language', 'attention', 'recommendation'])]
class LessonEvaluation extends Model {}
