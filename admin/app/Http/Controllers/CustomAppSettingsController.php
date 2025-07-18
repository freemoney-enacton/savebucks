<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateSettingsConfig;
use Illuminate\Http\Request;

use QCod\AppSettings\Setting\AppSettings;

class CustomAppSettingsController extends Controller
{

    /**
     * Save settings
     *
     * @param Request $request
     * @param AppSettings $appSettings
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, AppSettings $appSettings)
    {
        // validate the settings
        $this->validate($request, $appSettings->getValidationRules());

        // save settings
        $appSettings->save($request);
        GenerateSettingsConfig::dispatch();
        \Http::get(config('app.api_url') . '/api/v1/cache/settings');
        return redirect()->route('filament.admin.pages.app-settings');
    }
}
