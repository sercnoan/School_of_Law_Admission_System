<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $values = [
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
        ];

        foreach ($values as $index => $value) {
            DB::table('profile_options')->updateOrInsert(
                [
                    'field' => 'religion',
                    'value' => $value,
                ],
                [
                    'sort_order' => ($index + 1) * 10,
                    'is_active' => true,
                    'is_custom' => $value === 'Other',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        DB::table('profile_options')
            ->where('field', 'religion')
            ->delete();
    }
};
