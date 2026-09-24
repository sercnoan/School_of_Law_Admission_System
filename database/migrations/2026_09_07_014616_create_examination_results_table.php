<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'examination_results',
            function (Blueprint $table) {

                $table->bigIncrements(
                    'result_id'
                );

                /*
                |--------------------------------------------------------------------------
                | Application
                |--------------------------------------------------------------------------
                |
                | applications.application_id is INT in your existing database,
                | so this must also be integer().
                |
                */

                $table
                    ->integer(
                        'application_id'
                    )
                    ->unique();


                /*
                |--------------------------------------------------------------------------
                | Examination Schedule
                |--------------------------------------------------------------------------
                */

                $table
                    ->integer(
                        'schedule_id'
                    )
                    ->nullable();


                /*
                |--------------------------------------------------------------------------
                | Result
                |--------------------------------------------------------------------------
                */

                $table
                    ->enum(
                        'result',
                        [
                            'Pending',
                            'Passed',
                            'Failed',
                        ]
                    )
                    ->default(
                        'Pending'
                    );


                /*
                |--------------------------------------------------------------------------
                | Internal Admin Remarks
                |--------------------------------------------------------------------------
                */

                $table
                    ->text(
                        'remarks'
                    )
                    ->nullable();


                /*
                |--------------------------------------------------------------------------
                | Admin Who Recorded Result
                |--------------------------------------------------------------------------
                |
                | Your admins use users.id, which is BIGINT UNSIGNED.
                |
                */

                $table
                    ->unsignedBigInteger(
                        'decided_by'
                    )
                    ->nullable();


                /*
                |--------------------------------------------------------------------------
                | Result Date
                |--------------------------------------------------------------------------
                */

                $table
                    ->timestamp(
                        'decided_at'
                    )
                    ->nullable();


                /*
                |--------------------------------------------------------------------------
                | Email Notification
                |--------------------------------------------------------------------------
                */

                $table
                    ->timestamp(
                        'notification_sent_at'
                    )
                    ->nullable();


                $table->timestamps();


                /*
                |--------------------------------------------------------------------------
                | Foreign Keys
                |--------------------------------------------------------------------------
                */

                $table
                    ->foreign(
                        'application_id'
                    )
                    ->references(
                        'application_id'
                    )
                    ->on(
                        'applications'
                    )
                    ->cascadeOnDelete();


                $table
                    ->foreign(
                        'schedule_id'
                    )
                    ->references(
                        'schedule_id'
                    )
                    ->on(
                        'examination_schedules'
                    )
                    ->nullOnDelete();


                $table
                    ->foreign(
                        'decided_by'
                    )
                    ->references(
                        'id'
                    )
                    ->on(
                        'users'
                    )
                    ->nullOnDelete();
            }
        );
    }


    public function down(): void
    {
        Schema::dropIfExists(
            'examination_results'
        );
    }
};