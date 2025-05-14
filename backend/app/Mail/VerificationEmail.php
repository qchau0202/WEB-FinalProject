<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $activationUrl;
    public $success;

    /**
     * Create a new message instance.
     *
     * @param \App\Models\User $user
     * @param string|null $activationUrl
     * @param bool $success
     */
    public function __construct($user, $activationUrl = null, $success = false)
    {
        $this->user = $user;
        $this->activationUrl = $activationUrl;
        $this->success = $success;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = $this->success ? 'Your Email is Now Verified!' : 'Verify Your Email Address';
        return $this->subject($subject)
                    ->view('emails.verification')
                    ->with([
                        'user' => $this->user,
                        'activationUrl' => $this->activationUrl,
                        'success' => $this->success,
                    ]);
    }
}