<?php

namespace App\Http\Controllers;

use App\Models\AdmissionProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdmissionProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Programs', [
            'programs' => AdmissionProgram::ordered()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatedProgram($request);
        $validated['sort_order'] = (AdmissionProgram::max('sort_order') ?? 0) + 10;
        $validated['is_active'] = true;

        AdmissionProgram::create($validated);

        return back()->with('success', 'Admission program added successfully.');
    }

    public function update(Request $request, AdmissionProgram $admissionProgram)
    {
        $validated = $this->validatedProgram($request, $admissionProgram);
        $oldName = $admissionProgram->name;

        DB::transaction(function () use ($admissionProgram, $oldName, $validated) {
            $admissionProgram->update($validated);

            if ($oldName !== $validated['name']) {
                DB::table('applications')
                    ->where('program', $oldName)
                    ->update(['program' => $validated['name']]);
                DB::table('requirements')
                    ->where('program', $oldName)
                    ->update(['program' => $validated['name']]);
            }
        });

        return back()->with('success', 'Admission program updated successfully.');
    }

    public function toggle(AdmissionProgram $admissionProgram)
    {
        if ($admissionProgram->is_active && AdmissionProgram::where('is_active', true)->count() <= 1) {
            return back()->withErrors([
                'program' => 'At least one admission program must remain active.',
            ]);
        }

        $admissionProgram->update([
            'is_active' => ! $admissionProgram->is_active,
        ]);

        return back()->with(
            'success',
            $admissionProgram->is_active
                ? 'Admission program enabled.'
                : 'Admission program disabled for new applicants.'
        );
    }

    public function destroy(AdmissionProgram $admissionProgram)
    {
        $isUsed = DB::table('applications')
            ->where('program', $admissionProgram->name)
            ->exists()
            || DB::table('requirements')
                ->where('program', $admissionProgram->name)
                ->exists();

        if ($isUsed) {
            return back()->withErrors([
                'program' => 'This program is already used by applications or requirements. Disable it instead of deleting it.',
            ]);
        }

        if ($admissionProgram->is_active && AdmissionProgram::where('is_active', true)->count() <= 1) {
            return back()->withErrors([
                'program' => 'At least one admission program must remain active.',
            ]);
        }

        $admissionProgram->delete();

        return back()->with('success', 'Admission program deleted.');
    }

    public function move(Request $request, AdmissionProgram $admissionProgram)
    {
        $validated = $request->validate([
            'direction' => ['required', Rule::in(['up', 'down'])],
        ]);

        $comparison = $validated['direction'] === 'up' ? '<' : '>';
        $ordering = $validated['direction'] === 'up' ? 'desc' : 'asc';

        $neighbor = AdmissionProgram::where(
            'sort_order',
            $comparison,
            $admissionProgram->sort_order
        )
            ->orderBy('sort_order', $ordering)
            ->orderBy('id', $ordering)
            ->first();

        if (! $neighbor) {
            return back();
        }

        DB::transaction(function () use ($admissionProgram, $neighbor) {
            $currentOrder = $admissionProgram->sort_order;
            $admissionProgram->update(['sort_order' => $neighbor->sort_order]);
            $neighbor->update(['sort_order' => $currentOrder]);
        });

        return back();
    }

    private function validatedProgram(
        Request $request,
        ?AdmissionProgram $admissionProgram = null
    ): array {
        $request->merge([
            'name' => trim((string) $request->input('name')),
            'short_name' => trim((string) $request->input('short_name')) ?: null,
            'description' => trim((string) $request->input('description')) ?: null,
            'qualification' => trim((string) $request->input('qualification')) ?: null,
            'prospectus_url' => trim((string) $request->input('prospectus_url')) ?: null,
        ]);

        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:180',
                Rule::unique('admission_programs', 'name')->ignore($admissionProgram?->id),
            ],
            'short_name' => ['nullable', 'string', 'max:60'],
            'description' => ['nullable', 'string', 'max:500'],
            'qualification' => ['nullable', 'string', 'max:5000'],
            'prospectus_url' => ['nullable', 'url:http,https', 'max:500'],
        ]);
    }
}
