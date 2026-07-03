<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\ChildController;
use App\Http\Controllers\Admin\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');

    Route::get('/children', [ChildController::class, 'index'])->name('children.index');
    Route::post('/children', [ChildController::class, 'store'])->name('children.store');

    Route::patch('/children/{patient}/status', [ChildController::class, 'updateStatus'])
        ->name('children.status.update');

    Route::get('/schedules', [ScheduleController::class, 'index'])->name('schedules.index');
    Route::post('/schedules', [ScheduleController::class, 'store'])->name('schedules.store');
    Route::put('/schedules/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');
    Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy'])->name('schedules.destroy');

    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');

    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');


    Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.reset-password');
});