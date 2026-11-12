<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('requirements') || ! Schema::hasTable('admission_programs')) {
            return;
        }

        $programs = DB::table('admission_programs')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->pluck('name');

        if ($programs->isEmpty()) {
            return;
        }

        DB::transaction(function () use ($programs) {
            DB::table('requirements')
                ->where('program', 'Both')
                ->orderBy('requirement_id')
                ->get()
                ->each(function ($requirement) use ($programs) {
                    $firstProgram = $programs->first();

                    DB::table('requirements')
                        ->where('requirement_id', $requirement->requirement_id)
                        ->update(['program' => $firstProgram]);

                    foreach ($programs->skip(1) as $program) {
                        $newRequirementId = DB::table('requirements')->insertGetId([
                            'requirement_name' => $requirement->requirement_name,
                            'program' => $program,
                            'description' => $requirement->description,
                            'is_required' => $requirement->is_required,
                            'is_active' => $requirement->is_active,
                            'sort_order' => $requirement->sort_order,
                        ], 'requirement_id');

                        DB::table('requirement_submissions')
                            ->where('requirement_id', $requirement->requirement_id)
                            ->whereIn(
                                'application_id',
                                DB::table('applications')
                                    ->where('program', $program)
                                    ->select('application_id')
                            )
                            ->update(['requirement_id' => $newRequirementId]);
                    }
                });

            foreach ($programs as $program) {
                DB::table('requirements')
                    ->where('program', $program)
                    ->orderBy('sort_order')
                    ->orderBy('requirement_id')
                    ->get(['requirement_id'])
                    ->each(function ($requirement, $index) {
                        DB::table('requirements')
                            ->where('requirement_id', $requirement->requirement_id)
                            ->update(['sort_order' => ($index + 1) * 10]);
                    });
            }
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE requirements MODIFY program VARCHAR(180) NOT NULL');

            return;
        }

        Schema::table('requirements', function (Blueprint $table) {
            $table->string('program', 180)->change();
        });
    }

    public function down(): void
    {
        throw new RuntimeException(
            'Program-specific requirements cannot be merged safely. Restore a verified backup instead.'
        );
    }
};
