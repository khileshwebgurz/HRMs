<tr>
<td style="padding: 10px 0px;" align="center">
    <h1 style="color: #26c6da; font-weight: normal; padding: 30px 0 0; margin: 0;" class="greeting">Hello,{{$name}}!!</h1>
</td>
</tr>
<tr>
<td style="padding: 10px 0px; font-size: 0px;" align="center">
    <img src="https://webguruz.in/hrm/email-template-aptitude-test/images/aptitude-result.png" alt="Image" style="max-width: 95%; width: 100%; height: auto;" class="email-banner" />
</td>
</tr>
<tr>
<td style="padding: 10px 0px; text-align: center;">
    <p style="font-weight: normal; line-height: 30px; padding: 30px 0 0; margin: 0; font-size: 20px;" class="message">We’d like you to finish this aptitude test.</p>
    <p style="font-weight: normal; line-height: 30px; padding: 30px 0 0; margin: 0; font-size: 20px;" class="message">It will help us to assess your skills and give us more idea about you. Please complete this before coming for the face to face interview. I’ll be happy to answer the questions about the same. Feel free to contact me anytime on the contact details mentioned in the signature of this email.</p>
   <?php
 if(!empty($otp))
 {
   ?> <p>
   	<strong>OTP: </strong>{{$otp}}
     </p>
     <?php
 }
 ?>
    <a href="{{$test_url}}" style="font-size: 18px;line-height: 28px;font-weight: bold;color: #24cef8;text-decoration: underline;padding: 10px 15px;text-decoration: none;background: #001e36;">Aptitude Test</a>
    <p style="font-weight: normal; line-height: 30px; padding: 30px 0 0; margin: 0; font-size: 20px;" class="message">All the best!</p>
</td>
</tr>