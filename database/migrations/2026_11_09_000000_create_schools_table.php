<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('ched_code', 50)->nullable();
            $table->string('name');
            $table->string('region', 100);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['name', 'region']);
            $table->index(['is_active', 'name']);
            $table->index('ched_code');
        });

        $path = database_path('data/philippine_heis.csv');
        $file = fopen($path, 'r');

        if ($file === false) {
            throw new RuntimeException('The CHED school directory could not be opened.');
        }

        fgetcsv($file, null, ',', '"', '');
        $now = now();
        $rows = [];

        while (($record = fgetcsv($file, null, ',', '"', '')) !== false) {
            if (count($record) < 3 || blank($record[1])) {
                continue;
            }

            $rows[] = [
                'ched_code' => blank($record[0]) ? null : $record[0],
                'name' => $record[1],
                'region' => $record[2],
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            if (count($rows) === 500) {
                DB::table('schools')->insert($rows);
                $rows = [];
            }
        }

        fclose($file);

        if ($rows !== []) {
            DB::table('schools')->insert($rows);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
