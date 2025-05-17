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
use Illuminate\Support\Facades\Hash;

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
                  ->where('status', 'accepted');
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
            'is_pinned' => 'boolean',
            'pinned_at' => 'date|nullable',
            'password' => 'required_if:is_locked,true|string|min:6',
            'labels' => 'array',
            'labels.*' => 'exists:labels,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        
        $password = $request->password ? (preg_match('/^\$2y\$/', $request->password) ? $request->password : Hash::make($request->password)) : null;
        $note = Note::create([
            'user_id' => $user->uuid,
            'title' => $request->title,
            'content' => $request->content,
            'is_public' => $request->is_public ?? false,
            'is_locked' => $request->is_locked ?? false,
            'is_pinned' => $request->is_pinned ?? false,
            'pinned_at' => $request->pinned_at,
            'password' => $password,
            'lock_feature_enabled' => $request->is_locked ?? false,
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
        \Log::info('Update note request:', [
            'uuid' => $uuid,
            'data' => $request->all()
        ]);

        $note = Note::findOrFail($uuid);
        
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'is_public' => 'boolean',
            'is_locked' => 'boolean',
            'is_pinned' => 'boolean',
            'pinned_at' => 'date|nullable',
            'password' => 'nullable|string|min:6',
            'current_password' => function ($attribute, $value, $fail) use ($note, $request) {
                if ($request->boolean('lock_feature_enabled') === false && $note->password && empty($value)) {
                    $fail('The current password is required to disable the lock feature.');
                }
            },
            'labels' => 'nullable|array',
            'labels.*' => 'required|integer|exists:labels,id',
            'lock_feature_enabled' => 'boolean',
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        // Check if user has permission to edit
        if ($note->user_id !== $user->uuid && 
            !$note->collaborators()->where('user_uuid', $user->uuid)->where('status', 'accepted')->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Build update data
        $updateData = [];

        // Handle boolean fields
        if ($request->has('is_public')) {
            $updateData['is_public'] = $request->boolean('is_public');
        }
        if ($request->has('is_locked')) {
            $updateData['is_locked'] = $request->boolean('is_locked');
        }
        if ($request->has('is_pinned')) {
            $updateData['is_pinned'] = $request->boolean('is_pinned');
        }
        if ($request->has('lock_feature_enabled')) {
            $updateData['lock_feature_enabled'] = $request->boolean('lock_feature_enabled');
        }

        // Handle date fields
        if ($request->has('pinned_at')) {
            $updateData['pinned_at'] = $request->pinned_at;
        }

        // Only update title, content, and password if they are present in the request
        if ($request->has('title')) {
            $updateData['title'] = $request->title === null ? '' : $request->title;
        }
        if ($request->has('content')) {
            $updateData['content'] = $request->content === null ? '' : $request->content;
        }
        if ($request->has('password') && $request->password !== null) {
            $updateData['password'] = preg_match('/^\$2y\$/', $request->password) ? $request->password : Hash::make($request->password);
        }

        if ($request->has('attachments')) {
            $updateData['attachments'] = $request->attachments ?? [];
        }

        \Log::info('Updating note with data:', $updateData);

        // Update the note
        if (!empty($updateData)) {
            $note->update($updateData);
        }

        // Handle labels separately using sync
        if ($request->has('labels')) {
            try {
                // Ensure labels is an array of integers
                $labelIds = array_map('intval', $request->labels);
                
                // Get all valid label IDs that belong to the user
                $validLabelIds = Label::whereIn('id', $labelIds)
                    ->where('user_id', $user->uuid)
                    ->pluck('id')
                    ->toArray();
                
                \Log::info('Label sync attempt:', [
                    'requested_labels' => $labelIds,
                    'valid_labels' => $validLabelIds,
                    'user_id' => $user->uuid
                ]);
                    
                // Sync the valid labels
                $note->labels()->sync($validLabelIds);
            } catch (\Exception $e) {
                \Log::error('Error syncing labels:', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }
        }

        // Refresh the note with relationships
        $updatedNote = $note->fresh(['labels', 'collaborators']);
        \Log::info('Note updated successfully:', $updatedNote->toArray());

        return response()->json([
            'message' => 'Note updated successfully',
            'note' => $updatedNote
        ]);
    }

    public function destroy($uuid)
    {
        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Safely handle attachments as an array (even if null)
        foreach ((array) $note->attachments as $attachment) {
            // If you store file paths/URLs and want to delete files from storage, do it here.
            // Example:
            // if (isset($attachment['path'])) {
            //     Storage::disk('public')->delete($attachment['path']);
            // }
        }

        // Remove related data (if any)
        $note->labels()->detach();
        $note->collaborators()->detach();

        // Permanently delete the note
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

        if ($collaborator->uuid === $user->uuid) {
            return response()->json(['message' => 'Cannot add note owner as collaborator'], 422);
        }

        if ($note->collaborators()->where('user_uuid', $collaborator->uuid)->exists()) {
            return response()->json(['message' => 'User is already a collaborator'], 422);
        }

        $note->collaborators()->attach($collaborator->uuid, [
            'permission' => $request->permission,
            'status' => 'pending',
            'shared_by' => $user->uuid
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
            'file' => 'required|file|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $note = Note::findOrFail($uuid);

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

    // Lock-related methods
    public function enableLock(Request $request, $uuid)
    {
        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $note->update([
            'lock_feature_enabled' => true,
            'is_locked' => false,
            'password' => null,
            'last_edited_at' => now(),
            'last_edited_by' => $user->uuid
        ]);

        return response()->json([
            'message' => 'Lock feature enabled successfully',
            'note' => $note->fresh(['labels', 'collaborators'])
        ]);
    }

    public function disableLock(Request $request, $uuid)
    {
        $note = Note::findOrFail($uuid);

        $rules = [];
        if ($note->password) {
            $rules['current_password'] = 'required|string|min:1';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only verify password if one exists
        if ($note->password && !$note->verifyPassword($request->current_password)) {
            return response()->json(['errors' => ['current_password' => ['Invalid password']]], 422);
        }

        $note->update([
            'lock_feature_enabled' => false,
            'is_locked' => false,
            'password' => null,
            'last_edited_at' => now(),
            'last_edited_by' => $user->uuid
        ]);

        return response()->json([
            'message' => 'Lock feature disabled successfully',
            'note' => $note->fresh(['labels', 'collaborators'])
        ]);
    }

    public function toggleLock(Request $request, $uuid)
    {
        $note = Note::findOrFail($uuid);

        $rules = [
            'password' => 'required_if:is_locked,true|min:1',
        ];

        // Only require current_password if unlocking a locked note with a password
        if ($note->is_locked && $note->password && $request->has('is_locked') && $request->boolean('is_locked') === false) {
            $rules['current_password'] = 'required|string';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $isLocking = !$note->is_locked;

        if ($isLocking) {
            // Locking the note
            if (!$request->has('password')) {
                return response()->json(['errors' => ['password' => ['Password is required to lock the note']]], 422);
            }
            $note->update([
                'is_locked' => true,
                'password' => preg_match('/^\$2y\$/', $request->password) ? $request->password : Hash::make($request->password),
                'last_edited_at' => now(),
                'last_edited_by' => $user->uuid
            ]);
        } else {
            // Unlocking the note
            if ($note->is_locked && $note->password && !$note->verifyPassword($request->current_password)) {
                return response()->json(['errors' => ['current_password' => ['Invalid password']]], 422);
            }
            $note->update([
                'is_locked' => false,
                'last_edited_at' => now(),
                'last_edited_by' => $user->uuid
            ]);
        }

        return response()->json([
            'message' => $isLocking ? 'Note locked successfully' : 'Note unlocked successfully',
            'note' => $note->fresh(['labels', 'collaborators'])
        ]);
    }

    public function verifyLockPassword(Request $request, $uuid)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $isValid = $note->verifyPassword($request->password);

        return response()->json([
            'message' => $isValid ? 'Password is valid' : 'Invalid password',
            'is_valid' => $isValid
        ]);
    }

    // Label-related methods
    public function addLabel(Request $request, $uuid)
    {
        $validator = Validator::make($request->all(), [
            'label_id' => 'required|exists:labels,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $note->labels()->attach($request->label_id);

        return response()->json([
            'message' => 'Label added successfully',
            'note' => $note->fresh(['labels', 'collaborators'])
        ]);
    }

    public function removeLabel($uuid, $labelId)
    {
        $user = Auth::user();
        $note = Note::findOrFail($uuid);

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $note->labels()->detach($labelId);

        return response()->json([
            'message' => 'Label removed successfully',
            'note' => $note->fresh(['labels', 'collaborators'])
        ]);
    }
}