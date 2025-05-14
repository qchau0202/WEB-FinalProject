<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #1F1F1F;
            margin: 0;
            padding: 0;
            background-color: #F5F5F5;
        }
        .container {
            max-width: 640px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #000000;
            color: #FFFFFF;
            padding: 24px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            background-color: #FFFFFF;
            padding: 32px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #E5E5E5;
        }
        .content p {
            margin: 0 0 16px;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #000000;
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            margin: 16px 0;
            text-align: center;
        }
        .button:hover {
            background-color: #333333;
        }
        .link {
            color: #000000;
            word-break: break-all;
            font-size: 14px;
            margin: 16px 0;
        }
        .footer {
            text-align: center;
            margin-top: 24px;
            color: #6B6B6B;
            font-size: 14px;
        }
        .footer p {
            margin: 8px 0;
        }
        @media only screen and (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .content {
                padding: 20px;
            }
            .header h1 {
                font-size: 20px;
            }
            .button {
                display: block;
                width: 100%;
                box-sizing: border-box;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Notelit</h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->name }},</p>
            @if (!empty($success))
                <p>Your email has been successfully verified!</p>
                <p>Thank you for using Notelit!</p>
            @else
                <p>Thank you for joining Notelit. To get started, please verify your email address by clicking the button below:</p>
                <div style="text-align: center;">
                    <a href="{{ $activationUrl }}" class="button text-white">Verify Email Address</a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p class="link">{{ $activationUrl }}</p>
                <p>This verification link expires in 24 hours.</p>
                <p>If you didn't create an account, no further action is needed.</p>
            @endif
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Notelit. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>