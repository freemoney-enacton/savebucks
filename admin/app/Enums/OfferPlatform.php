<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum OfferPlatform: string implements HasLabel, HasColor
{
    case Ios = 'ios';
    case Android = 'android';
    case Web = 'web';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Ios => 'Ios',
            self::Android => 'Android',
            self::Web => 'Web',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Ios => 'info',
            self::Android => 'success',
            self::Web => 'danger',
        };
    }
}


