<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'uuid';      // <--- Set primary key to 'uuid'
    protected $keyType = 'string';       // <--- UUID is a string
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'verification_token',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'verification_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function labels()
    {
        return $this->hasMany(Label::class);
    }

    public function passwordResets()
    {
        return $this->hasMany(PasswordReset::class);
    }

    public function sharedNotes()
    {
        return $this->belongsToMany(Note::class, 'note_collaborators')
            ->withPivot('permission')
            ->withTimestamps();
    }

    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return asset('https://avatar.iran.liara.run/public/4');
        }

        // If the avatar is a base64 string (legacy format)
        if (str_starts_with($this->avatar, 'data:image')) {
            return $this->avatar;
        }

        // If the avatar is a stored file path
        return asset('storage/' . $this->avatar);
    }
}