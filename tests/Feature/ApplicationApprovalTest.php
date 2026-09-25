<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

beforeEach(function () {
    $admin = User::factory()->create();
    $admin->forceFill(['role' => 'admin'])->save();
    $this->actingAs($admin);
    $applicant = User::factory()->create();
    DB::table('applicant_profiles')->insert([
        'id' => 1, 'user_id' => $applicant->id, 'applicant_number' => 'TEST-1',
        'full_name' => 'Test Applicant', 'school_graduated' => 'Test',
        'employment_status' => 'Test', 'present_address' => 'Test', 'age' => 25,
        'gender' => 'Other', 'contact_number' => 'Test', 'religion' => 'Test',
        'civil_status' => 'Single',
    ]);
    DB::table('applications')->insert([
        'application_id' => 1, 'applicant_profile_id' => 1, 'program' => 'Juris Doctor',
        'application_status' => 'Under Review', 'remarks' => 'Original remarks',
    ]);
    DB::table('requirements')->insert([
        ['requirement_id' => 1, 'requirement_name' => 'Common document', 'program' => 'Both', 'is_required' => 1],
        ['requirement_id' => 2, 'requirement_name' => 'Law document', 'program' => 'Juris Doctor', 'is_required' => 1],
        ['requirement_id' => 3, 'requirement_name' => 'Other program document', 'program' => 'Master of Legal Studies', 'is_required' => 1],
        ['requirement_id' => 4, 'requirement_name' => 'Optional document', 'program' => 'Both', 'is_required' => 0],
    ]);
});

function approvalTestDocument(int $requirementId, string $status): void
{
    DB::table('requirement_submissions')->insert([
        'application_id' => 1, 'requirement_id' => $requirementId,
        'file_name' => 'test.pdf', 'file_path' => 'test.pdf', 'file_type' => 'application/pdf',
        'file_size' => 100, 'verification_status' => $status,
    ]);
}

it('rejects approval when a required document needs attention', function ($status) {
    approvalTestDocument(1, 'Approved');
    if ($status !== 'Missing') {
        approvalTestDocument(2, $status);
    }
    $this->post('/admin/applications/1/status', [
        'application_status' => 'Approved', 'remarks' => 'Changed remarks',
    ])->assertSessionHasErrors(['application_status']);
    $this->assertDatabaseHas('applications', [
        'application_id' => 1, 'application_status' => 'Under Review', 'remarks' => 'Original remarks',
    ]);
})->with(['Missing', 'Pending', 'Declined']);

it('approves when all applicable required documents are approved', function () {
    approvalTestDocument(1, 'Approved');
    approvalTestDocument(2, 'Approved');
    $this->post('/admin/applications/1/status', ['application_status' => 'Approved'])
        ->assertSessionHasNoErrors()->assertRedirect('/admin/applications/1');
    $this->assertDatabaseHas('applications', ['application_id' => 1, 'application_status' => 'Approved']);
});

it('still permits a decline with incomplete documents', function () {
    $this->post('/admin/applications/1/status', ['application_status' => 'Declined'])
        ->assertSessionHasNoErrors();
    $this->assertDatabaseHas('applications', ['application_id' => 1, 'application_status' => 'Declined']);
});

it('does not let a duplicate approval conceal a declined document', function () {
    approvalTestDocument(1, 'Approved');
    approvalTestDocument(2, 'Approved');
    approvalTestDocument(2, 'Declined');
    $this->post('/admin/applications/1/status', ['application_status' => 'Approved'])
        ->assertSessionHasErrors(['application_status']);
});

it('rejects approval by an applicant', function () {
    $this->actingAs(User::factory()->create());
    $this->post('/admin/applications/1/status', ['application_status' => 'Approved'])->assertForbidden();
});

it('locks applicant mutations after approval or completion', function ($status) {
    DB::table('applications')->where('application_id', 1)->update(['application_status' => $status]);
    $applicant = User::findOrFail(DB::table('applicant_profiles')->where('id', 1)->value('user_id'));
    $this->actingAs($applicant);
    Illuminate\Support\Facades\Storage::fake('public');
    $this->post('/applicant/program', ['program' => 'Master of Legal Studies'])
        ->assertSessionHasErrors('program');
    $this->post('/applicant/requirements/1/upload', [
        'file' => Illuminate\Http\UploadedFile::fake()->create('document.pdf', 20, 'application/pdf'),
    ])->assertSessionHasErrors('file');
    $this->post('/applicant/requirements/submit')->assertSessionHasErrors('application');
    $this->assertDatabaseHas('applications', [
        'application_id' => 1, 'application_status' => $status, 'program' => 'Juris Doctor',
    ]);
    $this->assertDatabaseCount('requirement_submissions', 0);
    expect(Illuminate\Support\Facades\Storage::disk('public')->allFiles())->toBe([]);
})->with(['Approved', 'Completed']);

it('lets staff reopen an unbooked application for applicant corrections', function () {
    DB::table('applications')->where('application_id', 1)->update(['application_status' => 'Approved']);
    $this->post('/admin/applications/1/status', ['application_status' => 'Under Review'])
        ->assertSessionHasNoErrors();
    $applicant = User::findOrFail(DB::table('applicant_profiles')->where('id', 1)->value('user_id'));
    $this->actingAs($applicant);
    $this->post('/applicant/program', ['program' => 'Master of Legal Studies'])->assertSessionHasNoErrors();
    Illuminate\Support\Facades\Storage::fake('public');
    $this->post('/applicant/requirements/1/upload', [
        'file' => Illuminate\Http\UploadedFile::fake()->create('document.pdf', 20, 'application/pdf'),
    ])->assertSessionHasNoErrors();
    $this->assertDatabaseHas('applications', ['application_id' => 1, 'application_status' => 'Under Review', 'program' => 'Master of Legal Studies']);
    $this->assertDatabaseHas('requirement_submissions', ['application_id' => 1, 'requirement_id' => 1, 'verification_status' => 'Pending']);
});

it('blocks reopening booked applications through any editable status', function ($status) {
    DB::table('examination_schedules')->insert([
        'schedule_id' => 1, 'admin_id' => auth()->id(), 'exam_date' => '2026-10-01',
        'exam_time' => '10:00:00', 'venue' => 'Test', 'max_applicants' => 10, 'available_slots' => 9,
    ]);
    DB::table('applications')->where('application_id', 1)->update(['application_status' => 'Approved', 'schedule_id' => 1]);
    $this->post('/admin/applications/1/status', ['application_status' => $status])
        ->assertSessionHasErrors('application_status');
    $this->assertDatabaseHas('applications', ['application_id' => 1, 'application_status' => 'Approved', 'schedule_id' => 1]);
    $this->assertDatabaseHas('examination_schedules', ['schedule_id' => 1, 'available_slots' => 9]);
})->with(['Pending', 'Under Review', 'Declined']);

it('protects an existing booking even if a legacy application is under review', function () {
    DB::table('examination_schedules')->insert([
        'schedule_id' => 1, 'admin_id' => auth()->id(), 'exam_date' => '2026-10-01',
        'exam_time' => '10:00:00', 'venue' => 'Test', 'max_applicants' => 10, 'available_slots' => 9,
    ]);
    DB::table('applications')->where('application_id', 1)->update(['schedule_id' => 1]);
    $this->actingAs(User::findOrFail(DB::table('applicant_profiles')->where('id', 1)->value('user_id')));
    $this->post('/applicant/program', ['program' => 'Master of Legal Studies'])->assertSessionHasErrors('program');
    $this->post('/applicant/requirements/submit')->assertSessionHasErrors('application');
});
