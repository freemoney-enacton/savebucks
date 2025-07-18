<?php

namespace App\Forms\Components;

use Filament\Forms\Components\Field;

class BlockLangJsonInput extends Field
{
    protected string $view = 'forms.components.block-lang-json-input';

    protected array | \Closure | null $langOptions = [];
    protected string | \Closure | null $activeLang = '';
    protected mixed $value = '';

    public function langOptions(array | \Closure | null $options): static
    {
        $this->langOptions = $options;
        return $this;
    }

    public function getLangOptions()
    {
        return $this->evaluate($this->langOptions);
    }

    public function activeLang(string | \Closure | null $options): static
    {
        $this->activeLang = $options;
        return $this;
    }

    public function getActiveLang()
    {
        return $this->evaluate($this->activeLang);
    }

    public function value(mixed $value)
    {
        $this->value = $value;
        return $this->value;
    }

    public function getJsonValue()
    {
        return json_decode($this->value, true);
    }
}
