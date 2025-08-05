<?php

namespace App\Filament\Affiliate\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Affiliate\Affiliate;
use App\Models\Affiliate\Payout;
use App\Models\Affiliate\Conversion;
use App\Models\Affiliate\ViewConversion;
use App\Models\Affiliate\Click;
use App\Filament\Affiliate\Resources\AffiliateResource;
use App\Filament\Affiliate\Resources\ViewConversionResource;
use App\Filament\Affiliate\Resources\PayoutResource;
use App\Filament\Affiliate\Resources\ClickResource;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\HtmlString;

class AffiliateStatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;
    public function getColumns(): int
    {
        return 4;
    }
    protected function getStats(): array
    {

        $affiliateCount         = Affiliate::count();
        $clickCount             = Click::count();
        $conversionCount        = ViewConversion::count();
        $conversionAmount       = ViewConversion::whereIn('conversion_status', ['paid', 'approved'])->sum('commission');
        // $conversionAmount       = View::where('status','<>','declined')->sum("commission");

       $stats = [
            [
                "title"      => "Total Affiliates",
                "hint"       => "Total Number of affiliates on the platform.",
                "value"      => $affiliateCount,
                "url"        => AffiliateResource::getUrl(),
                "value_type" => "number",
            ],
            [
                "title"      => "Total Clicks",
                "hint"       => "Total Clicks recorded",
                "value"      => $clickCount,
                "url"        => ClickResource::getUrl(),
                "value_type" => "number",
            ],
            [
                "title"      => "Total Conversions",
                "hint"       => "Count of Total Conversions recorded",
                "value"      => $conversionCount ,
                "url"        => ViewConversionResource::getUrl(),
                "value_type" => "number",
            ],
            [
                "title"      => "Total Conversion Amount",
                "hint"       => "Total Conversion Amount is sum of conversion's commissions where conversion status is paid or approved",
                "value"      => $conversionAmount,
                "url"        => ViewConversionResource::getUrl(),
                "value_type" => "amount",
            ],

        ];

        return collect($stats)
            ->map(fn($stat) => $this->getStatWithLink(
                    $stat['title'],
                    $stat['value'],
                    $stat['value_type'],
                    $stat['hint'],
                    $stat['url']
                )
            )
            ->toArray();
    }

     public function getStatWithLink($label, $value, $value_type, $tooltip = null, $url = null, $urlLabel = 'View All')
    {
        $formatedValue = match ($value_type) {
            'number' => formatNumber($value),
            'percent' => formatPercent($value),
            'amount' => formatCurrency($value),
        };

        return Stat::make($label,$value)
            ->label($this->getLabelWithTooltip($label, $tooltip))
            ->value($formatedValue)
            ->description("View All")
            ->url($url);
    }

    // public function getLabelWithTooltip($label, $tooltip)
    // {
    //     return new HtmlString(Blade::render('<div class="flex space-x-2 d-inline">'.($tooltip ? '<div class="cursor-pointer" x-data="" x-tooltip=\'{theme: "light" ,content: $refs?.template?.innerHTML, allowHTML: true, appendTo: $root, interactive: true}\'><template x-ref="template"><div class="text-left">'.($tooltip).'</div></template><x-heroicon-o-information-circle class="w-5 h-5 text-gray-500"/></div>': '').'<div>'.($label).'</div></div>'));
    // }


    public function getLabelWithTooltip($label, $tooltip)
    {
        if (!$tooltip) {
            return new HtmlString($label);
        }

        $html = '
            <div class="inline-flex items-center gap-1 space-x-2">
                <span class="mr-4">' . $label . '</span>
                <div class="tooltip-wrapper" style="position: relative; display: inline-block;">
                    <x-heroicon-o-information-circle class="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />

                    <div class="tooltip-box" style="
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        margin-bottom: 8px;
                        background: white;
                        color: #374151;
                        border: 1px solid #d1d5db;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        padding: 8px 12px;
                        border-radius: 6px;
                        font-size: 14px;
                        width: 320px;
                        text-align: left;
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity 0.2s ease;
                        z-index: 1000;
                    ">
                        ' . $tooltip . '

                        <!-- Arrow -->
                        <div style="
                            position: absolute;
                            top: 100%;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 0;
                            height: 0;
                            border-left: 6px solid transparent;
                            border-right: 6px solid transparent;
                            border-top: 6px solid white;
                            filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
                        "></div>
                    </div>
                </div>
            </div>

            <style>
                .tooltip-wrapper:hover .tooltip-box {
                    opacity: 1 !important;
                    visibility: visible !important;
                }
            </style>
        ';

        return new HtmlString(Blade::render($html));
    }

    public function getValueWithUrl($value, $url, $urlLabel = 'View All')
    {
        return new HtmlString(Blade::render('<div class="justify-between d-inline flex1"> <div class="text-3xl font-semibold tracking-tight text-gray-950">'.($value).'</div> <x-filament::link class="px-2 py-1 rounded shadow-md" href="'.($url).'" icon="heroicon-o-arrow-up-right" icon-position="after">'.($urlLabel).'</x-filament::link> </div>'));
    }
}
