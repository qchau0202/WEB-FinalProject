<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Mail\VerificationEmail;
use App\Mail\PasswordResetEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log; // Add this import
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
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
            'avatar' => null,
            'verification_token' => Str::random(60),
            'email_verified_at' => null,
        ]);

        $activationUrl = url("/activate/{$user->verification_token}");
        Mail::to($user->email)->send(new VerificationEmail($user, $activationUrl));

        Auth::login($user);
        $isVerified = $user->email_verified_at !== null;

        return response()->json([
            'message' => 'User registered successfully. Please check your email to verify your account.',
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'is_verified' => $isVerified,
            'activation_url' => $activationUrl,
        ], 201);
    }

    public function activate($token)
    {
        $user = User::where('verification_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired token'], 404);
        }

        if ($user->email_verified_at) {
            Mail::to($user->email)->send(new VerificationEmail($user, null, true));
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/verification-success');
        }

        $user->email_verified_at = now();
        $user->verification_token = null;
        $user->save();

        Mail::to($user->email)->send(new VerificationEmail($user, null, true));

        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/verification-success');
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
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
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
            Mail::to($user->email)->send(new VerificationEmail($user, null, true));
            return response()->json(['message' => 'Email already verified, success email sent'], 200);
        }

        if (!$user->verification_token) {
            $user->verification_token = Str::random(60);
        }
        $user->save();

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
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'is_verified' => $user->email_verified_at !== null,
        ]);
    }

    public function requestPasswordReset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:users,email',
            'method' => 'required|in:email,otp',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();
        
        // Delete any existing reset tokens for this user
        PasswordReset::where('user_uuid', $user->uuid)->delete();

        $reset = PasswordReset::create([
            'user_uuid' => $user->uuid,
            'token' => Str::random(60),
            'otp' => $request->method === 'otp' ? str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT) : null,
            'expires_at' => now()->addHours(1),
        ]);

        if ($request->method === 'email') {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            $resetUrl = $frontendUrl . '/reset-password/' . $reset->token;
            Mail::to($user->email)->send(new PasswordResetEmail($user, $resetUrl));
            return response()->json([
                'message' => 'Password reset link has been sent to your email.',
                'token' => $reset->token
            ]);
        } else {
            Mail::to($user->email)->send(new PasswordResetEmail($user, null, $reset->otp));
            return response()->json([
                'message' => 'OTP has been sent to your email.',
                'token' => $reset->token
            ]);
        }
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:users,email',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();
        $reset = PasswordReset::where('user_uuid', $user->uuid)
            ->where('otp', $request->otp)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$reset) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 400);
        }

        return response()->json([
            'message' => 'OTP verified successfully.',
            'token' => $reset->token,
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $reset = PasswordReset::where('token', $request->token)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$reset) {
            Log::warning('Password reset token invalid or expired', [
                'provided_token' => $request->token,
                'existing_tokens' => PasswordReset::pluck('token')->toArray(),
            ]);
            return response()->json(['message' => 'Invalid or expired token.'], 400);
        }

        $user = User::where('uuid', $reset->user_uuid)->first();
        if (!$user) {
            Log::error('User not found for password reset', [
                'user_uuid' => $reset->user_uuid,
                'token' => $request->token,
            ]);
            return response()->json(['message' => 'User not found.'], 404);
        }

        try {
            DB::beginTransaction();
            
            // Update user password
            $user->password = Hash::make($request->password);
            $user->save();

            // Mark reset token as used
            $reset->is_used = true;
            $reset->save();

            DB::commit();
            return response()->json(['message' => 'Password has been reset successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Password reset failed', [
                'error' => $e->getMessage(),
                'user_uuid' => $user->uuid,
                'token' => $request->token,
            ]);
            return response()->json(['message' => 'Failed to reset password. Please try again.'], 500);
        }
    }
}