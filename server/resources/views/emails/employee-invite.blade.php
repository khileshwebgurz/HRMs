<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to HRM</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5f5f5;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="padding:24px 32px;text-align:left;">
              <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#111;">Hi {{ $name }},</h2>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.4;color:#333;">
                You've been invited to join our HRM system.
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.4;color:#333;">
                Please accept the invitation to set your password and activate your account, or decline if you weren’t expecting this.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="padding-right:8px;">
                    <a href="{{ $invite_link_accept }}"
                       style="display:inline-block;padding:12px 24px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:4px;font-size:16px;">
                      Accept Invitation
                    </a>
                  </td>
                  <td align="center" style="padding-left:8px;">
                    <a href="{{ $invite_link_declined }}"
                       style="display:inline-block;padding:12px 24px;background:#dc3545;color:#fff;text-decoration:none;border-radius:4px;font-size:16px;">
                      Decline
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;color:#888;">
                If the buttons above don't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 8px;font-size:12px;word-break:break-all;color:#555;">
                {{ $invite_link_accept }}
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">

              <p style="margin:0;font-size:12px;color:#999;">
                If you did not expect this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0;font-size:12px;color:#aaa;">© {{ date('Y') }} HRM System</p>
      </td>
    </tr>
  </table>
</body>
</html>
