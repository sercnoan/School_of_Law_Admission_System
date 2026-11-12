<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_options', function (Blueprint $table) {
            $table->id();
            $table->string('field', 50);
            $table->string('value', 100);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_custom')->default(false);
            $table->timestamps();

            $table->unique(['field', 'value']);
            $table->index(['field', 'is_active', 'sort_order']);
        });

        $now = now();
        $rows = [];
        $defaults = [
            'employment_status' => [
                'Student',
                'Employed',
                'Self-Employed',
                'Not Currently Employed',
            ],
            'civil_status' => [
                'Single',
                'Married',
                'Widowed',
                'Separated',
                'Divorced',
            ],
            'gender' => [
                'Male',
                'Female',
                'Non-binary',
                'Genderqueer',
                'Gender-fluid',
                'Agender',
                'Prefer not to say',
                'Other',
            ],
            'religion' => [
                'Roman Catholic',
                'Islam',
                'Iglesia ni Cristo',
                'Seventh-day Adventist',
                'Aglipayan',
                'Iglesia Filipina Independiente',
                'Bible Baptist',
                'United Church of Christ in the Philippines',
                "Jehovah's Witness",
                'Church of Christ',
                'Evangelical / Born Again Christian',
                'Protestant',
                'Pentecostal',
                'Methodist',
                'Episcopal / Anglican',
                'The Church of Jesus Christ of Latter-day Saints',
                'Buddhism',
                'Hinduism',
                'Judaism',
                'Sikhism',
                'Baháʼí Faith',
                'Indigenous / Traditional Beliefs',
                'No religious affiliation',
                'Prefer not to say',
                'Other',
            ],
            'ethnic_affiliation' => [
                'Bisaya/Cebuano',
                'Tagalog',
                'Ilocano',
                'Hiligaynon/Ilonggo',
                'Waray',
                'Bicolano',
                'Kapampangan',
                'Pangasinense',
                'Moro',
                'Indigenous Peoples Group',
                'Prefer not to say',
                'Other',
            ],
            'income_range' => [
                'Below ₱10,000.00',
                '₱10,001.00 – ₱20,000.00',
                '₱20,001.00 – ₱30,000.00',
                '₱30,001.00 – ₱40,000.00',
                '₱40,001.00 – ₱50,000.00',
                '₱50,001.00 – ₱100,000.00',
                'Above ₱100,000.00',
            ],
        ];

        foreach ($defaults as $field => $values) {
            foreach ($values as $index => $value) {
                $rows[] = [
                    'field' => $field,
                    'value' => $value,
                    'sort_order' => ($index + 1) * 10,
                    'is_active' => true,
                    'is_custom' => $value === 'Other'
                        && in_array($field, ['gender', 'religion', 'ethnic_affiliation'], true),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('profile_options')->insert($rows);

        Schema::table('applicant_profiles', function (Blueprint $table) {
            $table->string('civil_status', 100)->change();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_options');
    }
};
