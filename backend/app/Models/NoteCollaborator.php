<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoteCollaborator extends Model
{
    protected $table = 'note_collaborators';

    protected $fillable = [
        'note_uuid',
        'user_uuid',
        'shared_by',
        'permission',
        'status',
        'accepted_at',
    ];

    public function note()
    {
        return $this->belongsTo(Note::class, 'note_uuid', 'uuid');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_uuid', 'uuid');
    }

    public function inviter()
    {
        return $this->belongsTo(User::class, 'shared_by', 'uuid');
    }
}