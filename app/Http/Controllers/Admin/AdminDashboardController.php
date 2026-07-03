<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalChildren = Patient::query()->count();
        $totalParents = User::query()->where('role', 'orang_tua')->count();
        $totalTherapists = User::query()->where('role', 'praktisi_avt')->count();
        $totalUserAccounts = User::query()->count();

        $recentRegisteredChildren = Patient::query()
            ->with(['parent:id,name', 'therapist:id,name'])
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'parent_id', 'therapist_id', 'created_at'])
            ->map(function (Patient $patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'parent_name' => $patient->parent?->name ?? '-',
                    'therapist_name' => $patient->therapist?->name ?? '-',
                    'created_at' => $patient->created_at?->toISOString(),
                ];
            })
            ->values();

        $recentlyCreatedAccounts = User::query()
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'role', 'created_at'])
            ->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at?->toISOString(),
                ];
            })
            ->values();

        $activities = collect();

        foreach ($recentRegisteredChildren as $child) {
            $activities->push([
                'type' => 'child_registered',
                'title' => 'New child registered',
                'description' => $child['name'] . ' has been registered.',
                'created_at' => $child['created_at'],
            ]);
        }

        foreach ($recentlyCreatedAccounts as $account) {
            $activities->push([
                'type' => 'account_created',
                'title' => 'New account created',
                'description' => $account['name'] . ' (' . $account['role'] . ') account created.',
                'created_at' => $account['created_at'],
            ]);
        }

        $recentActivities = $activities
            ->sortByDesc('created_at')
            ->take(8)
            ->values();

        return Inertia::render('Admin/Dashboard/Dashboard', [
            'summary' => [
                'totalChildren' => $totalChildren,
                'totalParents' => $totalParents,
                'totalTherapists' => $totalTherapists,
                'totalUserAccounts' => $totalUserAccounts,
            ],
            'recentRegisteredChildren' => $recentRegisteredChildren,
            'recentlyCreatedAccounts' => $recentlyCreatedAccounts,
            'recentActivities' => $recentActivities,
        ]);
    }
}