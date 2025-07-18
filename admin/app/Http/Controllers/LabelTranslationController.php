<?php

namespace App\Http\Controllers;

use App\Jobs\translateTo;
use App\Models\Language;
use App\Models\Translation;
use Filament\Notifications\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;

class LabelTranslationController extends Controller
{

    public static function translations($group)
    {
        $translations = Translation::where('page', $group)->get();
        $languages = config('freemoney.languages.keys');
        $view = view('label-translations.form', compact('translations', 'languages'));
        $view->render();
        return $view;
    }

    public function store(Request $request)
    {
        // dd($request->except('_token'));
        $translations = $request->except('_token');
        foreach ($translations as $key => $value) {
            $translation = Translation::find($key);
            $translation->update(['trans_value' => json_encode($value)]);
        }
        Notification::make()
            ->title('Saved successfully')
            ->success()
            ->send();
        return back()->with('success', 'Translations updated successfully');
    }

    public function copyTo($sourceLang, $destLang)
    {
        foreach (Translation::all() as $trRow) {
            $trans_value = json_decode($trRow->trans_value, true);

            if (!strlen($trans_value[$destLang]))
                $trans_value[$destLang] = $trans_value[$sourceLang] ?? null;
            $trRow->trans_value = json_encode($trans_value);
            $trRow->save();
        }
        return response()->json(['success' => true], 200);
    }

    public function translateTo($sourceLang, $destLang)
    {
        translateTo::dispatch($sourceLang, $destLang);
        return response()->json(['success' => true], 200);
    }
}
