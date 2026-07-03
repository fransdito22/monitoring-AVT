<?php

namespace App\Http\Controllers\Praktisi;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $therapistId = Auth::id();

        // Ambil list pasien milik therapist ini (untuk UI filter/request)
        $patients = Patient::query()
            ->where('therapist_id', $therapistId)
            ->orderBy('name')
            ->get(['id', 'name', 'photo']);

        $sessions = Schedule::query()
            ->where('therapist_id', $therapistId)
            ->with(['patient'])
            ->orderBy('schedule_date', 'asc')
            ->orderBy('schedule_time', 'asc')
            ->get()
            ->map(function (Schedule $schedule) {
                return [
                    'id' => (string) $schedule->id,
                    'date' => $schedule->schedule_date,
                    'time' => $schedule->schedule_time,
                    'therapyType' => 'Therapy Session',
                    'patientName' => $schedule->patient?->name ?? '—',
                    'patientAvatar' => $schedule->patient?->photo ? (string) $schedule->patient?->photo : null,
                    'status' => match ($schedule->status) {
                        'completed' => 'Approved',
                        'cancelled' => 'Draft',
                        default => 'Scheduled',
                    },
                    'therapistNote' => $schedule->notes,
                ];
            });

        return Inertia::render('Praktisi/Jadwal/Schedule', [
            'sessions' => $sessions,
            'patients' => $patients->map(function (Patient $p) {
                return [
                    'id' => (int) $p->id,
                    'name' => $p->name,
                    'photo' => $p->photo,
                ];
            }),
        ]);
    }
}