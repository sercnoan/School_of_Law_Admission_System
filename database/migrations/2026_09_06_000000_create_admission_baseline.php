<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Adopt imported databases without changing their existing tables or records.
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('role', ['applicant', 'admin'])->default('applicant');
            });
        }

        if (!Schema::hasTable('admins')) {
            Schema::create('admins', function (Blueprint $table) {
            $table->integer('admin_id', true);
            $table->string('first_name', 100);
            $table->string('middle_name', 100)->nullable();
            $table->string('last_name', 100);
            $table->string('email', 255);
            $table->string('password', 255);
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
            $table->unique('email');
            });
        }

        if (!Schema::hasTable('applicant_profiles')) {
            Schema::create('applicant_profiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('applicant_number', 20);
            $table->string('full_name', 255);
            $table->string('school_graduated', 255);
            $table->string('employment_status', 100);
            $table->text('present_address');
            $table->unsignedTinyInteger('age');
            $table->string('gender', 100);
            $table->string('contact_number', 20);
            $table->string('religion', 100);
            $table->enum('civil_status', ['Single','Married','Widowed','Separated','Divorced']);
            $table->decimal('individual_income', 12,2)->default('0.00');
            $table->decimal('family_income', 12,2)->default('0.00');
            $table->boolean('is_indigenous')->default('0');
            $table->string('indigenous_community', 255)->nullable();
            $table->boolean('is_pwd')->default('0');
            $table->string('pwd_type', 255)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unique('user_id');
            $table->unique('applicant_number');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        if (!Schema::hasTable('examination_schedules')) {
            Schema::create('examination_schedules', function (Blueprint $table) {
            $table->integer('schedule_id', true);
            $table->unsignedBigInteger('admin_id');
            $table->date('exam_date');
            $table->time('exam_time');
            $table->string('venue', 150);
            $table->integer('max_applicants');
            $table->integer('available_slots');
            $table->text('instructions')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['Open','Closed','Completed'])->nullable()->default('Open');
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
            $table->foreign('admin_id')->references('id')->on('users')->cascadeOnDelete();
            });
        }

        if (!Schema::hasTable('applications')) {
            Schema::create('applications', function (Blueprint $table) {
            $table->integer('application_id', true);
            $table->unsignedBigInteger('applicant_profile_id');
            $table->enum('program', ['Juris Doctor','Master of Legal Studies'])->nullable();
            $table->integer('admin_id')->nullable();
            $table->integer('schedule_id')->nullable();
            $table->enum('application_status', ['Pending','Under Review','Approved','Declined','Completed'])->nullable()->default('Pending');
            $table->text('remarks')->nullable();
            $table->dateTime('submitted_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
            $table->foreign('applicant_profile_id')->references('id')->on('applicant_profiles')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('admin_id')->references('admin_id')->on('admins')->nullOnDelete();
            $table->foreign('schedule_id')->references('schedule_id')->on('examination_schedules')->nullOnDelete();
            });
        }

        if (!Schema::hasTable('requirements')) {
            Schema::create('requirements', function (Blueprint $table) {
            $table->integer('requirement_id', true);
            $table->string('requirement_name', 150);
            $table->enum('program', ['Juris Doctor','Master of Legal Studies','Both'])->default('Both');
            $table->text('description')->nullable();
            $table->boolean('is_required')->nullable()->default('1');
            });
        }

        if (!Schema::hasTable('requirement_submissions')) {
            Schema::create('requirement_submissions', function (Blueprint $table) {
            $table->integer('submission_id', true);
            $table->integer('application_id');
            $table->integer('requirement_id');
            $table->string('file_name', 255);
            $table->string('file_path', 255);
            $table->string('file_type', 50);
            $table->integer('file_size');
            $table->enum('verification_status', ['Pending','Approved','Declined'])->nullable()->default('Pending');
            $table->text('remarks')->nullable();
            $table->dateTime('uploaded_at')->nullable()->useCurrent();
            $table->foreign('application_id')->references('application_id')->on('applications')->cascadeOnDelete();
            $table->foreign('requirement_id')->references('requirement_id')->on('requirements')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        // We cannot infer which tables predated this migration on an imported database.
        throw new RuntimeException('This baseline cannot be rolled back safely. Restore a verified backup instead.');
    }
};
