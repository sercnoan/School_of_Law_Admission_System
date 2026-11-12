<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('requirements')) {
            return;
        }

        Schema::table('requirements', function (Blueprint $table) {
            if (! Schema::hasColumn('requirements', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('is_required');
            }

            if (! Schema::hasColumn('requirements', 'sort_order')) {
                $table->unsignedInteger('sort_order')->default(0)->after('is_active');
            }
        });

        DB::table('requirements')
            ->where('sort_order', 0)
            ->orderBy('requirement_id')
            ->get(['requirement_id'])
            ->each(function ($requirement, $index) {
                DB::table('requirements')
                    ->where('requirement_id', $requirement->requirement_id)
                    ->update(['sort_order' => ($index + 1) * 10]);
            });
    }

    public function down(): void
    {
        if (! Schema::hasTable('requirements')) {
            return;
        }

        Schema::table('requirements', function (Blueprint $table) {
            $columns = array_values(array_filter(
                ['is_active', 'sort_order'],
                fn (string $column) => Schema::hasColumn('requirements', $column)
            ));

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
