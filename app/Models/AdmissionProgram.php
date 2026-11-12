<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class AdmissionProgram extends Model
{
    protected $fillable = [
        'name',
        'short_name',
        'description',
        'qualification',
        'prospectus_url',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
