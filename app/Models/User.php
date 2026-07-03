<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function reports()
    {
        return $this->hasMany(
            Report::class,
            'therapist_id'
        );
    }

    // Orang tua -> pasien (AVT children)
    public function avtChildren()
    {
        return $this->hasMany(Patient::class, 'parent_id');
    }

    // Backward compat
    public function children()
    {
        return $this->avtChildren();
    }

    // Backward compat alias
    public function patients()
    {
        return $this->avtChildren();
    }

    public function therapistSchedules()
    {
        return $this->hasMany(Schedule::class, 'therapist_id');
    }

    public function createdSchedules()
    {
        return $this->hasMany(Schedule::class, 'created_by_admin_id');
    }
}