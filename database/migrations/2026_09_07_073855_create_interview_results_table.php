<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interview_results', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('application_id');
            $table->unsignedBigInteger('interview_id');
            $table->enum('result', ['Pending','Passed','Failed'])->default('Pending');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('decided_by')->nullable();
            $table->dateTime('decided_at')->nullable();
            $table->dateTime('notification_sent_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('application_id', 'unique_interview_result_application');
            $table->unique('interview_id', 'unique_interview_result_interview');
            $table->foreign('application_id')->references('application_id')->on('applications')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('interview_id')->references('interview_id')->on('interview_schedules')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('decided_by')->references('id')->on('users')->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interview_results');
    }
};
