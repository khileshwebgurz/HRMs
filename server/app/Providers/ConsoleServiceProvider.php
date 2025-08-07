<?php

namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use App\Console\Commands\CandidateImport;

class ConsoleServiceProvider extends ServiceProvider
{
    /**
     * Register the application's services.
     *
     * @return void
     */
    public function register()
    {
        // Register the console commands for the application
        $this->commands([
            CandidateImport::class, // Register the CandidateImport command
        ]);
        
    }

    /**
     * Bootstrap any application services.
     *
     * @param \Illuminate\Console\Scheduling\Schedule $schedule
     * @return void
     */
    public function boot()
    {
        // Resolve the Schedule from the container and schedule commands
        $schedule = $this->app->make(Schedule::class);

        // Schedule the 'import:candidate' command to run every minute
        $schedule->command('import:candidate')->everyMinute();
    }
}
