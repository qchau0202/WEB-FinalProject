<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoteAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'note_uuid',
        'filename',
        'original_filename',
        'mime_type',
        'size',
        'path'
    ];

    public function note()
    {
        return $this->belongsTo(Note::class, 'note_uuid', 'uuid');
    }
} 