<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">

    <title>Email Template Welcome Email</title>

    <!--[if mso]>
  <style>
    table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

    <!-- CSS -->
    <style type="text/css">
        /* Fonts */
        @font-face {
            font-family: 'Adobe Garamond Pro';
            src: url('https://webguruz.in/hrm/email-template/fonts/AGaramondPro-BoldItalic.woff2') format('woff2'),
                url('https://webguruz.in/hrm/email-template/fonts/AGaramondPro-BoldItalic.woff') format('woff');
            font-weight: bold;
            font-style: italic;
            font-display: swap;
        }

        @font-face {
            font-family: 'Adobe Garamond Pro';
            src: url('https://webguruz.in/hrm/email-template/fonts/AGaramondPro-Regular.woff2') format('woff2'),
                url('https://webguruz.in/hrm/email-template/fonts/AGaramondPro-Regular.woff') format('woff');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        @font-face {
            font-family: 'Adobe Garamond Pro';
            src: url('https://webguruz.in/hrm/email-template/fonts/AGaramondPro-Bold.woff2') format('woff2'),
                url('https://webguruz.in/hrm/email-template/fonts/AGaramondPro-Bold.woff') format('woff');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
        }

        @font-face {
            font-family: 'Adobe Garamond Pro';
            src: url('https://webguruz.in/hrm/email-template/fonts/AGaramondPro-Italic.woff2') format('woff2'),
                url('https://webguruz.in/hrm/email-template/fonts/AGaramondPro-Italic.woff') format('woff');
            font-weight: normal;
            font-style: italic;
            font-display: swap;
        }

        * {
            font-family: 'Adobe Garamond Pro', sans-serif;
            margin: 0;
            padding: 0;
        }

        body,
        #body_style{
            background-color: #ffffff !important;
        }

        a {
            text-decoration: none;
        }

        p {
            margin-bottom: 15px;
        }

        table {
            border-collapse: collapse;
        }

        .greeting {
            font-size: 52px;
        }

        .message {
            font-size: 23px;
        }

        @media only screen and (max-width: 480px) {
            .greeting {
                font-size: 36px !important;
            }

            .message {
                font-size: 20px !important;
            }

            table.regards td {
                display: inline-block;
                width: 100%;
                text-align: center;
            }
        }

        @media only screen and (max-width: 414px) {
            .email-banner {
                max-width: 100% !important;
            }
        }

    </style>
</head>

<body style="margin:0;padding:0;word-spacing:normal;background-color: #ffffff !important;">
    <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#ffffff;">
        <table class="table" align="center" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff !important; margin: 0 auto; max-width: 600px; width: 100%;">
            <tr>
                <td valign="top" style="padding:16px; background: #ffffff; background-image: url(https://webguruz.in/hrm/email-template/other-images/white-bg.jpg); background-repeat: repeat;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff !important;">
                        <tr>
                            <td valign="top" style="padding: 20px; border: 1px solid #26c6da;">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff !important;">
                                    <tr>
                                        <td style="padding: 10px 0; text-align: center;"><a href="https://webguruz.in/" target="_blank" title="Webguruz"><img src="https://webguruz.in/hrm/email-template/webguruz-logo.png" style="width: 140px;" /></a></td>
                                    </tr>
<tr>
<td style="padding: 10px 0px;">
    <h1 style="color: #26c6da; font-weight: normal; padding: 30px 0 0; margin: 0; font-weight: 600; font-size: 24px;">Dear {{$to_name}}</h1>
</td>
</tr>
<tr>
<td valign="top" style="background-image: url(https://webguruz.in/hrm/leave-template/leave-request-image.png); background-repeat: no-repeat; background-position: center;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="padding: 10px 0px;">
                <p style="line-height: 15px; font-size: 17px;"><strong style="font-weight: 600">{{$employee}}</strong> has been deleted a Leave.</p>

                <?php
                $type =App\LeaveRules::where('id', $leave_type)->first();
                $start = date("d M,Y D", strtotime($start_date));
                $end = date("d M,Y D", strtotime($end_date));
                ?>
                <p style="line-height: 15px; font-size: 17px;"><strong style="font-weight: 600">Leave Type:</strong> {{$type->rule_name}}</p>
                <p style="line-height: 15px; font-size: 17px;"><strong style="font-weight: 600">Leave Dates:</strong>{{$start}} ~ {{$end}}</p>
                
                <p style="line-height: 15px; font-size: 17px;"><strong style="font-weight: 600;">Reason of deletion:</strong> {{$leave_delete_reason}}</p>
               
            </td>
        </tr>
       
        
    </table>
</td>
</tr>
<tr>
<td valign="top">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td valign="bottom" align="right"><img src="https://hrm.webguruz.in/public//dist/img/left-deco-line.png"  alt="Left Deco Line" /></td>
            <td align="center">
                <h4 style="font-size: 18px; margin-bottom: 10px;">Regards</h4>
                <h3 style="font-size: 22px; font-weight: normal; line-height: 16px;">{{$employee}}</h3>
            </td>
            <td valign="bottom"><img src="https://hrm.webguruz.in/public//dist/img/right-deco-line.png" alt="Right Deco Line" /></td>
        </tr>
    </table>
</td>
</tr>
<tr>
<td valign="top" align="center" style="padding-top: 50px;">
    <a href="https://www.facebook.com/webguruztechnologies/" target="_blank" style="margin: 0 10px; display: inline-block;"><img src="https://webguruz.in/hrm/email-template/social-icons/facebook-icon.png" alt="" /></a>
    <a href="https://twitter.com/Webguruz" target="_blank"  style="margin: 0 10px; display: inline-block;"><img src="https://webguruz.in/hrm/email-template/social-icons/twiiter-icon.png" alt="" /></a>
    <a href="https://www.linkedin.com/company/webguru-technologies-pvt.-ltd." target="_blank"  style="margin: 0 10px; display: inline-block;"><img src="https://webguruz.in/hrm/email-template/social-icons/linkedin-icon.png" alt="" /></a>
    <a href="https://www.instagram.com/webguruz/" target="_blank"  style="margin: 0 10px; display: inline-block;"><img src="https://webguruz.in/hrm/email-template/social-icons/instagram-icon.png" alt="" /></a>
</td>
</tr>
<tr>
<td valign="top" align="center" style="padding-top: 20px; font-weight: bold;">Webguruz Technologies 4th Floor, SM Heights, C-205, Phase 8 B,Sector 74 Mohali</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>

</html>
