<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Leave Request Notification</title>
</head>
<body>
    <h2>Leave Request Notification</h2>
    <p>Dear {{ $leaveRequest['manager_name'] }},</p>

    <p><strong>{{ $leaveRequest['employee_name'] }}</strong> has requested a leave.</p>

    <p><strong>Leave Type:</strong> {{ $leaveRequest['leave_type'] }}</p>
    <p><strong>Start Date:</strong> {{ $leaveRequest['start_date'] }}</p>
    @if(!empty($leaveRequest['start_time']))
        <p><strong>Start Time:</strong> {{ $leaveRequest['start_time'] }}</p>
    @endif
    <p><strong>End Date:</strong> {{ $leaveRequest['end_date'] }}</p>
    <p><strong>Reason:</strong> {{ $leaveRequest['reason'] }}</p>

    <p>Please log in to the system to review this request.</p>
</body>
</html>
