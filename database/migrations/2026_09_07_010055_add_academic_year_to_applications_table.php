<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
    |--------------------------------------------------------------------------
    | Academic Year Start Month
    |--------------------------------------------------------------------------
    |
    | 8 = August
    |
    */

    private const ACADEMIC_YEAR_START_MONTH = 8;


    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Add Academic Year Column
        |--------------------------------------------------------------------------
        */

        if (
            !Schema::hasColumn(
                'applications',
                'academic_year'
            )
        ) {
            Schema::table(
                'applications',
                function (
                    Blueprint $table
                ) {
                    $table
                        ->string(
                            'academic_year',
                            9
                        )
                        ->nullable()
                        ->after(
                            'program'
                        );

                    $table
                        ->index(
                            'academic_year'
                        );
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Backfill Existing Applications
        |--------------------------------------------------------------------------
        |
        | Example:
        |
        | August 13, 2026
        | becomes
        | 2026-2027
        |
        */

        $applications =
            DB::table(
                'applications'
            )

                ->whereNull(
                    'academic_year'
                )

                ->select(
                    'application_id',
                    'submitted_at'
                )

                ->get();


        foreach (
            $applications
            as $application
        ) {
            if (
                !$application
                    ->submitted_at
            ) {
                continue;
            }


            $date =
                Carbon::parse(
                    $application
                        ->submitted_at
                );


            $startYear =
                $date->month >=
                self::ACADEMIC_YEAR_START_MONTH

                    ? $date->year

                    : $date->year - 1;


            $academicYear =
                $startYear .
                '-' .
                ($startYear + 1);


            DB::table(
                'applications'
            )

                ->where(
                    'application_id',
                    $application
                        ->application_id
                )

                ->update([
                    'academic_year' =>
                        $academicYear,
                ]);
        }
    }


    public function down(): void
    {
        if (
            Schema::hasColumn(
                'applications',
                'academic_year'
            )
        ) {
            Schema::table(
                'applications',
                function (
                    Blueprint $table
                ) {
                    $table
                        ->dropIndex(
                            [
                                'academic_year',
                            ]
                        );

                    $table
                        ->dropColumn(
                            'academic_year'
                        );
                }
            );
        }
    }
};