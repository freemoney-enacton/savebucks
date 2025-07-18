<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum LeaderboardRunStatus: string implements HasLabel, HasColor
{
    case Running = 'running';
    case Awarded = 'awarded';
    case Completed = 'completed';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Running => 'Running',
            self::Awarded => 'Awarded',
            self::Completed => 'Completed',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Running => 'info',
            self::Awarded => 'success',
            self::Completed => 'warning',
        };
    }
}


