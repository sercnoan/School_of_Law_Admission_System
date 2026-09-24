<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    protected $table = 'applications';

    protected $primaryKey = 'application_id';

    public $timestamps = false;

    protected $fillable = [
        'applicant_profile_id',
        'program',
        'admin_id',
        'schedule_id',
        'application_status',
        'remarks',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(
            ApplicantProfile::class,
            'applicant_profile_id'
        );
    }
}