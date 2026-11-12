<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admission_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name', 180)->unique();
            $table->string('short_name', 60)->nullable();
            $table->string('description', 500)->nullable();
            $table->text('qualification')->nullable();
            $table->string('prospectus_url', 500)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
        });

        $now = now();

        DB::table('admission_programs')->insert([
            [
                'name' => 'Juris Doctor [Thesis] (JD)',
                'short_name' => 'JD',
                'description' => 'Professional legal education at the USeP School of Law.',
                'qualification' => "An applicant for admission to USeP-SoL's Juris Doctor [Thesis] Program must have obtained, from a recognized and reputable college or university, a Bachelor's Degree in Arts or Sciences or a higher academic degree, and must have complied with the minimum requirements for law students set by the Legal Education Board.",
                'prospectus_url' => 'https://usep.edu.ph/sol/academic-programs-2/',
                'sort_order' => 10,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Master of Legal Studies-Juris Doctor (MLS-JD)',
                'short_name' => 'MLS-JD',
                'description' => 'A ladderized path for advanced interdisciplinary legal study.',
                'qualification' => "An applicant for admission to USeP-SoL's Ladderized Master of Legal Studies-Juris Doctor (MLS-JD) Program must have obtained, from a recognized and reputable college or university, a Bachelor's Degree in Arts or Sciences or a higher academic degree, and must have complied with the minimum requirements for law students set by the Legal Education Board.\n\nThe applicant must also have at least two (2) years of work experience.",
                'prospectus_url' => 'https://usep.edu.ph/sol/academic-programs-2/',
                'sort_order' => 20,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE applications MODIFY program VARCHAR(180) NULL');
            DB::statement("ALTER TABLE requirements MODIFY program VARCHAR(180) NOT NULL DEFAULT 'Both'");

            return;
        }

        Schema::table('applications', function (Blueprint $table) {
            $table->string('program', 180)->nullable()->change();
        });
        Schema::table('requirements', function (Blueprint $table) {
            $table->string('program', 180)->default('Both')->change();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admission_programs');
    }
};
