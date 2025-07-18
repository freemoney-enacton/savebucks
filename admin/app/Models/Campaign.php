<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AffiliateNetwork;
// use Spatie\Translatable\HasTranslations;

class Campaign extends Model
{
    use HasFactory;
    // use HasTranslations;

    public function network()
    {
        return $this->belongsTo(AffiliateNetwork::class);
    }

    public function campaignRates()
    {
        return $this->hasMany(CampaignRate::class, 'campaign_id');
    }
}
