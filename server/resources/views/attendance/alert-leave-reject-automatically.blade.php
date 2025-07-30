@include('emails.includes.header')

<p>Hi <b style="color: #bf0505;">{{$name}},</b> This is reminder to perform action on leave request of {{$employee_name}} otherwise, it will be automatically rejected by HRM..</p>

@include('emails.includes.footer')
