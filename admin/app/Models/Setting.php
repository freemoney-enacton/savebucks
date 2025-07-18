<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Filament\Forms\Components;
use Filament\Forms\Form;
use Filament\Forms\Schema;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'val',
    ];

    // use HasTranslations;


    // protected $translatable = [
    //     'val',
    // ];

    public static function get(string $key = '*', mixed $default = null): mixed
    {


        $settings = array();
        Setting::all()->each(function ($setting) use (&$settings) {
            data_set($settings, $setting->name, $setting->val);
        });

        return $settings;

        if ($key === '*') {
            return $settings;
        }

        return data_get($settings, $key, $default);
    }

    public static function set(string $key, mixed $value): mixed
    {
        $setting = self::updateOrCreate(
            ['name' => $key],
            ['val' => $value]
        );

        cache()->forget(config('settings.cache_key'));

        return $setting->value;
    }
}
