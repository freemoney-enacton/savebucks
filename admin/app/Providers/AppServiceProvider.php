<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Setting;
use App\Models\Language;
use Filament\Forms\Form;
use Illuminate\Foundation\Vite;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cookie;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Support\ServiceProvider;
use Filament\Forms\Components\TextInput;
use BezhanSalleh\FilamentShield\Resources\RoleResource;
use Studio\Totem\Totem;
use Illuminate\Support\Facades\Auth;
use Filament\Forms\Components\Component;
use Filament\Forms\Components\Field;
use Filament\Forms\Components\Section;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\HtmlString;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {   
        Model::unguard();

        Totem::auth(function($request) {          
            return Auth::check();
        });

        Gate::define('use-translation-manager', function (?User $user) {
            return $user !== null && $user->hasRole('super_admin');
        });

        Debugbar::disable();

        // Config::set('default_currency', Setting::where('name', 'default_currency')->first()->value);

        Table::configureUsing(function (Table $table) {
            $table
                ->defaultSort('id','desc')
                ->paginationPageOptions([10,25,50,100])
                ->defaultPaginationPageOption(25);
        });

        Field::macro("infotip", function(string $tooltip) {
            return $this
                ->hint(new HtmlString(Blade::render('<div class="cursor-pointer" x-data="" x-tooltip=\'{theme: "light" ,content: $refs.template.innerHTML, allowHTML: true, appendTo: $root, interactive: true}\'><template x-ref="template">'.($tooltip).'</template><x-heroicon-o-question-mark-circle class="w-5 h-5 text-gray-400"/></div>')));
        });

        Component::macro("labelinfotip", function(string $tooltip) {
            return $this
                ->label(new HtmlString(Blade::render('<div class="flex space-x-2 d-inline"><div>'.($this->getLabel()).'</div>' . '<div class="cursor-pointer" x-data="" x-tooltip=\'{theme: "light" ,content: $refs.template.innerHTML, allowHTML: true, appendTo: $root, interactive: true}\'><template x-ref="template"><div class="text-left">'.($tooltip).'</div></template><x-heroicon-o-question-mark-circle class="w-5 h-5 text-gray-400"/></div></div>')));
        });

        Section::macro("labelinfotip", function(string $tooltip) {
            return $this
                ->label(new HtmlString(Blade::render('<div class="flex space-x-2 d-inline"><div>'.($this->getLabel()).'</div>' . '<div class="cursor-pointer" x-data="" x-tooltip=\'{theme: "light" ,content: $refs.template.innerHTML, allowHTML: true, appendTo: $root, interactive: true}\'><template x-ref="template"><div class="text-left">'.($tooltip).'</div></template><x-heroicon-o-question-mark-circle class="w-5 h-5 text-gray-400"/></div></div>')));
        });
        TextColumn::macro("labelinfotip", function(string $tooltip) {
            return $this
                ->label(new HtmlString(Blade::render('<div class="flex space-x-2 d-inline"><div>'.($this->getLabel()).'</div>' . '<div class="cursor-pointer" x-data="" x-tooltip=\'{theme: "light" ,content: $refs.template.innerHTML, allowHTML: true, appendTo: $root, interactive: true}\'><template x-ref="template"><div class="text-left">'.($tooltip).'</div></template><x-heroicon-o-question-mark-circle class="w-5 h-5 text-gray-400"/></div></div>')));
        });
    }
}
