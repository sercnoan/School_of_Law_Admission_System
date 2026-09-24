<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'interview_schedules',
            function (Blueprint $table) {

                $table->bigIncrements(
                    'interview_id'
                );


                /*
                |--------------------------------------------------------------------------
                | Application
                |--------------------------------------------------------------------------
                */

                $table
                    ->integer(
                        'application_id'
                    )
                    ->unique();


                /*
                |--------------------------------------------------------------------------
                | Admin
                |--------------------------------------------------------------------------
                */

                $table
                    ->unsignedBigInteger(
                        'admin_id'
                    )
                    ->nullable();


                /*
                |--------------------------------------------------------------------------
                | Interview Details
                |--------------------------------------------------------------------------
                */

                $table->date(
                    'interview_date'
                );

                $table->time(
                    'interview_time'
                );

                $table->string(
                    'venue',
                    150
                );

                $table
                    ->text(
                        'instructions'
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
                        'admin_id'
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
            'interview_schedules'
        );
    }
};