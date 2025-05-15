<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\LabelController;

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

    // Note routes
    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::get('/notes/{uuid}', [NoteController::class, 'show']);
    Route::put('/notes/{uuid}', [NoteController::class, 'update']);
    Route::delete('/notes/{uuid}', [NoteController::class, 'destroy']);
    
    // Note collaboration routes
    Route::post('/notes/{uuid}/collaborators', [NoteController::class, 'addCollaborator']);
    Route::delete('/notes/{uuid}/collaborators/{userId}', [NoteController::class, 'removeCollaborator']);
    
    // Note attachment routes
    Route::post('/notes/{uuid}/attachments', [NoteController::class, 'uploadAttachment']);
    Route::delete('/notes/{uuid}/attachments/{attachmentId}', [NoteController::class, 'deleteAttachment']);

    // Label routes
    Route::get('/labels', [LabelController::class, 'index']);
    Route::post('/labels', [LabelController::class, 'store']);
    Route::put('/labels/{id}', [LabelController::class, 'update']);
    Route::delete('/labels/{id}', [LabelController::class, 'destroy']);
});

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});