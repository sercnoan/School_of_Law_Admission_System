<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const OLD_JD = 'Juris Doctor';
    private const NEW_JD = 'Juris Doctor [Thesis] (JD)';
    private const OLD_MLS_JD = 'Master of Legal Studies - Juris Doctor';
    private const NEW_MLS_JD = 'Master of Legal Studies-Juris Doctor (MLS-JD)';

    public function up(): void
    {
        $this->allowAllNames();

        DB::table('applications')
            ->where('program', self::OLD_JD)
            ->update(['program' => self::NEW_JD]);
        DB::table('applications')
            ->where('program', self::OLD_MLS_JD)
            ->update(['program' => self::NEW_MLS_JD]);
        DB::table('requirements')
            ->where('program', self::OLD_JD)
            ->update(['program' => self::NEW_JD]);
        DB::table('requirements')
            ->where('program', self::OLD_MLS_JD)
            ->update(['program' => self::NEW_MLS_JD]);

        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE applications MODIFY program ENUM('Juris Doctor [Thesis] (JD)', 'Master of Legal Studies-Juris Doctor (MLS-JD)') NULL"
            );
            DB::statement(
                "ALTER TABLE requirements MODIFY program ENUM('Juris Doctor [Thesis] (JD)', 'Master of Legal Studies-Juris Doctor (MLS-JD)', 'Both') NOT NULL DEFAULT 'Both'"
            );
        }
    }

    public function down(): void
    {
        $this->allowAllNames();

        DB::table('applications')
            ->where('program', self::NEW_JD)
            ->update(['program' => self::OLD_JD]);
        DB::table('applications')
            ->where('program', self::NEW_MLS_JD)
            ->update(['program' => self::OLD_MLS_JD]);
        DB::table('requirements')
            ->where('program', self::NEW_JD)
            ->update(['program' => self::OLD_JD]);
        DB::table('requirements')
            ->where('program', self::NEW_MLS_JD)
            ->update(['program' => self::OLD_MLS_JD]);

        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE applications MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies - Juris Doctor') NULL"
            );
            DB::statement(
                "ALTER TABLE requirements MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies - Juris Doctor', 'Both') NOT NULL DEFAULT 'Both'"
            );
        }
    }

    private function allowAllNames(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement(
            "ALTER TABLE applications MODIFY program ENUM('Juris Doctor', 'Juris Doctor [Thesis] (JD)', 'Master of Legal Studies - Juris Doctor', 'Master of Legal Studies-Juris Doctor (MLS-JD)') NULL"
        );
        DB::statement(
            "ALTER TABLE requirements MODIFY program ENUM('Juris Doctor', 'Juris Doctor [Thesis] (JD)', 'Master of Legal Studies - Juris Doctor', 'Master of Legal Studies-Juris Doctor (MLS-JD)', 'Both') NOT NULL DEFAULT 'Both'"
        );
    }
};
