{{-- @include('emails.includes.header') --}}

<tr>
    <td style="padding: 10px 0px;" align="center">
        <h1 style="color: #26c6da; font-weight: normal; padding: 30px 0 0; margin: 0;" class="greeting">Hello, {{ $data['name'] }}!</h1>
    </td>
</tr>

<tr>
    <td style="padding: 10px 0px; font-size: 0px;" align="center">
        <img src="https://webguruz.in/hrm/email-template-2/images/profile-update.png" alt="Image" style="max-width: 75%; width: 100%; height: auto;" />
    </td>
</tr>

<tr>
    <td style="padding: 10px 0px;" align="center">
        <h3 style="font-weight: normal; line-height: 30px; padding: 30px 0; margin: 0;" class="message"><strong>Keeping your profile up to date is necessary.<br/> Click on the link below to update your profile:</strong></h3>
        <a href="{{ $data['url'] }}" style="font-size: 18px; line-height: 28px; font-weight: bold; color: #24cef8; text-decoration: underline; padding: 10px 15px; background: #001e36;">Update Profile</a>
    </td>
     <td style="padding: 10px 0px;" align="center">
        <h3 style="font-weight: normal; line-height: 30px; padding: 30px 0; margin: 0;" class="message"><strong>Keeping your profile up to date is necessary.<br/> Click on the link below to update your profile:</strong></h3>
        <a href="{{ $data['candidate_view_url'] }}" style="font-size: 18px; line-height: 28px; font-weight: bold; color: #24cef8; text-decoration: underline; padding: 10px 15px; background: #001e36;">Update Profile</a>
    </td>
</tr>

{{-- @include('emails.includes.footer') --}}
