<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Services\TherapyService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChildProgressController extends Controller
{
    public function index(TherapyService $therapyService)
    {
        $parentId = Auth::id();

        $primaryChild = Patient::query()
            ->where('parent_id', $parentId)
            ->orderByDesc('updated_at')
            ->first();

        if (!$primaryChild) {
            return Inertia::render('OrangTua/ChildProgress/index', [
                'progressSummary' => null,
                'progressChart' => [],
                'lingSixSounds' => [],
                'sessionEvaluationChart' => [],
                'therapyHistory' => [],
            ]);
        }

        $data = $therapyService->getChildProgressData($primaryChild);

        return Inertia::render('OrangTua/ChildProgress/index', $data);
    }
}