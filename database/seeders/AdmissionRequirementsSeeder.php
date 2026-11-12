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
            ['requirement_name' => 'Student Information Sheet', 'program' => 'Juris Doctor [Thesis] (JD)', 'description' => 'Completed Student Information Sheet', 'is_required' => true, 'is_active' => true, 'sort_order' => 10],
            ['requirement_name' => 'Undergraduate General Weighted Average (GWA)', 'program' => 'Juris Doctor [Thesis] (JD)', 'description' => 'Certified Undergraduate General Weighted Average', 'is_required' => true, 'is_active' => true, 'sort_order' => 20],
            ['requirement_name' => 'Certificate of Good Moral Character or Recommendation from two (2) disinterested persons', 'program' => 'Juris Doctor [Thesis] (JD)', 'description' => 'Certificate of Good Moral Character OR recommendation from two (2) disinterested persons', 'is_required' => true, 'is_active' => true, 'sort_order' => 30],
            ['requirement_name' => 'Transcript of Records (TOR) / Certificate of Candidacy for Graduating Students', 'program' => 'Juris Doctor [Thesis] (JD)', 'description' => 'Official Transcript of Records or Certificate of Candidacy for graduating students', 'is_required' => true, 'is_active' => true, 'sort_order' => 40],
            ['requirement_name' => 'Student Information Sheet', 'program' => 'Master of Legal Studies-Juris Doctor (MLS-JD)', 'description' => 'Completed Student Information Sheet', 'is_required' => true, 'is_active' => true, 'sort_order' => 10],
            ['requirement_name' => 'Transcript of Records (TOR)', 'program' => 'Master of Legal Studies-Juris Doctor (MLS-JD)', 'description' => 'Official Transcript of Records', 'is_required' => true, 'is_active' => true, 'sort_order' => 20],
            ['requirement_name' => 'Undergraduate General Weighted Average (GWA)', 'program' => 'Master of Legal Studies-Juris Doctor (MLS-JD)', 'description' => 'Certified Undergraduate General Weighted Average', 'is_required' => true, 'is_active' => true, 'sort_order' => 30],
            ['requirement_name' => 'Certificate of Employment / Proof of Work Experience', 'program' => 'Master of Legal Studies-Juris Doctor (MLS-JD)', 'description' => 'Certificate of Employment or Proof of Work Experience', 'is_required' => true, 'is_active' => true, 'sort_order' => 40],
            ['requirement_name' => 'Letter of Recommendation from the Unit Head / Immediate Supervisor', 'program' => 'Master of Legal Studies-Juris Doctor (MLS-JD)', 'description' => 'Recommendation from the Unit Head or Immediate Supervisor', 'is_required' => true, 'is_active' => true, 'sort_order' => 50],
            ['requirement_name' => 'Certificate of Good Moral Character or Recommendation from two (2) disinterested persons', 'program' => 'Master of Legal Studies-Juris Doctor (MLS-JD)', 'description' => 'Certificate of Good Moral Character OR recommendation from two (2) disinterested persons', 'is_required' => true, 'is_active' => true, 'sort_order' => 60],
        ]);
    }
}
