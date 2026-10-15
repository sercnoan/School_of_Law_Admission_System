<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE interview_results MODIFY result ENUM('Pending','Passed','Failed','Waitlisted') NOT NULL DEFAULT 'Pending'"
            );
        }
    }

    public function down(): void
    {
        DB::table('interview_results')
            ->where('result', 'Waitlisted')
            ->update(['result' => 'Pending']);

        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE interview_results MODIFY result ENUM('Pending','Passed','Failed') NOT NULL DEFAULT 'Pending'"
            );
        }
    }
};
