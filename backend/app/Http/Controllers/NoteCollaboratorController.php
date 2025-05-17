<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NoteCollaboratorController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Add a collaborator to a note
     */
    public function addCollaborator(Request $request, $noteUuid)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'permission' => 'required|in:read,edit'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $note = Note::where('uuid', $noteUuid)->firstOrFail();
            
            // Check if user is the note owner
            if ($note->user_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $collaborator = User::where('email', $request->email)->first();
            
            // Check if user is trying to add themselves
            if ($collaborator->uuid === Auth::user()->uuid) {
                return response()->json(['message' => 'Cannot add yourself as a collaborator'], 400);
            }

            // Check if user is already a collaborator
            if ($note->collaborators()->where('user_uuid', $collaborator->uuid)->exists()) {
                return response()->json(['message' => 'User is already a collaborator'], 400);
            }

            // Add collaborator with pending status
            $note->collaborators()->attach($collaborator->uuid, [
                'shared_by' => Auth::user()->uuid,
                'permission' => $request->permission,
                'status' => 'pending',
                'accepted_at' => null
            ]);

            // Create notification for the collaborator
            Notification::create([
                'user_id' => $collaborator->uuid,
                'type' => 'invitation',
                'title' => 'Collaboration Invitation',
                'message' => Auth::user()->name . ' invited you to collaborate on "' . $note->title . '"',
                'data' => [
                    'note_uuid' => $note->uuid,
                    'note_title' => $note->title,
                    'permission' => $request->permission,
                    'shared_by' => [
                        'uuid' => Auth::user()->uuid,
                        'name' => Auth::user()->name,
                        'email' => Auth::user()->email
                    ]
                ]
            ]);

            // Create notification for the sender
            Notification::create([
                'user_id' => Auth::user()->uuid,
                'type' => 'invitation_sent',
                'title' => 'Invitation Sent',
                'message' => 'You invited ' . $collaborator->name . ' to collaborate on "' . $note->title . '"',
                'data' => [
                    'note_uuid' => $note->uuid,
                    'note_title' => $note->title,
                    'invited_user' => [
                        'uuid' => $collaborator->uuid,
                        'name' => $collaborator->name,
                        'email' => $collaborator->email
                    ],
                    'permission' => $request->permission
                ]
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Collaboration invitation sent successfully',
                'collaborator' => [
                    'uuid' => $collaborator->uuid,
                    'name' => $collaborator->name,
                    'email' => $collaborator->email,
                    'avatar' => $collaborator->avatar,
                    'permission' => $request->permission,
                    'status' => 'pending'
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to add collaborator'], 500);
        }
    }

    /**
     * Accept a collaboration invitation
     */
    public function acceptCollaboration($noteUuid)
    {
        try {
            DB::beginTransaction();

            $note = Note::where('uuid', $noteUuid)->firstOrFail();
            $user = Auth::user();

            // Check if user has a pending invitation
            $collaboration = $note->collaborators()
                ->where('user_uuid', $user->uuid)
                ->where('status', 'pending')
                ->first();

            if (!$collaboration) {
                return response()->json(['message' => 'No pending invitation found'], 404);
            }

            // Update collaboration status
            $note->collaborators()->updateExistingPivot($user->uuid, [
                'status' => 'accepted',
                'accepted_at' => now()
            ]);

            // Create notification for the note owner
            Notification::create([
                'user_id' => $note->user_id,
                'type' => 'invitation_accepted',
                'title' => 'Invitation Accepted',
                'message' => $user->name . ' accepted your invitation to collaborate on "' . $note->title . '"',
                'data' => [
                    'note_uuid' => $note->uuid,
                    'note_title' => $note->title,
                    'accepted_by' => [
                        'uuid' => $user->uuid,
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ]
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Collaboration accepted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to accept collaboration'], 500);
        }
    }

    /**
     * Decline a collaboration invitation
     */
    public function declineCollaboration($noteUuid)
    {
        try {
            DB::beginTransaction();

            $note = Note::where('uuid', $noteUuid)->firstOrFail();
            $user = Auth::user();

            // Check if user has a pending invitation
            $collaboration = $note->collaborators()
                ->where('user_uuid', $user->uuid)
                ->where('status', 'pending')
                ->first();

            if (!$collaboration) {
                return response()->json(['message' => 'No pending invitation found'], 404);
            }

            // Remove collaboration
            $note->collaborators()->detach($user->uuid);

            // Create notification for the note owner
            Notification::create([
                'user_id' => $note->user_id,
                'type' => 'invitation_rejected',
                'title' => 'Invitation Rejected',
                'message' => $user->name . ' rejected your invitation to collaborate on "' . $note->title . '"',
                'data' => [
                    'note_uuid' => $note->uuid,
                    'note_title' => $note->title,
                    'rejected_by' => [
                        'uuid' => $user->uuid,
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ]
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Collaboration rejected successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to reject collaboration'], 500);
        }
    }

    /**
     * Cancel a sent invitation
     */
    public function cancelInvitation($noteUuid, $userUuid)
    {
        try {
            DB::beginTransaction();

            $note = Note::where('uuid', $noteUuid)->firstOrFail();
            
            // Check if user is the note owner
            if ($note->user_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Check if invitation exists and is pending
            $collaboration = $note->collaborators()
                ->where('user_uuid', $userUuid)
                ->where('status', 'pending')
                ->first();

            if (!$collaboration) {
                return response()->json(['message' => 'No pending invitation found'], 404);
            }

            // Remove collaboration
            $note->collaborators()->detach($userUuid);

            // Create notification for the invited user
            Notification::create([
                'user_id' => $userUuid,
                'type' => 'invitation_cancelled',
                'title' => 'Invitation Cancelled',
                'message' => Auth::user()->name . ' cancelled the invitation to collaborate on "' . $note->title . '"',
                'data' => [
                    'note_uuid' => $note->uuid,
                    'note_title' => $note->title,
                    'cancelled_by' => [
                        'uuid' => Auth::user()->uuid,
                        'name' => Auth::user()->name,
                        'email' => Auth::user()->email
                    ]
                ]
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Invitation cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to cancel invitation'], 500);
        }
    }

    /**
     * Remove a collaborator from a note
     */
    public function removeCollaborator($noteUuid, $userUuid)
    {
        try {
            DB::beginTransaction();

            $note = Note::where('uuid', $noteUuid)->firstOrFail();
            
            // Only the note owner or the collaborator themselves can remove
            if ($note->user_id !== Auth::id() && Auth::user()->uuid !== $userUuid) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Remove collaborator
            $note->collaborators()->detach($userUuid);

            // Create notification for the removed collaborator
            Notification::create([
                'user_id' => $userUuid,
                'type' => 'collaboration_removed',
                'title' => 'Collaboration Removed',
                'message' => 'You have been removed from collaborating on "' . $note->title . '"',
                'data' => [
                    'note_uuid' => $note->uuid,
                    'note_title' => $note->title,
                    'removed_by' => [
                        'uuid' => Auth::user()->uuid,
                        'name' => Auth::user()->name,
                        'email' => Auth::user()->email
                    ]
                ]
            ]);

            // If the collaborator removed themselves, notify the owner
            if (Auth::user()->uuid === $userUuid && $note->user_id !== $userUuid) {
                Notification::create([
                    'user_id' => $note->user_id,
                    'type' => 'collaborator_left',
                    'title' => 'Collaborator Left',
                    'message' => Auth::user()->name . ' left your note "' . $note->title . '"',
                    'data' => [
                        'note_uuid' => $note->uuid,
                        'note_title' => $note->title,
                        'leaver' => [
                            'uuid' => Auth::user()->uuid,
                            'name' => Auth::user()->name,
                            'email' => Auth::user()->email
                        ]
                    ]
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Collaborator removed successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to remove collaborator'], 500);
        }
    }

    /**
     * Get all collaborators for a note
     */
    public function getCollaborators($noteUuid)
    {
        try {
            $note = Note::where('uuid', $noteUuid)->firstOrFail();
            
            // Check if user is the note owner or a collaborator
            if ($note->user_id !== Auth::id() && 
                !$note->collaborators()->where('user_uuid', Auth::user()->uuid)->exists()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $collaborators = $note->collaborators()
                ->with(['user:id,uuid,display_name,email,avatar'])
                ->get()
                ->map(function ($collaborator) {
                    return [
                        'uuid' => $collaborator->user->uuid,
                        'name' => $collaborator->user->display_name,
                        'email' => $collaborator->user->email,
                        'avatar' => $collaborator->user->avatar,
                        'permission' => $collaborator->pivot->permission,
                        'status' => $collaborator->pivot->status,
                        'accepted_at' => $collaborator->pivot->accepted_at,
                        'shared_by' => $collaborator->pivot->shared_by
                    ];
                });

            return response()->json($collaborators);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get collaborators'], 500);
        }
    }

    public function updatePermission(Request $request, $noteUuid, $userUuid)
    {
        $validator = \Validator::make($request->all(), [
            'permission' => 'required|in:read,edit'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $note = \App\Models\Note::where('uuid', $noteUuid)->firstOrFail();
            if ($note->user_id !== \Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Check if collaborator exists
            $collaborator = $note->collaborators()
                ->where('user_uuid', $userUuid)
                ->first();

            if (!$collaborator) {
                return response()->json(['message' => 'Collaborator not found'], 404);
            }

            // Update using the model's relationship
            $note->collaborators()->updateExistingPivot($userUuid, [
                'permission' => $request->permission,
                'updated_at' => now()
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Permission updated successfully',
                'permission' => $request->permission
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Permission update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update permission',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 