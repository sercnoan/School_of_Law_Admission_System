<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileOption extends Model
{
    public const FIELD_LABELS = [
        'employment_status' => 'Employment Status',
        'civil_status' => 'Civil Status',
        'gender' => 'Gender',
        'religion' => 'Religion',
        'ethnic_affiliation' => 'Ethnic Affiliation',
        'income_range' => 'Monthly Income Range',
    ];

    protected $fillable = [
        'field',
        'value',
        'sort_order',
        'is_active',
        'is_custom',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'is_custom' => 'boolean',
        ];
    }

    public function scopeOrdered($query)
    {
        return $query
            ->orderBy('field')
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    public static function activeValues(string $field): array
    {
        return static::query()
            ->where('field', $field)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->pluck('value')
            ->all();
    }

    public static function profileColumns(string $field): array
    {
        return match ($field) {
            'income_range' => [
                'individual_income_range',
                'family_income_range',
            ],
            'employment_status',
            'civil_status',
            'gender',
            'religion',
            'ethnic_affiliation' => [$field],
            default => [],
        };
    }
}
