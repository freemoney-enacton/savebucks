<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Language;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'Super Admmin',
            'email' => 'admin@mail.com',
            'password' => bcrypt('admin@mail.com'),
        ]);

        $this->createDefaultLanguage();

        $this->createDefaultSettings();
    }

    /**
     * Create default Language
     */
    private function createDefaultLanguage(): void
    {
        Language::insert([
            [
                'name' => 'English',
                'code' => 'en',
                'flag' => asset('images/lang/en.png'),
                'is_enabled' => true,
            ],
            [
                'name' => 'Hindi',
                'code' => 'hi',
                'flag' => asset('images/lang/hi.png'),
                'is_enabled' => true,
            ],
            [
                'name' => 'Japanese',
                'code' => 'ja',
                'flag' => null,
                'is_enabled' => true,
            ],
            [
                'name' => 'Gujarati',
                'code' => 'gu',
                'flag' => null,
                'is_enabled' => true,
            ],
            [
                'name' => 'Franch',
                'code' => 'fr',
                'flag' => null,
                'is_enabled' => true,
            ],
        ]);
    }

    /**
     * Create default settings
     */
    private function createDefaultSettings(): void
    {
        Setting::insert([
            [ 'name' => 'default_currency', 'val' => 'INR', 'group' => 'default', ],
            [ 'name' => 'name', 'val' => 'FreeMoney', 'group' => 'default', ],
            [ 'name' => 'default_lang', 'val' => 'en', 'group' => 'default', ],
            [ 'name' => 'fallback_lang', 'val' => 'en', 'group' => 'default', ],
            [ 'name' => 'default_country', 'val' => 'US', 'group' => 'default', ],
            [ 'name' => 'timezone', 'val' => 'UTC', 'group' => 'default', ],
            [ 'name' => 'admin_email', 'val' => 'freecash@givmail.com', 'group' => 'default', ],
        ]);
    }
}
