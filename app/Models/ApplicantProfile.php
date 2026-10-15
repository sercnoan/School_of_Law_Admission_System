<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicantProfile extends Model
{
    protected $table = 'applicant_profiles';

    protected $fillable = [
        'user_id',
        'applicant_number',
        'photo_path',
        'full_name',
        'school_graduated',
        'employment_status',
        'present_address',
        'age',
        'gender',
        'contact_number',
        'religion',
        'civil_status',
        'individual_income',
        'individual_income_range',
        'family_income',
        'family_income_range',
        'ethnic_affiliation',
        'is_indigenous',
        'indigenous_community',
        'is_pwd',
        'pwd_type',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
