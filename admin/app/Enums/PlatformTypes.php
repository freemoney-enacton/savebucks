<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum PlatformTypes: string implements HasLabel, HasColor
{
    case WEB = 'web';
    case MOBILE = 'mobile';
    case ANDROID = 'android';
    case IOS = 'ios';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::WEB => 'Web',
            self::MOBILE => 'Mobile',
            self::ANDROID => 'Android',
            self::IOS => 'Ios',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::WEB => 'success',
            self::MOBILE => 'info',
            self::ANDROID => 'danger',
            self::IOS => 'warning',
        };
    }
}


