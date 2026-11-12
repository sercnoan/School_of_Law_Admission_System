<?php

namespace App\Http\Controllers;

use App\Models\ProfileOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileOptionController extends Controller
{
    public function index()
    {
        $options = ProfileOption::ordered()
            ->get()
            ->groupBy('field')
            ->map(fn ($items) => $items->values())
            ->all();

        return Inertia::render('Admin/ProfileOptions', [
            'fieldLabels' => ProfileOption::FIELD_LABELS,
            'options' => $options,
        ]);
    }

    public function store(Request $request)
    {
        $request->merge([
            'value' => trim((string) $request->input('value')),
        ]);

        $validated = $request->validate([
            'field' => [
                'required',
                Rule::in(array_keys(ProfileOption::FIELD_LABELS)),
            ],
            'value' => [
                'required',
                'string',
                'max:100',
                Rule::unique('profile_options', 'value')
                    ->where('field', $request->input('field')),
            ],
        ]);

        $validated['sort_order'] =
            (ProfileOption::where('field', $validated['field'])
                ->max('sort_order') ?? 0) + 10;
        $validated['is_active'] = true;
        $validated['is_custom'] = false;

        ProfileOption::create($validated);

        return back()->with('success', 'Form option added successfully.');
    }

    public function update(Request $request, ProfileOption $profileOption)
    {
        abort_if($profileOption->is_custom, 422, 'The custom-entry option cannot be renamed.');

        $request->merge([
            'value' => trim((string) $request->input('value')),
        ]);

        $validated = $request->validate([
            'value' => [
                'required',
                'string',
                'max:100',
                Rule::unique('profile_options', 'value')
                    ->where('field', $profileOption->field)
                    ->ignore($profileOption->id),
            ],
        ]);

        $newValue = $validated['value'];
        $oldValue = $profileOption->value;

        DB::transaction(function () use ($profileOption, $oldValue, $newValue) {
            $profileOption->update(['value' => $newValue]);

            foreach (ProfileOption::profileColumns($profileOption->field) as $column) {
                DB::table('applicant_profiles')
                    ->where($column, $oldValue)
                    ->update([$column => $newValue]);
            }
        });

        return back()->with('success', 'Form option updated successfully.');
    }

    public function toggle(ProfileOption $profileOption)
    {
        abort_if($profileOption->is_custom, 422, 'The custom-entry option must remain available.');

        if ($profileOption->is_active) {
            $activeCount = ProfileOption::where('field', $profileOption->field)
                ->where('is_active', true)
                ->count();

            if ($activeCount <= 1) {
                return back()->withErrors([
                    'option' => 'At least one option must remain active for this field.',
                ]);
            }
        }

        $profileOption->update([
            'is_active' => ! $profileOption->is_active,
        ]);

        return back()->with(
            'success',
            $profileOption->is_active
                ? 'Form option enabled.'
                : 'Form option disabled.'
        );
    }

    public function destroy(ProfileOption $profileOption)
    {
        abort_if($profileOption->is_custom, 422, 'The custom-entry option cannot be deleted.');

        if ($profileOption->is_active) {
            $activeCount = ProfileOption::where('field', $profileOption->field)
                ->where('is_active', true)
                ->count();

            if ($activeCount <= 1) {
                return back()->withErrors([
                    'option' => 'At least one option must remain active for this field.',
                ]);
            }
        }

        $profileOption->delete();

        return back()->with('success', 'Form option deleted successfully.');
    }

    public function move(Request $request, ProfileOption $profileOption)
    {
        $validated = $request->validate([
            'direction' => ['required', Rule::in(['up', 'down'])],
        ]);

        $comparison = $validated['direction'] === 'up' ? '<' : '>';
        $ordering = $validated['direction'] === 'up' ? 'desc' : 'asc';

        $neighbor = ProfileOption::where('field', $profileOption->field)
            ->where('sort_order', $comparison, $profileOption->sort_order)
            ->orderBy('sort_order', $ordering)
            ->orderBy('id', $ordering)
            ->first();

        if (! $neighbor) {
            return back();
        }

        DB::transaction(function () use ($profileOption, $neighbor) {
            $currentOrder = $profileOption->sort_order;
            $profileOption->update(['sort_order' => $neighbor->sort_order]);
            $neighbor->update(['sort_order' => $currentOrder]);
        });

        return back();
    }
}
