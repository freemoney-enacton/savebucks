<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum PostbackLogStatus: string implements HasLabel, HasColor
{
    case Processed = 'processed';
    case Pending = 'pending';
    case Error = 'error';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Processed => 'Processed',
            self::Pending => 'Pending',
            self::Error => 'Error',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Processed => 'info',
            self::Pending => 'gray',
            self::Error => 'danger',
        };
    }
}


