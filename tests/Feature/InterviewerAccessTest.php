<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('redirects an interviewer to the interviewer portal', function () {
    $interviewer = User::factory()->create(['role' => 'interviewer']);

    $this->actingAs($interviewer)
        ->get('/dashboard')
        ->assertRedirect('/interviewer/interviewees');
});

it('allows interviewers to view the interviewee list', function () {
    $interviewer = User::factory()->create(['role' => 'interviewer']);

    $this->actingAs($interviewer)
        ->get('/interviewer/interviewees')
        ->assertOk();
});

it('prevents applicants and administrators from entering the interviewer portal', function (string $role) {
    $user = User::factory()->create(['role' => $role]);

    $this->actingAs($user)
        ->get('/interviewer/interviewees')
        ->assertForbidden();
})->with(['applicant', 'admin']);

it('prevents an interviewer from entering admin pages', function () {
    $interviewer = User::factory()->create(['role' => 'interviewer']);

    $this->actingAs($interviewer)
        ->get('/admin/interviewees')
        ->assertForbidden();
});
