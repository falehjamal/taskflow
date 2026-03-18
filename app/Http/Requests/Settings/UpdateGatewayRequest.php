<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGatewayRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdministrator() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $name = $this->route('name');

        return match ($name) {
            'email' => [
                'type' => 'required|in:smtp,api',
                'config' => 'required|array',
                'config.host' => 'required_if:type,smtp|nullable|string',
                'config.port' => 'required_if:type,smtp|nullable|integer',
                'config.username' => 'nullable|string',
                'config.password' => 'nullable|string',
                'config.encryption' => 'nullable|in:tls,ssl,',
                'config.provider' => 'required_if:type,api|nullable|in:sendgrid,postmark',
                'config.api_key' => 'required_if:type,api|nullable|string',
                'active' => 'boolean',
            ],
            'wa' => [
                'type' => 'required|in:api,baileys',
                'config' => 'required|array',
                'config.base_url' => 'required_if:type,api|nullable|string',
                'config.api_key' => 'required_if:type,api|nullable|string',
                'active' => 'boolean',
            ],
            default => ['type' => 'required|string', 'config' => 'array', 'active' => 'boolean'],
        };
    }
}
