<?php

namespace App\Http\Requests\Task;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('assignee_ids')) {
            $ids = $this->input('assignee_ids', []);
            $this->merge([
                'assignee_ids' => is_array($ids)
                    ? array_values(array_filter(array_map('intval', $ids)))
                    : [],
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['sometimes', 'required', 'in:todo,doing,done'],
            'priority' => ['sometimes', 'required', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
            'assignee_ids' => ['sometimes', 'nullable', 'array'],
            'assignee_ids.*' => ['exists:users,id'],
            'position' => ['sometimes', 'nullable', 'numeric'],
        ];
    }
}
