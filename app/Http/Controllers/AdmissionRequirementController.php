<?php

namespace App\Http\Controllers;

use App\Models\AdmissionProgram;
use App\Models\Requirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdmissionRequirementController extends Controller
{
    public function index(Request $request)
    {
        $programs = AdmissionProgram::ordered()->get([
            'id',
            'name',
            'short_name',
            'is_active',
        ]);
        abort_if($programs->isEmpty(), 404, 'No admission programs are configured.');

        $selectedProgram = (string) $request->query('program', $programs->first()->name);

        if (! $programs->contains('name', $selectedProgram)) {
            $selectedProgram = $programs->first()->name;
        }

        return Inertia::render('Admin/AdmissionRequirements', [
            'programs' => $programs,
            'selectedProgram' => $selectedProgram,
            'requirements' => Requirement::where('program', $selectedProgram)
                ->ordered()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatedRequirement($request);
        $validated['is_active'] = true;
        $validated['sort_order'] = (Requirement::where('program', $validated['program'])
            ->max('sort_order') ?? 0) + 10;

        Requirement::create($validated);

        return back()->with('success', 'Admission requirement added successfully.');
    }

    public function update(Request $request, Requirement $requirement)
    {
        $validated = $this->validatedRequirement($request, $requirement->program);
        unset($validated['program']);

        $requirement->update($validated);

        return back()->with('success', 'Admission requirement updated successfully.');
    }

    public function toggle(Requirement $requirement)
    {
        $requirement->update([
            'is_active' => ! $requirement->is_active,
        ]);

        return back()->with(
            'success',
            $requirement->is_active
                ? 'Requirement enabled for applicants.'
                : 'Requirement disabled. Existing submitted files were preserved.'
        );
    }

    public function destroy(Requirement $requirement)
    {
        if ($requirement->submissions()->exists()) {
            return back()->withErrors([
                'requirement' => 'This requirement already has submitted files. Disable it instead of deleting it.',
            ]);
        }

        $requirement->delete();

        return back()->with('success', 'Admission requirement deleted.');
    }

    public function move(Request $request, Requirement $requirement)
    {
        $validated = $request->validate([
            'direction' => ['required', Rule::in(['up', 'down'])],
        ]);

        $comparison = $validated['direction'] === 'up' ? '<' : '>';
        $ordering = $validated['direction'] === 'up' ? 'desc' : 'asc';

        $neighbor = Requirement::where('program', $requirement->program)
            ->where('sort_order', $comparison, $requirement->sort_order)
            ->orderBy('sort_order', $ordering)
            ->orderBy('requirement_id', $ordering)
            ->first();

        if (! $neighbor) {
            return back();
        }

        DB::transaction(function () use ($requirement, $neighbor) {
            $currentOrder = $requirement->sort_order;
            $requirement->update(['sort_order' => $neighbor->sort_order]);
            $neighbor->update(['sort_order' => $currentOrder]);
        });

        return back();
    }

    private function validatedRequirement(Request $request, ?string $fixedProgram = null): array
    {
        $request->merge([
            'requirement_name' => trim((string) $request->input('requirement_name')),
            'description' => trim((string) $request->input('description')) ?: null,
            'program' => $fixedProgram ?? $request->input('program'),
        ]);

        $programs = AdmissionProgram::pluck('name')->all();

        return $request->validate([
            'program' => ['required', Rule::in($programs)],
            'requirement_name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_required' => ['required', 'boolean'],
        ]);
    }
}
