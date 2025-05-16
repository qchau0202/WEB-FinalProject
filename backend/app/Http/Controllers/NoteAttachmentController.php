<?php

namespace App\Http\Controllers;

use App\Models\NoteAttachment;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NoteAttachmentController extends Controller
{
    // List all attachments for a note
    public function index($note_uuid)
    {
        $attachments = NoteAttachment::where('note_uuid', $note_uuid)->get();
        return response()->json(['attachments' => $attachments]);
    }

    // Store/upload a new attachment
    public function store(Request $request, $note_uuid)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // max 10MB
        ]);

        $file = $request->file('file');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('public/note_attachments', $filename);

        $attachment = NoteAttachment::create([
            'note_uuid' => $note_uuid,
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'path' => $path,
        ]);

        return response()->json(['attachment' => $attachment], 201);
    }

    // Show/download an attachment
    public function show($note_uuid, $id)
    {
        $attachment = NoteAttachment::where('note_uuid', $note_uuid)->findOrFail($id);
        return Storage::download($attachment->path, $attachment->original_filename);
    }

    // Delete an attachment
    public function destroy($note_uuid, $id)
    {
        $attachment = NoteAttachment::where('note_uuid', $note_uuid)->findOrFail($id);
        Storage::delete($attachment->path);
        $attachment->delete();
        return response()->json(['message' => 'Attachment deleted']);
    }
} 