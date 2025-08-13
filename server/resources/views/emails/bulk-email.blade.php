<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $email_subject }}</title>
</head>
<body>
    <p>{!! nl2br(e($email_content)) !!}</p>
</body>
</html>
