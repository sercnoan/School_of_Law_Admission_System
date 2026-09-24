<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequirementSubmission extends Model
{
    protected $table = 'requirement_submissions';

    protected $primaryKey = 'submission_id';

    public $timestamps = false;

    protected $fillable = [
        'application_id',
        'requirement_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'verification_status',
        'remarks',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(
            Application::class,
            'application_id',
            'application_id'
        );
    }

    public function requirement(): BelongsTo
    {
        return $this->belongsTo(
            Requirement::class,
            'requirement_id',
            'requirement_id'
        );
    }
}