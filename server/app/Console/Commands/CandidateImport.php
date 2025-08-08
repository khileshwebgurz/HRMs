<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CandidateImports;
use App\Imports\CandidateCsvImport;
use Maatwebsite\Excel\Facades\Excel;

class CandidateImport extends Command
{
    protected $signature = 'import:candidate';
    protected $description = 'Import candidate data from CSV files';

    public function handle()
    {
        $imports = CandidateImports::where('cron_status', 0)->get();

        if ($imports->isEmpty()) {
            $this->info('No pending imports.');
            return Command::SUCCESS;
        }

        foreach ($imports as $import) {
            $import_file = public_path('uploads/csv-import/' . $import->file);

            if (!file_exists($import_file)) {
                $this->error("File not found: $import_file");
                continue;
            }

            $import->cron_status = 1;
            $import->save();

            $csvImporter = new CandidateCsvImport();
            Excel::import($csvImporter, $import_file);

            $import->total = $csvImporter->getTotalRowCount();
            $import->success = $csvImporter->getTotalSuccessCount();
            $import->failed = $csvImporter->getRowFailCount();
            $import->cron_status = 3;
            $import->save();

            $this->info("Imported {$import->success}/{$import->total} rows from: {$import->file}");
        }

        return Command::SUCCESS;
    }
}
