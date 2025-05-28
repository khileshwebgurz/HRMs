<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DatabaseController extends Controller
{
    public function testConnection()
    {
        try {
            DB::connection()->getPdo();
            return response()->json(['message' => 'Database connection successful']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
        }
    }
}
