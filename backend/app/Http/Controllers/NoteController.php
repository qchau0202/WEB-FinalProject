<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Label;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Get user's own notes
        $notes = Note::where('user_id', $user->uuid)
            ->with(['labels', 'collaborators'])
            ->orderBy('updated_at', 'desc')
            ->get();

        // Get notes shared with user
        $sharedNotes = Note::whereHas('collaborators', function ($query) use ($user) {
            $query->where('user_uuid', $user->uuid)
                  ->where('is_accepted', true);
        })->with(['labels', 'collaborators', 'user'])
          ->orderBy('updated_at', 'desc')
          ->get();

        return response()->json([
            'own_notes' => $notes,
            'shared_notes' => $sharedNotes
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_public' => 'boolean',
            'is_locked' => 'boolean',
            'password' => 'required_if:is_locked,true|string|min:6',
            'labels' => 'array',
            'labels.*' => 'exists:labels,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        
        $note = Note::create([
            'user_id' => $user->uuid,
            'title' => $request->title,
            'content' => $request->content,
            'is_public' => $request->is_public ?? false,
            'is_locked' => $request->is_locked ?? false,
            'password' => $request->password,
            'last_edited_at' => now(),
            'last_edited_by' => $user->uuid
        ]);

        if ($request->has('labels')) {
            $note->labels()->attach($request->labels);
        }

        return response()->json([
            'message' => 'Note created successfully',
            'note' => $note->load(['labels', 'collaborators'])
        ], 201);
    }

    public function show($uuid)
    {
        $user = Auth::user();
        $note = Note::with(['labels', 'collaborators', 'user'])->findOrFail($uuid);

        // Check if user has access to the note
        if ($note->user_id !== $user->uuid && 
            !$note->is_public && 
            !$note->collaborators()->where('user_uuid', $user->uuid)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($note);
    }

    public function update(Request $request, $uuid)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'content' => 'string',
            'is_public' => 'boolean',
            'is_locked' => 'boolean',
            'password' => 'required_if:is_locked,true|string|min:6',
            'labels' => 'array',
            'labels.*' => 'exists:labels,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        // Check if user has permission to edit
        if ($note->user_id !== $user->uuid && 
            !$note->collaborators()
                ->where('user_uuid', $user->uuid)
                ->where('permission', 'write')
                ->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $note->update([
            'title' => $request->title ?? $note->title,
            'content' => $request->content ?? $note->content,
            'is_public' => $request->has('is_public') ? $request->is_public : $note->is_public,
            'is_locked' => $request->has('is_locked') ? $request->is_locked : $note->is_locked,
            'password' => $request->password ?? $note->password,
            'last_edited_at' => now(),
            'last_edited_by' => $user->uuid
        ]);

        if ($request->has('labels')) {
            $note->labels()->sync($request->labels);
        }

        return response()->json([
            'message' => 'Note updated successfully',
            'note' => $note->load(['labels', 'collaborators'])
        ]);
    }

    public function destroy($uuid)
    {
        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully']);
    }

    public function addCollaborator(Request $request, $uuid)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'permission' => 'required|in:read,write'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $collaborator = User::where('email', $request->email)->first();

        // Don't allow adding the owner as a collaborator
        if ($collaborator->uuid === $user->uuid) {
            return response()->json(['message' => 'Cannot add note owner as collaborator'], 422);
        }

        // Check if already a collaborator
        if ($note->collaborators()->where('user_uuid', $collaborator->uuid)->exists()) {
            return response()->json(['message' => 'User is already a collaborator'], 422);
        }

        $note->collaborators()->attach($collaborator->uuid, [
            'permission' => $request->permission,
            'is_accepted' => false
        ]);

        return response()->json([
            'message' => 'Collaborator added successfully',
            'collaborator' => $collaborator
        ]);
    }

    public function removeCollaborator($uuid, $userId)
    {
        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $note->collaborators()->detach($userId);

        return response()->json(['message' => 'Collaborator removed successfully']);
    }

    public function uploadAttachment(Request $request, $uuid)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240' // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        // Check if user has permission to edit
        if ($note->user_id !== $user->uuid && 
            !$note->collaborators()
                ->where('user_uuid', $user->uuid)
                ->where('permission', 'write')
                ->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        
        $path = $file->storeAs('attachments/' . $note->uuid, $filename, 'public');

        $attachment = $note->attachments()->create([
            'filename' => $filename,
            'original_filename' => $originalName,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'path' => $path
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'attachment' => $attachment
        ]);
    }

    public function deleteAttachment($uuid, $attachmentId)
    {
        $user = Auth::user();
        $note = Note::findOrFail($uuid);
        $attachment = $note->attachments()->findOrFail($attachmentId);

        if ($note->user_id !== $user->uuid && 
            !$note->collaborators()
                ->where('user_uuid', $user->uuid)
                ->where('permission', 'write')
                ->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($attachment->path);
        $attachment->delete();

        return response()->json(['message' => 'Attachment deleted successfully']);
    }
} 