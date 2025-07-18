<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class ViewConversion extends Model
{
    use HasFactory;

    protected $connection   = 'affiliate';
    protected $table        = 'vw_affiliate_conversions';
    protected $primaryKey   = 'conversion_id'; 
    public $incrementing    = false;
    public $timestamps      = false; //
    protected $guarded      = ['*'];


     public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function postbackLog(): BelongsTo
    {
        return $this->belongsTo(PostbackLog::class);
    }

    public function campaignGoal(): BelongsTo
    {
        return $this->belongsTo(CampaignGoal::class);
    }

    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    public function payout(): BelongsTo
    {
        return $this->belongsTo(Payout::class);
    }

    public function click(): BelongsTo
    {
        return $this->belongsTo(Click::class, 'click_code', 'click_code');
    }

}
