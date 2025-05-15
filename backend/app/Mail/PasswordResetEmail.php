<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $resetUrl;
    public $otp;

    public function __construct($user, $resetUrl = null, $otp = null)
    {
        $this->user = $user;
        $this->resetUrl = $resetUrl;
        $this->otp = $otp;
    }

    public function build()
    {
        $subject = $this->otp ? 'Password Reset OTP' : 'Password Reset Link';
        
        return $this->subject($subject)
            ->view('emails.password-reset')
            ->with([
                'user' => $this->user,
                'resetUrl' => $this->resetUrl,
                'otp' => $this->otp,
            ]);
    }
} 