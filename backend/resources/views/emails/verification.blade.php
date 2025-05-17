<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;700&display=swap" rel="stylesheet">
    <title>Notelit - Email Verification</title>
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
        .footer {
            text-align: center;
            color: #888;
            font-size: 0.95rem;
            margin-top: 32px;
        }
        .link {
            color: #2563eb;
            word-break: break-all;
            font-size: 0.98rem;
            margin: 12px 0 0 0;
            text-align: center;
            display: block;
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
        <h2>Email Verification</h2>
        <p>Hello {{ $user->name }},</p>
        @if (!empty($success))
            <p>Your email has been successfully verified!</p>
            <p>Thank you for using Notelit!</p>
        @else
            <p>Thank you for joining Notelit. To get started, please verify your email address by clicking the button below:</p>
            <a href="{{ $activationUrl }}" class="button">Verify Email Address</a>
            <p style="text-align:center; color:#666; font-size:0.98rem;">If the button doesn't work, copy and paste this link into your browser:</p>
            <span class="link">{{ $activationUrl }}</span>
            <p style="text-align:center; color:#666; font-size:0.98rem;">This verification link expires in 24 hours.</p>
            <p style="text-align:center; color:#666; font-size:0.98rem;">If you didn't create an account, no further action is needed.</p>
        @endif
        <div class="footer">
            &copy; {{ date('Y') }} Notelit. All rights reserved.
        </div>
    </div>
</body>
</html>