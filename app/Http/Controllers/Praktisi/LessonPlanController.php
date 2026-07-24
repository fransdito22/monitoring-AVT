<?php

namespace App\Http\Controllers\Praktisi;

use App\Http\Controllers\Controller;
use App\Http\Requests\LessonPlan\StoreLessonPlanRequest;
use App\Http\Requests\LessonPlan\UpdateLessonPlanRequest;
use App\Models\LessonPlan;
use App\Services\LessonPlanService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LessonPlanController extends Controller
{
    public function __construct(
        protected LessonPlanService $service
    ) {}

    public function index(): Response
    {
        return Inertia::render(
            'Praktisi/LessonPlans/LessonPlan',
            [
                'lessonPlans' => $this->service->index(auth()->id()),
            ]
        );
    }

    public function create(): Response
    {
        return Inertia::render(
            'Praktisi/LessonPlans/CreateLessonPlan',
            [
                'schedules' => $this->service->availableSchedules(auth()->id()),
            ]
        );
    }

    public function store(StoreLessonPlanRequest $request): RedirectResponse
    {
        $lessonPlan = $this->service->store(
            $request->validated(),
            auth()->id()
        );

        return redirect()
            ->route('lesson-plans.show', $lessonPlan->id)
            ->with('success', 'Lesson Plan berhasil dibuat.');
    }

    public function show(LessonPlan $lessonPlan): Response
    {
        return Inertia::render(
            'Praktisi/LessonPlans/ShowLessonPlan',
            [
                'lessonPlan' => $this->service->show($lessonPlan),
            ]
        );
    }

    public function edit(LessonPlan $lessonPlan): Response
    {
        return Inertia::render(
            'Praktisi/LessonPlans/EditLessonPlan',
            [
                'lessonPlan' => $this->service->show($lessonPlan),
                'schedules' => $this->service->availableSchedules(auth()->id()),
            ]
        );
    }

    public function update(
        UpdateLessonPlanRequest $request,
        LessonPlan $lessonPlan
    ): RedirectResponse {
        $this->service->update(
            $lessonPlan,
            $request->validated()
        );

        return redirect()
            ->route('lesson-plans.show', $lessonPlan->id)
            ->with('success', 'Lesson Plan berhasil diperbarui.');
    }

    public function destroy(LessonPlan $lessonPlan): RedirectResponse
    {
        $this->service->destroy($lessonPlan);

        return redirect()
            ->route('lesson-plans.index')
            ->with('success', 'Lesson Plan berhasil dihapus.');
    }
}