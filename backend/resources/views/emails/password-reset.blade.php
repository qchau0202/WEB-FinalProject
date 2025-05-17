<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;700&display=swap" rel="stylesheet">
    <title>Notelit - Password Reset</title>
    <style>
        body {
            background: #f3f4f6;
            font-family: "Lexend", sans-serif;
            color: #222;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 420px;
            margin: 40px auto;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 24px 0 rgba(0,0,0,0.07);
            padding: 32px 28px 24px 28px;
        }
        .brand {
            text-align: center;
            font-size: 2rem;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        h2 {
            text-align: center;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0 0 18px 0;
            color: #222;
        }
        p {
            font-size: 1rem;
            margin: 12px 0;
        }
        .button {
            display: block;
            width: 100%;
            background: #2563eb;
            color: #fff !important;
            text-align: center;
            padding: 12px 0;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;
            margin: 24px 0 16px 0;
            box-shadow: 0 2px 8px 0 rgba(37,99,235,0.08);
            transition: background 0.2s;
        }
        .button:hover {
            background: #1d4ed8;
        }
        .otp {
            font-size: 1.5rem;
            font-weight: bold;
            color: #2563eb;
            background: #f0f6ff;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 24px 0 16px 0;
            letter-spacing: 2px;
        }
        .footer {
            text-align: center;
            color: #888;
            font-size: 0.95rem;
            margin-top: 32px;
        }
        @media (max-width: 600px) {
            .container {
                padding: 18px 6vw 16px 6vw;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="brand">Notelit</div>
        <h2>Password Reset Request</h2>
        <p>Hello {{ $user->name }},</p>
        @if($otp)
            <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
            <div class="otp">{{ $otp }}</div>
            <p style="text-align:center; color:#666; font-size:0.98rem;">This OTP will expire in 1 hour.</p>
        @else
            <p>You have requested to reset your password. Click the button below to proceed:</p>
            <a href="{{ $resetUrl }}" class="button">Reset Password</a>
            <p style="text-align:center; color:#666; font-size:0.98rem;">This link will expire in 1 hour.</p>
        @endif
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <div class="footer">
            &copy; {{ date('Y') }} Notelit. All rights reserved.
        </div>
    </div>
</body>
</html> 