<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Mail\VerificationEmail;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    // public function register(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|string|email|max:255|unique:users',
    //         'password' => 'required|string|min:8|confirmed',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     $user = User::create([
    //         'name' => $request->name,
    //         'email' => $request->email,
    //         'password' => Hash::make($request->password),
    //         'verification_token' => Str::random(60), // Generate token for later use
    //         'email_verified_at' => null, // Default to null on registration
    //     ]);

    //     $token = $user->createToken('auth_token')->plainTextToken;

    //     // Add is_verified based on email_verified_at
    //     $isVerified = $user->email_verified_at !== null;

    //     return response()->json([
    //         'message' => 'User registered successfully. Please request a verification email to activate your account.',
    //         'user' => $user,
    //         'token' => $token,
    //         'is_verified' => $isVerified, // Add this field
    //         'activation_url' => url("/api/activate/{$user->verification_token}"), // Provided for frontend reference
    //     ], 201);
    // }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verification_token' => Str::random(60),
            'email_verified_at' => null,
        ]);

        Auth::login($user);
        $isVerified = $user->email_verified_at !== null;

        return response()->json([
            'message' => 'User registered successfully. Please request a verification email to activate your account.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'verification_token' => $user->verification_token,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'is_verified' => $isVerified,
            'activation_url' => url("/api/activate/{$user->verification_token}"),
        ], 201);
    }

    public function activate($token)
    {
        $user = User::where('verification_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired token'], 404);
        }

        if ($user->email_verified_at) {
            // Send a success email even if already verified
            Mail::to($user->email)->send(new VerificationEmail($user, null, true));
            return response()->json(['message' => 'Account already verified, email sent'], 200);
        }

        $user->email_verified_at = now();
        $user->verification_token = null;
        $user->save();

        // Send a success email after verification
        Mail::to($user->email)->send(new VerificationEmail($user, null, true));

        return response()->json(['message' => 'Account verified successfully, email sent'], 200);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $isVerified = $user->email_verified_at !== null;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'is_verified' => $isVerified,
        ], 200);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function resendVerification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user->email_verified_at) {
            // Send a success email if already verified
            Mail::to($user->email)->send(new VerificationEmail($user, null, true));
            return response()->json(['message' => 'Email already verified, success email sent'], 200);
        }

        // Generate or update verification token
        if (!$user->verification_token) {
            $user->verification_token = Str::random(60);
        }
        $user->save();

        // Send verification email
        $activationUrl = url("/activate/{$user->verification_token}");
        Mail::to($user->email)->send(new VerificationEmail($user, $activationUrl));

        return response()->json([
            'message' => 'Verification email sent successfully.',
            'activation_url' => $activationUrl,
        ], 200);
    }

    public function user(Request $request)
    {
        \Log::info('User endpoint hit', [
            'session_id' => session()->getId(),
            'session_data' => session()->all(),
            'auth_check' => auth()->check(),
            'user' => auth()->user(),
            'cookies' => $_COOKIE,
        ]);
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $user = auth()->user();
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'is_verified' => $user->email_verified_at !== null,
        ]);
    }
}