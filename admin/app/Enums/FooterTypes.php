<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum FooterTypes: string implements HasLabel, HasColor
{
    // case HTML = 'html';
    case Links = 'links';
    case BottomLinks = 'bottom_links';
    case About = 'about_us';
    case SocialLinks = 'social_links';

    public function getLabel(): ?string
    {
        return match ($this) {
            // self::HTML => 'HTML',
            self::Links => 'Links',
            self::BottomLinks => 'Bottom Links',
            self::About => 'About',
            self::SocialLinks => 'Social Links',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {
            self::About => 'danger',
            // self::HTML => 'success',
            self::Links => 'info',
            self::BottomLinks => 'success',
            self::SocialLinks => 'warning',
        };
    }
}


