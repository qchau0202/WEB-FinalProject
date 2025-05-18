<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\NoteAttachmentController;
use App\Http\Controllers\NoteCollaboratorController;
use App\Http\Controllers\NotificationController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/activate/{token}', [AuthController::class, 'activate']);
Route::post('/resend-verification', [AuthController::class, 'resendVerification']);

// Password reset routes
Route::post('/request-password-reset', [AuthController::class, 'requestPasswordReset']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth')->group(function () {
    // User routes
    Route::get('/user', [UserController::class, 'getCurrentUser']);
    Route::put('/user', [UserController::class, 'updateProfile']);
    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Note routes
    Route::prefix('notes')->group(function () {
        // Basic CRUD operations
        Route::get('/', [NoteController::class, 'index']);
        Route::post('/', [NoteController::class, 'store']);
        Route::get('/{uuid}', [NoteController::class, 'show']);
        Route::put('/{uuid}', [NoteController::class, 'update']);
        Route::delete('/{uuid}', [NoteController::class, 'destroy']);

        // Note collaboration
        Route::prefix('{uuid}/collaborators')->group(function () {
            Route::get('/', [NoteCollaboratorController::class, 'getCollaborators']);
            Route::post('/', [NoteCollaboratorController::class, 'addCollaborator']);
            Route::delete('/{userId}', [NoteCollaboratorController::class, 'removeCollaborator']);
            Route::put('/{userId}', [NoteCollaboratorController::class, 'updatePermission']);
            Route::post('/accept', [NoteCollaboratorController::class, 'acceptCollaboration']);
            Route::post('/reject', [NoteCollaboratorController::class, 'rejectCollaboration']);
            Route::post('/decline', [NoteCollaboratorController::class, 'declineCollaboration']);
            Route::delete('/{userId}/cancel', [NoteCollaboratorController::class, 'cancelInvitation']);
        });

        // Note attachments
        Route::prefix('{uuid}/attachments')->group(function () {
            Route::get('/', [NoteAttachmentController::class, 'index']);
            Route::post('/', [NoteAttachmentController::class, 'store']);
            Route::get('/{attachmentId}', [NoteAttachmentController::class, 'show']);
            Route::delete('/{attachmentId}', [NoteAttachmentController::class, 'destroy']);
        });

        // Note labels
        Route::prefix('{uuid}/labels')->group(function () {
            Route::post('/', [NoteController::class, 'addLabel']);
            Route::delete('/{labelId}', [NoteController::class, 'removeLabel']);
        });

        // Note lock operations
        Route::prefix('{uuid}/lock')->group(function () {
            Route::post('/enable', [NoteController::class, 'enableLock']);
            Route::post('/disable', [NoteController::class, 'disableLock']);
            Route::post('/toggle', [NoteController::class, 'toggleLock']);
            Route::post('/verify', [NoteController::class, 'verifyLockPassword']);
            Route::post('/change-password', [NoteController::class, 'changePassword']);
        });
    });

    // Label routes
    Route::get('/labels', [LabelController::class, 'index']);
    Route::post('/labels', [LabelController::class, 'store']);
    Route::put('/labels/{id}', [LabelController::class, 'update']);
    Route::delete('/labels/{id}', [LabelController::class, 'destroy']);
});

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});