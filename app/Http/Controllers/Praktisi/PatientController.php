<?php


namespace App\Http\Controllers\Praktisi;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $therapistId = auth()->id();

        $patients = Patient::query()
            ->with(['parent', 'therapist'])
            ->where('therapist_id', $therapistId)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {

                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhereHas('parent', function ($parent) use ($search) {
                            $parent->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(12)
            ->through(function ($patient) {

                return [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'photo' => $patient->photo,
                    'status' => $patient->status,
                    'progress' => $patient->progress,
                    'age' => $patient->birth_date
                        ? \Carbon\Carbon::parse($patient->birth_date)->age
                        : null,
                    'birth_date' => $patient->birth_date,
                    'parent' => [
                        'id' => $patient->parent?->id,
                        'name' => $patient->parent?->name,
                    ],
                    'therapist' => [
                        'id' => $patient->therapist?->id,
                        'name' => $patient->therapist?->name,
                    ],
                    'created_at' => $patient->created_at,
                ];
            })
            ->withQueryString();

        return Inertia::render('Praktisi/Pasien/Patients', [
            'patients' => $patients,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(Patient $patient)
    {
        if ($patient->therapist_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses ke pasien ini.');
        }

        $patient->load(['parent', 'therapist']);

        return Inertia::render('Praktisi/Pasien/DetailPatient', [
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->name,
                'photo' => $patient->photo,
                'status' => $patient->status,
                'progress' => $patient->progress,
                'birth_date' => $patient->birth_date,
                'age' => $patient->birth_date
                    ? \Carbon\Carbon::parse($patient->birth_date)->age
                    : null,
                'gender' => $patient->gender,
                'parent' => [
                    'id' => $patient->parent?->id,
                    'name' => $patient->parent?->name,
                ],
                'therapist' => [
                    'id' => $patient->therapist?->id,
                    'name' => $patient->therapist?->name,
                ],
                'created_at' => $patient->created_at,
                'updated_at' => $patient->updated_at,
            ],
        ]);
    }

    public function create()
    {
        $parents = User::query()
            ->where('role', 'orang_tua')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/pasien/Create', [
            'parents' => $parents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:L,P',
            'parent_id' => 'nullable|exists:users,id',
            'status' => 'required',
        ]);

        $validated['therapist_id'] = auth()->id();

        Patient::create($validated);

        return back()->with('success', 'Pasien berhasil ditambahkan');
    }

    public function update(Request $request, Patient $patient)
    {
        if ($patient->therapist_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses ke pasien ini.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:L,P',
            'parent_id' => 'nullable|exists:users,id',
            'status' => 'required',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $patient->update($validated);

        return back()->with('success', 'Pasien berhasil diperbarui');
    }

    public function destroy(Patient $patient)
    {
        if ($patient->therapist_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses ke pasien ini.');
        }

        $patient->delete();

        return back()->with('success', 'Pasien berhasil dihapus');
    }
}