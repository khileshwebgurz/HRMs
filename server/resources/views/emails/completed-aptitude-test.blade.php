<!DOCTYPE html>
<html>
<head>
    <title>Test Completion Notification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { margin-top: 20px; font-size: 12px; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Aptitude Test Completed</h2>
        </div>
        
        <div class="content">
            <p>Hello HR Team,</p>
            
            <p><strong>{{ $candidate_name }}</strong> has completed the aptitude test for the <strong>{{ $position }}</strong> position.</p>
            
            <h3>Test Results:</h3>
            <ul>
                <li>Score: {{ $score }}/{{ $total }}</li>
                <li>Percentage: {{ $percentage }}%</li>
            </ul>
            
            <p>Please review the results in the admin panel.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification. Please do not reply.</p>
        </div>
    </div>
</body>
</html>