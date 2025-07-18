<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum LeaderboardFrequency: string implements HasLabel, HasColor
{
    case Daily = 'Daily';
    case Weekly = 'Weekly';
    case Monthly = 'Monthly';
    // case Manual = 'Manual';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Daily => 'Daily',
            self::Weekly => 'Weekly',
            self::Monthly => 'Monthly',
            // self::Manual => 'Manual',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Daily => 'info',
            self::Weekly => 'success',
            self::Monthly => 'warning',
            // self::Manual => 'danger',
        };
    }
}


