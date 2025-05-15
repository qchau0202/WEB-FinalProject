<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 5px;
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello {{ $user->name }},</p>
        
        @if($otp)
            <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
            <div class="otp">{{ $otp }}</div>
            <p>This OTP will expire in 1 hour.</p>
        @else
            <p>You have requested to reset your password. Click the button below to proceed:</p>
            <a href="{{ $resetUrl }}" class="button">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
        @endif

        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        
        <p>Best regards,<br>Your Application Team</p>
    </div>
</body>
</html> 