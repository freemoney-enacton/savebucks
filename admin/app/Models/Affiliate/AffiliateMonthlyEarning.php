<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class AffiliateMonthlyEarning extends Model
{
    use HasFactory;

    protected $connection   = 'affiliate';
    protected $table        = 'affiliate_monthly_earnings';
    protected $primaryKey   = 'id';
    public $incrementing    = false;
    public $timestamps      = false; //
    protected $guarded      = ['*'];

    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class, 'affiliate_id');
    }

}
