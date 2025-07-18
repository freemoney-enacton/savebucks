<?php

namespace App\Models;

use App\Enums\NetworkType;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Network extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $guarded = ['id'];

    protected $table = 'offerwall_networks';
    protected $casts = [
        'config_params' => 'array',
        'countries'     => 'array',
        'categories'    => 'array',
        'enabled'       => 'boolean',
        'type'          => NetworkType::class
    ];

    public $translatable = ['name'];

    /**
     * Get all of the comments for the Network
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    // public function offers(): HasMany
    // {
    //     return $this->hasMany(Offer::class, 'network', 'code');
    // }

    public static function getAll(): array
    {
        return static::select(['id', 'name', 'code'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->mapWithKeys(function ($user) {
                return [$user->code => $user->name];
            })
            ->toArray();
    }
}
