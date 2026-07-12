<?php

namespace App\Http\Controllers\Praktisi;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Services\TherapyService;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TherapyController extends Controller
{
    public function show(Request $request, Patient $patient, TherapyService $therapyService)
    {
        $therapyService->assertCanAccessPatient($patient, auth()->id());

        $data = $therapyService->show($patient);


        return Inertia::render('Praktisi/Therapy/Show', $data);
    }
}