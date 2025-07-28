<?php

namespace App\Observers;

use App\Models\Affiliate\Affiliate;
use App\Models\Affiliate\Campaign;
use App\Models\Affiliate\AffiliateCampaign;
use Illuminate\Support\Facades\Log;


class AffiliateObserver
{
    /**
     * Handle the Affiliate "created" event.
     */
    public function created(Affiliate $affiliate): void
    {
        if ($affiliate->approval_status === 'approved') {
            $this->assignDefaultCampaigns($affiliate);
        }
    }

    /**
     * Handle the Affiliate "updated" event.
     */
    public function updated(Affiliate $affiliate): void
    {
        // Check if approval_status is being changed to 'approved'
        if ($affiliate->isDirty('approval_status') && $affiliate->approval_status === 'approved' &&    $affiliate->getOriginal('approval_status') !== 'approved') {
            
            $this->assignDefaultCampaigns($affiliate);
        }
    }

    /**
     * Handle the Affiliate "deleted" event.
     */
    public function deleted(Affiliate $affiliate): void
    {
        //
    }

    /**
     * Handle the Affiliate "restored" event.
     */
    public function restored(Affiliate $affiliate): void
    {
        //
    }

    /**
     * Handle the Affiliate "force deleted" event.
     */
    public function forceDeleted(Affiliate $affiliate): void
    {
        //
    }

    private function assignDefaultCampaigns(Affiliate $affiliate): void
    {
        try {
            // Get all default campaigns that are active
            $defaultCampaigns = Campaign::where('is_default', true)
                ->where('status', 'active')
                ->get();

            foreach ($defaultCampaigns as $campaign) {
                // Check if campaign is already assigned to avoid duplicates
                $exists = AffiliateCampaign::where([
                    'affiliate_id' => $affiliate->id,
                    'campaign_id'  => $campaign->id,
                ])->exists();

                if (!$exists) {
                    AffiliateCampaign::create([
                        'affiliate_id' => $affiliate->id,
                        'campaign_id'  => $campaign->id,
                        'status'       => 'approved', // or 'pending' based on your business logic
                    ]);

                    Log::info("Default campaign '{$campaign->name}' assigned to affiliate '{$affiliate->email}'");

                    //Send Notification
                    \Filament\Notifications\Notification::make()
                        ->title('Default Campaign Auto-Assigned')
                        ->body("Campaign '{$campaign->name}' has been automatically assigned to affiliate '{$affiliate->name}' ({$affiliate->email})")
                        ->success()
                        ->icon('heroicon-o-link')
                        ->actions([
                            \Filament\Notifications\Actions\Action::make('view_affiliate')
                                ->label('View Affiliate')
                                ->url(route('filament.affiliate.resources.affiliates.view', $affiliate->id))
                                ->button(),
                        ]);
 
                   
                }
            }
        } catch (\Exception $e) {
            Log::error("Failed to assign default campaigns to affiliate {$affiliate->id}: {$e->getMessage()}");
        }
    }
}
