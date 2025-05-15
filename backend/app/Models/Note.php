<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Hash;

class Note extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'is_public',
        'is_locked',
        'password',
        'last_edited_at',
        'last_edited_by'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_locked' => 'boolean',
        'last_edited_at' => 'datetime',
    ];

    protected $hidden = [
        'password',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function labels()
    {
        return $this->belongsToMany(Label::class, 'note_label', 'note_uuid', 'label_id')
            ->withTimestamps();
    }

    public function collaborators()
    {
        return $this->belongsToMany(User::class, 'note_collaborators', 'note_uuid', 'user_uuid')
            ->withPivot('permission', 'is_accepted', 'accepted_at')
            ->withTimestamps();
    }

    public function attachments()
    {
        return $this->hasMany(NoteAttachment::class, 'note_uuid', 'uuid');
    }

    public function setPasswordAttribute($value)
    {
        if ($value) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    public function verifyPassword($password)
    {
        if (!$this->is_locked) {
            return true;
        }
        return Hash::check($password, $this->password);
    }
} 