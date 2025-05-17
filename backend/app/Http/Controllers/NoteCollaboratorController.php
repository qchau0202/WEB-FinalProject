<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\User;
use App\Models\NoteCollaborator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NoteCollaboratorController extends Controller
{
    // Invite a collaborator
    public function invite(Request $request, $note_uuid)
    {
        $user = Auth::user();
        $note = Note::findOrFail($note_uuid);

        // Only owner can invite
        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'permission' => 'required|in:read,edit',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $invitee = User::where('email', $request->email)->first();

        // Prevent inviting self
        if ($invitee->uuid === $user->uuid) {
            return response()->json(['message' => 'Cannot invite yourself'], 422);
        }

        // Prevent duplicate invite
        $existing = NoteCollaborator::where('note_uuid', $note->uuid)
            ->where('user_uuid', $invitee->uuid)
            ->where('status', '!=', 'revoked')
            ->first();
        if ($existing) {
            return response()->json(['message' => 'User already invited or is a collaborator'], 422);
        }

        $collab = NoteCollaborator::create([
            'note_uuid' => $note->uuid,
            'user_uuid' => $invitee->uuid,
            'shared_by' => $user->uuid,
            'permission' => $request->permission,
            'status' => 'pending',
        ]);

        // TODO: Send notification/email to invitee

        return response()->json(['message' => 'Invitation sent', 'collaborator' => $collab]);
    }

    // Accept an invite
    public function accept($collab_id)
    {
        $user = Auth::user();
        $collab = NoteCollaborator::findOrFail($collab_id);

        if ($collab->user_uuid !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $collab->status = 'accepted';
        $collab->accepted_at = now();
        $collab->save();

        return response()->json(['message' => 'Invitation accepted', 'collaborator' => $collab]);
    }

    // Decline an invite
    public function decline($collab_id)
    {
        $user = Auth::user();
        $collab = NoteCollaborator::findOrFail($collab_id);

        if ($collab->user_uuid !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $collab->status = 'declined';
        $collab->save();

        return response()->json(['message' => 'Invitation declined']);
    }

    // Change permission (owner only)
    public function updatePermission(Request $request, $collab_id)
    {
        $user = Auth::user();
        $collab = NoteCollaborator::findOrFail($collab_id);
        $note = $collab->note;

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'permission' => 'required|in:read,edit',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $collab->permission = $request->permission;
        $collab->save();

        return response()->json(['message' => 'Permission updated', 'collaborator' => $collab]);
    }

    // Revoke/remove collaborator (owner only)
    public function revoke($collab_id)
    {
        $user = Auth::user();
        $collab = NoteCollaborator::findOrFail($collab_id);
        $note = $collab->note;

        if ($note->user_id !== $user->uuid) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $collab->status = 'revoked';
        $collab->save();

        return response()->json(['message' => 'Collaborator revoked']);
    }

    // List collaborators for a note (owner or collaborator)
    public function listForNote($note_uuid)
    {
        $user = Auth::user();
        $note = Note::findOrFail($note_uuid);

        // Only owner or collaborator can view
        $isOwner = $note->user_id === $user->uuid;
        $isCollaborator = $note->collaborators()->where('user_uuid', $user->uuid)->where('status', 'accepted')->exists();

        if (!$isOwner && !$isCollaborator) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $collaborators = $note->collaborators()->with(['user', 'inviter'])->get();

        return response()->json(['collaborators' => $collaborators]);
    }

    // List notes shared with the current user
    public function sharedWithMe()
    {
        $user = Auth::user();
        $collabs = NoteCollaborator::where('user_uuid', $user->uuid)
            ->where('status', 'accepted')
            ->with(['note', 'inviter'])
            ->get();

        return response()->json(['shared_notes' => $collabs]);
    }
}
