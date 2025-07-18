<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class PaymentType extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $guarded = ['id'];

    protected $casts = [
        'payment_inputs' => 'array',
        'country_configuration' => 'array',
        'country_customizable' => 'boolean',
    ];


    public $translatable = [
        'name',
        'description',
        'account_input_label',
        'account_input_hint',
        'payment_inputs',
        'payment_group',
    ];


    protected static function booted()
    {
        static::saving(function ($model) {
            // Clear country configuration when not customizable
            if (!$model->country_customizable) {
                $model->country_configuration = null;
            }

            if (!$model->transaction_fees_allowed) {
                $model->transaction_fees_amount = null;
                $model->transaction_fees_type = null;
            }
            if (!$model->transaction_bonus_allowed) {
                $model->transaction_bonus_amount = null;
                $model->transaction_bonus_type = null;
            }
        });
    }
}
