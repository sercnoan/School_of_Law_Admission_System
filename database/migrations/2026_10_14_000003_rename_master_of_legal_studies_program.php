<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const OLD_NAME = 'Master of Legal Studies';

    private const NEW_NAME = 'Master of Legal Studies - Juris Doctor';

    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE applications MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies', 'Master of Legal Studies - Juris Doctor') NULL"
            );
            DB::statement(
                "ALTER TABLE requirements MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies', 'Master of Legal Studies - Juris Doctor', 'Both') NOT NULL DEFAULT 'Both'"
            );
        }

        DB::table('applications')
            ->where('program', self::OLD_NAME)
            ->update(['program' => self::NEW_NAME]);

        DB::table('requirements')
            ->where('program', self::OLD_NAME)
            ->update(['program' => self::NEW_NAME]);

        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE applications MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies - Juris Doctor') NULL"
            );
            DB::statement(
                "ALTER TABLE requirements MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies - Juris Doctor', 'Both') NOT NULL DEFAULT 'Both'"
            );
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE applications MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies', 'Master of Legal Studies - Juris Doctor') NULL"
            );
            DB::statement(
                "ALTER TABLE requirements MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies', 'Master of Legal Studies - Juris Doctor', 'Both') NOT NULL DEFAULT 'Both'"
            );
        }

        DB::table('applications')
            ->where('program', self::NEW_NAME)
            ->update(['program' => self::OLD_NAME]);

        DB::table('requirements')
            ->where('program', self::NEW_NAME)
            ->update(['program' => self::OLD_NAME]);

        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                "ALTER TABLE applications MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies') NULL"
            );
            DB::statement(
                "ALTER TABLE requirements MODIFY program ENUM('Juris Doctor', 'Master of Legal Studies', 'Both') NOT NULL DEFAULT 'Both'"
            );
        }
    }
};
