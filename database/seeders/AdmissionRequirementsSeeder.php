<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmissionRequirementsSeeder extends Seeder
{
    public function run(): void
    {
        // Preserve the requirements catalog on existing installations.
        if (DB::table('requirements')->exists()) {
            return;
        }

        DB::table('requirements')->insert([
            ['requirement_name' => 'Student Information Sheet', 'program' => 'Both', 'description' => 'Completed Student Information Sheet', 'is_required' => true],
            ['requirement_name' => 'Transcript of Records (TOR)', 'program' => 'Master of Legal Studies', 'description' => 'Official Transcript of Records', 'is_required' => true],
            ['requirement_name' => 'Undergraduate General Weighted Average (GWA)', 'program' => 'Both', 'description' => 'Certified Undergraduate General Weighted Average', 'is_required' => true],
            ['requirement_name' => 'Certificate of Enrollment / Proof of Work Experience', 'program' => 'Master of Legal Studies', 'description' => 'Certificate of Enrollment or Proof of Work Experience', 'is_required' => true],
            ['requirement_name' => 'Letter of Recommendation from the Unit Head / Immediate Supervisor', 'program' => 'Master of Legal Studies', 'description' => 'Recommendation from the Unit Head or Immediate Supervisor', 'is_required' => true],
            ['requirement_name' => 'Certificate of Good Moral Character or Recommendation from two (2) disinterested persons', 'program' => 'Both', 'description' => 'Certificate of Good Moral Character OR recommendation from two (2) disinterested persons', 'is_required' => true],
            ['requirement_name' => 'Transcript of Records (TOR) / Certificate of Candidacy for Graduating Students', 'program' => 'Juris Doctor', 'description' => 'Official Transcript of Records or Certificate of Candidacy for graduating students', 'is_required' => true],
        ]);
    }
}
