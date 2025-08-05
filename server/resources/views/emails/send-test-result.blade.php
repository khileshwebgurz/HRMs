<!DOCTYPE html>
<html>
<head>
    <title>Your Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .result { font-size: 18px; font-weight: bold; margin: 20px 0; }
        .success { color: #28a745; }
        .failure { color: #dc3545; }
        .footer { margin-top: 20px; font-size: 12px; color: #6c757d; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Your Aptitude Test Results</h2>
        </div>
        
        <div class="content">
            <p>Dear {{ $name }},</p>
            
            <p>Thank you for completing the aptitude test. Here are your results:</p>
            
            <div class="result {{ $status == 1 ? 'success' : 'failure' }}">
                {{ $msg }}
            </div>
            
            @if($status == 1)
                <p>We will contact you shortly regarding the next steps in the hiring process.</p>
            @else
                <p>We appreciate your time and effort. Please feel free to apply again in the future.</p>
            @endif
            
            <p>If you have any questions, please contact our HR department.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}</p>
        </div>
    </div>
</body>
</html>