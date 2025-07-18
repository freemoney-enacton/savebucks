<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\FrontUserResource;
use App\Filament\Resources\OfferResource;
use App\Filament\Resources\UserBonusResource;
use App\Filament\Resources\UserOfferSaleResource;
use App\Filament\Resources\StoreResource;
use App\Filament\Resources\CouponResource;
use App\Filament\Resources\UserRefferralEarningResource;
use App\Filament\Resources\UserClaimResource;
use App\Models\FrontUser;
use App\Models\Offer;
use App\Models\Store;
use App\Models\Coupon;
use App\Models\User;
use App\Models\UserBonus;
use App\Models\UserClaim;
use App\Models\UserOfferClick;
use App\Models\UserOfferSale;
use App\Models\UserRefferralEarning;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\HtmlString;

class StatsOverview extends BaseWidget
{
    public function getColumns(): int
    {
        return 4;
    }

    protected function getStats(): array
    {
        $activeUserCount = FrontUser::where('status', 'active')->count();
        $activeOfferCount = Offer::where('status', 'publish')->count();
        $conversions = UserOfferSale::where('status', 'confirmed')->get();
        $conversionsCount = $conversions->count();
        $revenue = $conversions->sum('payout');
        $taskEarning = $conversions->sum('amount');

        $bonuses = UserBonus::where('status', 'confirmed')->get();
        $bonusesCount = $bonuses->count();
        $bonusEarning = $bonuses->sum('amount');

        $referrals = UserRefferralEarning::where('status', 'confirmed')->get();
        $referralsCount = $referrals->count();
        $referralEarning = $referrals->sum('referral_amount');
        $referralRevenue = $referrals->sum('payout');

        $conversionCost = $taskEarning + $bonusEarning + $referralEarning;
        $profit = $revenue - $conversionCost;

        $revenuePerUser = $activeOfferCount == 0 ? 0 : ($revenue / $activeUserCount);
        $conversionCostPercent = $revenue == 0 ? 0 : (($conversionCost / $revenue) * 100);
        $cashbackPerUser = $activeOfferCount == 0 ? 0 : ($taskEarning / $activeUserCount);
        $referralRevenuePercent = $revenue == 0 ? 0 : (($referralRevenue / $revenue) * 100);
        $publishedStores = Store::where('status', 'publish')->count();
        $missingCashbackTicketsCount = UserClaim::where('status', 'open')->count();
        $activeCashbackCouponsCount = Coupon::where('status', 'publish')->count();


        $stats = [
            [
                "title" => "Revenue",
                "hint" => "Total income generated from all sources, before deducting expenses. It shows how much money is being brought in through sales and referrals, reflecting the overall financial performance of your business.",
                "value" => $revenue,
                "url" => UserOfferSaleResource::getUrl(),
                "value_type" => "amount"
            ],
            [
                "title" => "Bonus Rewards",
                "hint" => "Total amount spent on bonuses or incentives given to users. This metric provides insight into your investment in user engagement and the cost associated with rewarding users for their actions.",
                "value" => $bonusEarning,
                "url" => UserBonusResource::getUrl(),
                "value_type" => "amount"
            ],

            [
                "title" => "Task Earnings",
                "hint" => "Earnings generated from tasks or actions completed by users. This metric helps assess how well individual tasks contribute to overall revenue and evaluates the effectiveness of task-based incentives.",
                "value" => $taskEarning,
                "url" => UserOfferSaleResource::getUrl(),
                "value_type" => "amount"
            ],
            [
                "title" => "Profit",
                "hint" => "Displays net earnings after deducting task earnings, bonuses, and referral earnings from total revenue. Indicates the overall financial health and profitability of your business. Formula: `Profit = Revenue - Task Earnings - Bonus",
                "value" => $profit,
                "url" => UserOfferSaleResource::getUrl(),
                "value_type" => "amount"
            ],
            [
                "title" => "Active Users",
                "hint" => "This metric shows the number of users currently engaging with your platform. It provides insight into user activity and growth trends, indicating the overall health and engagement level of your user base.",
                "value" => $activeUserCount,
                "url" => FrontUserResource::getUrl(),
                "value_type" => "number"
            ],
            [
                "title" => "Active Offers",
                "hint" => "Represents the number of offers currently available for users to participate in. This metric helps you understand the variety and volume of opportunities on your platform, which can impact user engagement and participation rates.",
                "value" => $activeOfferCount,
                "url" => OfferResource::getUrl(),
                "value_type" => "number"
            ],
            [
                "title" => "Active Cashback Offers",
                "hint"  => "Active cashback coupons count that are currently available to users.",
                "value" => $activeCashbackCouponsCount,
                "url"   => CouponResource::getUrl() . '?activeTab=publish',
                "value_type" => "number"
            ],
            [
                "title" => "Published Stores",
                "hint"  => "Number of stores published on the platform.",
                "value" => $publishedStores,
                "url"   => StoreResource::getUrl() . '?activeTab=publish',
                "value_type" => "number"
            ],
            [
                "title" => "Average Revenue per User",
                "hint" => "Shows the average income generated from each user. Helps assess the revenue potential and value of each user. Formula: `ARPU = Revenue / Total Active Users`",
                "value" => $revenuePerUser,
                "url" => FrontUserResource::getUrl(),
                "value_type" => "amount"
            ],
            [
                "title" => "Average Cashback per User",
                "hint" => "The average amount of cashback given to each user. Reflects your investment in user rewards and helps evaluate the impact of cashback incentives. Formula: `Average Cashback per User = Total Cashback Paid / Total Active Users`",
                "value" => $cashbackPerUser,
                "url" => FrontUserResource::getUrl(),
                "value_type" => "amount"
            ],
            [
                "title" => "Conversion Cost Percentage",
                "hint" => "Percentage of revenue spent on acquiring each conversion, including marketing and bonuses. Helps gauge spending efficiency in relation to revenue. Formula: `CPC % = (Total Cost of Conversions / Total Revenue) × 100`",
                "value" => $conversionCostPercent,
                "url" => UserOfferSaleResource::getUrl(),
                "value_type" => "percent"
            ],
            [
                "title" => "Confirmed Conversions Count",
                "hint" => "Tracks the total number of successful conversions driven by users. This reflects the effectiveness of your offers and campaigns in generating desired actions or sales, providing insight into the success of your marketing efforts.",
                "value" => $conversionsCount,
                "url" => UserOfferSaleResource::getUrl(),
                "value_type" => "number"
            ],
            [
                "title" => "Referral Earning",
                "hint" => "Revenue earned from users who refer others to your platform. This shows the effectiveness of your referral program in generating additional revenue through user referrals.",
                "value" => $referralEarning,
                "url" => UserRefferralEarningResource::getUrl(),
                "value_type" => "amount"
            ],
            [
                "title" => "Referral Revenue Percentage",
                "hint" => "Proportion of total revenue generated from referral activities. Shows how significant referrals are in contributing to overall revenue. Formula: `Referral Revenue % = (Referral Revenue / Total Revenue) × 100`",
                "value" => $referralRevenuePercent,
                "url" => UserRefferralEarningResource::getUrl(),
                "value_type" => "percent"
            ],
            [
                "title" => "Missing Cashback Tickets",
                "hint"  => "Number of cashback tickets that have not been redeemed.",
                "value" => $missingCashbackTicketsCount,
                "url"   => UserClaimResource::getUrl() . '?activeTab=open',
                "value_type" => "number"
            ],

        ];

        return collect($stats)
            ->map(
                fn($stat) => $this->getStatWithLink(
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

        return Stat::make($label, $value)
            ->label($this->getLabelWithTooltip($label, $tooltip))
            ->value($formatedValue)
            ->description("View All")
            ->url($url);
    }

    public function getLabelWithTooltip($label, $tooltip)
    {
        return new HtmlString(Blade::render('<div class="d-inline flex space-x-2">' . ($tooltip ? '<div class="cursor-pointer" x-data="" x-tooltip=\'{theme: "light" ,content: $refs?.template?.innerHTML, allowHTML: true, appendTo: $root, interactive: true}\'><template x-ref="template"><div class="text-left">' . ($tooltip) . '</div></template><x-heroicon-o-information-circle class="w-5 h-5 text-gray-500"/></div>' : '') . '<div>' . ($label) . '</div></div>'));
    }

    public function getValueWithUrl($value, $url, $urlLabel = 'View All')
    {
        return new HtmlString(Blade::render('<div class="d-inline flex1 justify-between"> <div class="text-3xl font-semibold tracking-tight text-gray-950">' . ($value) . '</div> <x-filament::link class="shadow-md px-2 py-1 rounded" href="' . ($url) . '" icon="heroicon-o-arrow-up-right" icon-position="after">' . ($urlLabel) . '</x-filament::link> </div>'));
    }
}
