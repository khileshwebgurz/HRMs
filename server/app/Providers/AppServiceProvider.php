<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    // public function register(): void
    // {
    //     //
    // }
    public function register(): void
        {
            if ($this->app->runningInConsole()) {
               $this->app->register(\App\Providers\ConsoleServiceProvider::class);
            }
        }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
