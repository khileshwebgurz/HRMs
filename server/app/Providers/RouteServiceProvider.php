<?php
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Register alias 'role'
        Route::aliasMiddleware('role', RoleMiddleware::class);

        parent::boot();
    }
}
