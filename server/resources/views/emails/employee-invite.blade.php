<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to HRM</title>
</head>
<body>
    <p>Hi {{ $name }},</p>
    <p>You have been invited to join our HRM system.</p>
    <p>
        <a href="{{ $invite_link_accept }}">Accept Invitation</a> |
        <a href="{{ $invite_link_declined }}">Decline</a>
    </p>
    <p>Thanks,<br>HRM Team</p>
</body>
</html>
