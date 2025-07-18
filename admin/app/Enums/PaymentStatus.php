<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum PaymentStatus: string implements HasLabel, HasColor
{
    case Created = 'created';
    case Processing = 'processing';
    case Completed = 'completed';
    case Declined = 'declined';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Created => 'Created',
            self::Processing => 'Processing',
            self::Completed => 'Completed',
            self::Declined => 'Declined',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Created => 'info',
            self::Processing => 'gray',
            self::Completed => 'success',
            self::Declined => 'danger',
        };
    }
}


