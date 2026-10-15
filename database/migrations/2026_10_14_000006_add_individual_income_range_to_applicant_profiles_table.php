<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('applicant_profiles', function (Blueprint $table) {
            $table->string('individual_income_range', 100)
                ->nullable()
                ->after('individual_income');
        });
    }

    public function down(): void
    {
        Schema::table('applicant_profiles', function (Blueprint $table) {
            $table->dropColumn('individual_income_range');
        });
    }
};
