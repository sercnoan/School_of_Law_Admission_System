<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const PROGRAM = 'Master of Legal Studies-Juris Doctor (MLS-JD)';

    public function up(): void
    {
        DB::table('requirements')
            ->where('program', self::PROGRAM)
            ->where('requirement_name', 'Certificate of Enrollment / Proof of Work Experience')
            ->update([
                'requirement_name' => 'Certificate of Employment / Proof of Work Experience',
                'description' => 'Certificate of Employment or Proof of Work Experience',
            ]);

        DB::table('requirements')
            ->where('program', self::PROGRAM)
            ->where('requirement_name', 'Certificate of Enrollment')
            ->update([
                'requirement_name' => 'Certificate of Employment',
                'description' => 'Certificate of Employment',
            ]);
    }

    public function down(): void
    {
        DB::table('requirements')
            ->where('program', self::PROGRAM)
            ->where('requirement_name', 'Certificate of Employment / Proof of Work Experience')
            ->update([
                'requirement_name' => 'Certificate of Enrollment / Proof of Work Experience',
                'description' => 'Certificate of Enrollment or Proof of Work Experience',
            ]);

        DB::table('requirements')
            ->where('program', self::PROGRAM)
            ->where('requirement_name', 'Certificate of Employment')
            ->update([
                'requirement_name' => 'Certificate of Enrollment',
                'description' => 'Certificate of Enrollment',
            ]);
    }
};
