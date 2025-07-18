<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum NetworkType: string implements HasLabel, HasColor
{
    case Tasks = 'tasks';
    case Surveys = 'surveys';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Tasks => 'Tasks',
            self::Surveys => 'Surveys',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Tasks => 'info',
            self::Surveys => 'success',
        };
    }
}


