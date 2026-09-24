<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Requirement extends Model
{
    protected $table = 'requirements';

    protected $primaryKey = 'requirement_id';

    public $timestamps = false;

    protected $fillable = [
        'requirement_name',
        'program',
        'description',
        'is_required',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function submissions(): HasMany
    {
        return $this->hasMany(
            RequirementSubmission::class,
            'requirement_id',
            'requirement_id'
        );
    }
}