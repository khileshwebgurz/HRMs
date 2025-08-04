@component('mail::message')
# Daily Reminder

The following candidates have not updated their profile:

@foreach ($candidates as $candidate)
- {{ $candidate->full_name }} (Email: {{ $candidate->email }})
@endforeach

Thanks,  
{{ config('app.name') }}
@endcomponent
