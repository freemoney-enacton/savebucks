<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum OfferStatus: string implements HasLabel, HasColor
{
    case Draft = 'draft';
    case Publish = 'publish';
    case Trash = 'trash';
    case Removed = 'removed';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Publish => 'Publish',
            self::Trash => 'Trash',
            self::Removed => 'Removed',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Draft => 'info',
            self::Publish => 'success',
            self::Trash => 'danger',
            self::Removed => 'gray',
        };
    }
}


