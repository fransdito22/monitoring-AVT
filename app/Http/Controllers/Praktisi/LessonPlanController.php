<?php

namespace App\Http\Controllers\Praktisi;

use App\Http\Controllers\Controller;
use App\Http\Requests\LessonPlan\StoreLessonPlanRequest;
use App\Http\Requests\LessonPlan\UpdateLessonPlanRequest;
use App\Http\Requests\UpdateLessonPlanRequest as RequestsUpdateLessonPlanRequest;
use App\Models\LessonPlan;
use App\Services\LessonPlanService;
use Inertia\Inertia;

/**
 * NOTE: Intelephense sometimes can't infer return type from services, so access
 * to `$lessonPlan->id` may be flagged as undefined even though it works at runtime.
 */
class LessonPlanController extends Controller
{
    public function __construct(
        protected LessonPlanService $service
    ) {}

    /**
     * Daftar Lesson Plan
     */
    public function index()
    {
        return Inertia::render(
            'Praktisi/LessonPlans/LessonPlan',
            [
                'lessonPlans' => $this->service->index(auth()->id()),
            ]
        );
    }

    /**
     * Form tambah Lesson Plan
     */
    public function create()
    {
        return Inertia::render(
            'Praktisi/LessonPlans/CreateLessonPlan',
            [
                'schedules' => $this->service->availableSchedules(auth()->id()),
            ]
        );
    }

    /**
     * Simpan Lesson Plan
     */
    public function store(StoreLessonPlanRequest $request)
    {
        $lessonPlan = $this->service->store(
            $request->validated(),
            auth()->id()
        );

        $lessonPlanId = $lessonPlan->getAttribute('id');

        return redirect()
            ->route('lesson-plans.show', $lessonPlanId)
            ->with('success', 'Lesson Plan berhasil dibuat.');
    }


    /**
     * Detail Lesson Plan
     */
    public function show(LessonPlan $lessonPlan)
    {
        return Inertia::render(
            'Praktisi/LessonPlans/ShowLessonPlan',
            [
                'lessonPlan' => $this->service->show($lessonPlan),
            ]
        );
    }

    /**
     * Form Edit Lesson Plan
     */
    public function edit(LessonPlan $lessonPlan)
    {
        return Inertia::render(
            'Praktisi/LessonPlans/EditLessonPlan',
            [
                'lessonPlan' => $this->service->show($lessonPlan),
                'schedules' => $this->service->availableSchedules(auth()->id()),
            ]
        );
    }

    /**
     * Update Lesson Plan
     */
    public function update(
        RequestsUpdateLessonPlanRequest $request,
        LessonPlan $lessonPlan
    ) {
        $lessonPlan = $this->service->update(
            $lessonPlan,
            $request->validated()
        );

        $updatedLessonPlanId = $lessonPlan->getAttribute('id');

        return redirect()
            ->route('lesson-plans.show', $updatedLessonPlanId)
            ->with('success', 'Lesson Plan berhasil diperbarui.');
    }


    /**
     * Hapus Lesson Plan
     */
    public function destroy(LessonPlan $lessonPlan)
    {
        $this->service->destroy($lessonPlan);

        return redirect()
            ->route('lesson-plans.index')
            ->with('success', 'Lesson Plan berhasil dihapus.');
    }
}
