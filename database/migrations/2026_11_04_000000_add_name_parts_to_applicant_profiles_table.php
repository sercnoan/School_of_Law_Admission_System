<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('applicant_profiles', function (Blueprint $table) {
            $table->string('first_name', 100)->nullable()->after('full_name');
            $table->string('middle_name', 100)->nullable()->after('first_name');
            $table->string('last_name', 100)->nullable()->after('middle_name');
        });

        DB::table('applicant_profiles')
            ->select('id', 'full_name')
            ->orderBy('id')
            ->chunkById(100, function ($profiles) {
                foreach ($profiles as $profile) {
                    [$firstName, $middleName, $lastName] = $this->splitName(
                        (string) $profile->full_name
                    );

                    DB::table('applicant_profiles')
                        ->where('id', $profile->id)
                        ->update([
                            'first_name' => $firstName,
                            'middle_name' => $middleName,
                            'last_name' => $lastName,
                        ]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('applicant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'middle_name',
                'last_name',
            ]);
        });
    }

    private function splitName(string $fullName): array
    {
        $fullName = trim(preg_replace('/\s+/', ' ', $fullName));

        if ($fullName === '') {
            return [null, null, null];
        }

        if (str_contains($fullName, ',')) {
            [$lastName, $givenNames] = array_pad(
                array_map('trim', explode(',', $fullName, 2)),
                2,
                ''
            );
            $parts = preg_split('/\s+/', $givenNames, -1, PREG_SPLIT_NO_EMPTY);
            $firstName = array_shift($parts);

            return [
                $firstName ?: null,
                $parts ? implode(' ', $parts) : null,
                $lastName ?: null,
            ];
        }

        $parts = preg_split('/\s+/', $fullName, -1, PREG_SPLIT_NO_EMPTY);

        if (count($parts) === 1) {
            return [$parts[0], null, null];
        }

        $firstName = array_shift($parts);
        $lastName = array_pop($parts);

        return [
            $firstName,
            $parts ? implode(' ', $parts) : null,
            $lastName,
        ];
    }
};
