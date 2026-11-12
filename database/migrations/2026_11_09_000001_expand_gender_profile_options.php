<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $values = [
            'Male',
            'Female',
            'Non-binary',
            'Genderqueer',
            'Gender-fluid',
            'Agender',
            'Prefer not to say',
            'Other',
        ];

        foreach ($values as $index => $value) {
            $existing = DB::table('profile_options')
                ->where('field', 'gender')
                ->where('value', $value)
                ->exists();

            if ($existing) {
                DB::table('profile_options')
                    ->where('field', 'gender')
                    ->where('value', $value)
                    ->update([
                        'sort_order' => ($index + 1) * 10,
                        'updated_at' => now(),
                    ]);

                continue;
            }

            DB::table('profile_options')->insert([
                'field' => 'gender',
                'value' => $value,
                'sort_order' => ($index + 1) * 10,
                'is_active' => true,
                'is_custom' => $value === 'Other',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('profile_options')
            ->where('field', 'gender')
            ->whereIn('value', [
                'Non-binary',
                'Genderqueer',
                'Gender-fluid',
                'Agender',
                'Prefer not to say',
            ])
            ->delete();

        DB::table('profile_options')
            ->where('field', 'gender')
            ->where('value', 'Other')
            ->update([
                'sort_order' => 30,
                'updated_at' => now(),
            ]);
    }
};
