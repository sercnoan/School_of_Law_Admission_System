<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('requirement_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(
            RequirementSubmission::class,
            'requirement_id',
            'requirement_id'
        );
    }
}
