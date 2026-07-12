<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        $patients = Patient::query()
            ->with('therapist:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'photo', 'therapist_id'])
            ->map(function (Patient $patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'photo' => $patient->photo,
                    'therapist_id' => $patient->therapist_id,
                    'therapist_name' => $patient->therapist?->name,
                ];
            })
            ->values();

        $therapists = User::query()
            ->where('role', 'praktisi_avt')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->values();

        $schedules = Schedule::query()
            ->with(['patient:id,name,photo', 'therapist:id,name'])
            ->orderBy('schedule_date')
            ->orderBy('schedule_time')
            ->get()
            ->map(function (Schedule $schedule) {
                return [
                    'id' => $schedule->id,
                    'schedule_date' => $schedule->schedule_date,
                    'schedule_time' => $schedule->schedule_time,
                    'status' => $schedule->status,
                    'notes' => $schedule->notes,
                    'patient' => [
                        'id' => $schedule->patient?->id,
                        'name' => $schedule->patient?->name,
                        'photo' => $schedule->patient?->photo,
                    ],
                    'therapist' => [
                        'id' => $schedule->therapist?->id,
                        'name' => $schedule->therapist?->name,
                    ],
                ];
            })
            ->values();

        return Inertia::render('Admin/Jadwal/Jadwal', [
            'patients' => $patients,
            'therapists' => $therapists,
            'schedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'integer', 'exists:patients,id'],
            'therapist_id' => ['required', 'integer', 'exists:users,id'],
            'schedule_date' => ['required', 'date'],
            'schedule_time' => ['required', 'date_format:H:i'],
            'notes' => ['nullable', 'string'],
        ]);

        Schedule::create([
            'patient_id' => $validated['patient_id'],
            'therapist_id' => $validated['therapist_id'],
            'created_by_admin_id' => auth()->id(),
            'schedule_date' => $validated['schedule_date'],
            'schedule_time' => $validated['schedule_time'],
            'status' => 'scheduled',
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Jadwal berhasil dibuat.');
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'therapist_id' => ['required', 'exists:users,id'],
            'schedule_date' => ['required', 'date'],
            'schedule_time' => ['required', 'date_format:H:i'],
            'status' => ['required', 'in:scheduled,completed,cancelled'],
            'notes' => ['nullable', 'string'],
        ]);

        $schedule->update($validated);

        return back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return back()->with('success', 'Jadwal berhasil dihapus.');
    }
}