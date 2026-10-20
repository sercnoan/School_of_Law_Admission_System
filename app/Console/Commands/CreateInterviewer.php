<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class CreateInterviewer extends Command
{
    protected $signature = 'interviewer:create {name} {email}';

    protected $description = 'Create or update an interviewer account';

    public function handle(): int
    {
        $password = $this->secret('Password (at least 8 characters)');
        $confirmation = $this->secret('Confirm password');

        $validator = validator([
            'email' => $this->argument('email'),
            'password' => $password,
            'password_confirmation' => $confirmation,
        ], [
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        User::updateOrCreate(
            ['email' => $this->argument('email')],
            [
                'name' => $this->argument('name'),
                'password' => Hash::make($password),
                'role' => 'interviewer',
                'email_verified_at' => now(),
            ]
        );

        $this->info('Interviewer account is ready.');

        return self::SUCCESS;
    }
}
