<x-mail::message>
# Hello {{ $user->name }},

Here is quick update on task status.

<table style="width: 100%; border-collapse: collapse;">
    <thead>
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Offer</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Provider</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Transaction ID</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Date</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($userOfferSales as $offerSale)
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; vertical-align: middle;">
                @if(!empty($offerSale->offer->image))
                    <img src="{{ $offerSale->offer->image }}" alt="{{ $offerSale->offer->name }}" width="60" height="60" style="vertical-align: middle; margin-right: 10px; object-fit: contain; border-radius: 4px;">
                @endif
                <span style="vertical-align: middle;">{{ $offerSale->offer->name ?? 'N/A' }}</span>
            </td>
            <td style="border: 1px solid #ddd; padding: 8px;">{{ ucfirst($offerSale?->offer?->network ?? 'N/A') }}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">{{ $offerSale->transaction_id ?? 'N/A' }}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">{{ number_format($offerSale->payout, 2) }}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">{{ $offerSale->updated_at?->format('Y-m-d') ?? 'N/A' }}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">{{ $offerSale->status->name ?? 'N/A' }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<br>Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
