<?php

if (!function_exists('formatCurrency')) {
    function formatCurrency($amount, $currency = null)
    {
        if(!$currency) {
            $currency = config('freemoney.currencies.default', 'USD');
        }

        $fmt = new NumberFormatter('en_US', NumberFormatter::CURRENCY);
        $fmt->setTextAttribute(NumberFormatter::CURRENCY_CODE, $currency);
        return $fmt->formatCurrency(floatval($amount), $currency);
    }
}

if (!function_exists('formatNumber')) {
    function formatNumber($number)
    {
        $fmt = new NumberFormatter('en_US', NumberFormatter::DECIMAL);
        return $fmt->format(floatval($number));
    }
}

if (!function_exists('formatPercent')) {
    function formatPercent($value)
    {
        return sprintf("%.2f%%", round($value, 2));
    }
}