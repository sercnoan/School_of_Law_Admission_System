<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 20)->default('applicant')->index();
            });

            return;
        }

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('applicant', 'admin', 'interviewer') NOT NULL DEFAULT 'applicant'");

            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['applicant', 'admin', 'interviewer'])
                ->default('applicant')
                ->change();
        });
    }

    public function down(): void
    {
        DB::table('users')->where('role', 'interviewer')->update(['role' => 'applicant']);

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('applicant', 'admin') NOT NULL DEFAULT 'applicant'");

            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['applicant', 'admin'])
                ->default('applicant')
                ->change();
        });
    }
};
