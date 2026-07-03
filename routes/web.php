<?php

use App\Http\Controllers\OrangTua\DashboardController as OrangTuaDashboardController;
use App\Http\Controllers\OrangTua\TherapyScheduleController;
use App\Http\Controllers\Praktisi\DashboardController;
use App\Http\Controllers\Praktisi\LessonPlanController;
use App\Http\Controllers\Praktisi\PatientController;
use App\Http\Controllers\Praktisi\TesArtikulasiController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/

Route::get('/', function () {

    if (Auth::check()) {

        return match (Auth::user()->role) {
            'praktisi_avt' => redirect()->route('dashboard.praktisi'),
            'orangtua' => redirect()->route('dashboard.orangtua'),
            'admin' => redirect()->route('dashboard.admin'),
            default => redirect()->route('login'),
        };
    }

    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| AUTH + VERIFIED
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | PRAKTISI AVT
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:praktisi_avt')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | DASHBOARD
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/lesson-plans',
            [LessonPlanController::class, 'index']
        )->name('lesson-plans.index');

        Route::get(
            '/lesson-plans/praktisi/add',
            [LessonPlanController::class, 'create']
        )->name('lesson-plans.create');

        Route::post(
            '/lesson-plans/praktisi',
            [LessonPlanController::class, 'store']
        )->name('lesson-plans.store');

        Route::get(
            '/lesson-plans/praktisi/detail/{lessonPlan}',
            [LessonPlanController::class, 'show']
        )->name('lesson-plans.show');



        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard.praktisi');


        /*
        |--------------------------------------------------------------------------
        | REPORTS
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/reports',
            [TesArtikulasiController::class, 'index']
        )->name('reports.index');

        Route::get(
            '/reports/praktisi/add',
            [TesArtikulasiController::class, 'create']
        )->name('reports.create');

        Route::post(
            '/reports/praktisi',
            [TesArtikulasiController::class, 'store']
        )->name('reports.store');

        Route::get(
            '/reports/praktisi/detail',
            [TesArtikulasiController::class, 'show']
        )->name('reports.show');

        /*
        |--------------------------------------------------------------------------
        | PATIENTS
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/patients',
            [PatientController::class, 'index']
        )->name('patients.praktisi');

        Route::get(
            '/patients/{patient}',
            [PatientController::class, 'show']
        )->name('patients.show');

        /*
        |--------------------------------------------------------------------------
        | SCHEDULE
        |--------------------------------------------------------------------------
        */

        Route::get('/schedule', [\App\Http\Controllers\Praktisi\ScheduleController::class, 'index'])
            ->name('schedule.praktisi');
    });

    /*
    |--------------------------------------------------------------------------
    | ORANG TUA
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:orangtua')->group(function () {

        Route::get('/dashboard-orangtua', [OrangTuaDashboardController::class, 'index'])
            ->name('dashboard.orangtua');

        Route::get('/patients-orangtua', function () {
            return Inertia::render('OrangTua/Orangtua');
        })->name('patients.orangtua');

        Route::get('/schedule-orangtua', [TherapyScheduleController::class, 'index'])
            ->name('schedule.orangtua');

        Route::get('/child-progress', function () {
            return Inertia::render('OrangTua/ChildProgress');
        })->name('child-progress.orangtua');

        Route::get(
            '/progress-reports',
            [\App\Http\Controllers\OrangTua\ProgressReportsController::class, 'index']
        )->name('progress-reports.orangtua');
    });

    /*
    |--------------------------------------------------------------------------
    | ADMIN
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {

        Route::get('/dashboard-admin', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])
            ->name('dashboard.admin');

        Route::get('/schedule-admin', [\App\Http\Controllers\Admin\ScheduleController::class, 'index'])
            ->name('schedule.admin');
    });
});

/*
|--------------------------------------------------------------------------
| PROFILE PRAKTISI
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:praktisi_avt'])->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| PROFILE ORANG TUA
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:orangtua'])->group(function () {

    Route::get('/profile-orangtua', [ProfileController::class, 'edit'])
        ->name('profile.orangtua.edit');

    Route::patch('/profile-orangtua', [ProfileController::class, 'update'])
        ->name('profile.orangtua.update');

    Route::delete('/profile-orangtua', [ProfileController::class, 'destroy'])
        ->name('profile.orangtua.destroy');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';