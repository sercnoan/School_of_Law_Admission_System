<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExaminationSchedule extends Model
{
    protected $table = 'examination_schedules';

    protected $primaryKey = 'schedule_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'admin_id',
        'exam_date',
        'exam_time',
        'venue',
        'max_applicants',
        'available_slots',
        'instructions',
        'notes',
        'status',
    ];

    protected $casts = [
        'exam_date' => 'date',
        'exam_time' => 'datetime:H:i',
        'max_applicants' => 'integer',
        'available_slots' => 'integer',
    ];

    /**
     * Admin who created the examination schedule.
     *
     * admin_id references users.id.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'admin_id',
            'id'
        );
    }
}