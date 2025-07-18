<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum RewardType: string implements HasLabel, HasColor
{
    case Spin = 'spin';
    case Flat = 'flat';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Spin => 'Spin',
            self::Flat => 'Flat',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Spin => 'info',
            self::Flat => 'success',
        };
    }
}


