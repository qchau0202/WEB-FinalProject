<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/activate/{token}', [AuthController::class, 'activate']);
Route::post('/resend-verification', [AuthController::class, 'resendVerification']);

// Protected routes
Route::middleware('auth')->group(function () {
    Route::get('/user', [UserController::class, 'getCurrentUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});