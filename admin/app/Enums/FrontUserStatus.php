<?php

namespace App\Enums;

use Filament\Support\Contracts;

enum FrontUserStatus: string implements Contracts\HasColor, Contracts\HasLabel
{
    case Active = 'active';
    case Disabled = 'disabled';
    case Banned = 'banned';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Disabled => 'Disabled',
            self::Banned => 'Banned',
        };
    }

    public function getColor(): ?string
    {
        return match ($this) {
            self::Active => 'success',
            self::Disabled => 'danger',
            self::Banned => 'warning',
        };
    }
}
