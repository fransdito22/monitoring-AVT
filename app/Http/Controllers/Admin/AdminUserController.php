<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(): \Inertia\Response
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'email_verified_at'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Users/Users', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'in:praktisi_avt,orang_tua,admin'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'email_verified_at' => now(),
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }


    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
            'role' => ['required', 'string', 'in:praktisi_avt,orang_tua,admin'],
        ]);

        // prevent changing email to one that belongs to another user
        $emailOwner = User::query()
            ->where('email', $validated['email'])
            ->where('id', '!=', $user->id)
            ->exists();

        if ($emailOwner) {
            return back()->withErrors(['email' => 'Email sudah digunakan user lain.'])->withInput();
        }

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ])->save();

        return back();
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        // (optional policy) prevent admin deleting itself or other admin
        // If you want remove this restriction, delete the block below.
        if ($user->role === 'admin') {
            return back()->withErrors(['delete' => 'Tidak diizinkan menghapus akun admin.']);
        }

        $user->delete();

        return back();
    }

    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        // only admin can reset for other users; no need current password
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user->forceFill([
            'password' => Hash::make($validated['password']),
            'remember_token' => Str::random(60),
        ])->save();

        return back();
    }
}