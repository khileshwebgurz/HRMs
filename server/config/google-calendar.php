<?php

return [
    'calendar_id' => env('GOOGLE_CALENDAR_ID', 'primary'),

    'service_account_credentials_json' => storage_path('app/google-calendar/service-account.json'),
];
