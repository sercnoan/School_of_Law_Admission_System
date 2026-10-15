<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('applicant_profiles')
            ->where('employment_status', 'Unemployed')
            ->update([
                'employment_status' => 'Not Currently Employed',
            ]);
    }

    public function down(): void
    {
        DB::table('applicant_profiles')
            ->where('employment_status', 'Not Currently Employed')
            ->update([
                'employment_status' => 'Unemployed',
            ]);
    }
};
