<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Note extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'is_public',
        'is_pinned',
        'pinned_at',
        'lock_feature_enabled',
        'is_locked',
        'password',
        'last_edited_at',
        'last_edited_by',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_pinned' => 'boolean',
        'lock_feature_enabled' => 'boolean',
        'is_locked' => 'boolean',
        'pinned_at' => 'datetime',
        'last_edited_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'uuid');
    }

    public function lastEditor()
    {
        return $this->belongsTo(User::class, 'last_edited_by', 'uuid');
    }

    public function labels()
    {
        return $this->belongsToMany(Label::class, 'note_labels', 'note_uuid', 'label_id')
            ->withTimestamps();
    }

    public function collaborators()
    {
        return $this->belongsToMany(User::class, 'note_collaborators', 'note_uuid', 'user_uuid')
            ->withPivot(['permission', 'status', 'accepted_at', 'shared_by'])
            ->withTimestamps();
    }

    public function attachments()
    {
        return $this->hasMany(NoteAttachment::class, 'note_uuid', 'uuid');
    }

    // Password handling
    public function verifyPassword($input)
    {
        return Hash::check($input, $this->password);
    }

    // Scopes
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeLocked($query)
    {
        return $query->where('is_locked', true);
    }

    public function scopeUnlocked($query)
    {
        return $query->where('is_locked', false);
    }

    public function scopeWithLockFeature($query)
    {
        return $query->where('lock_feature_enabled', true);
    }
} 