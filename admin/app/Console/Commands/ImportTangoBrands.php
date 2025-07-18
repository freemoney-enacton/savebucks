<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;
use EnactOn\AffPort\Core\Processors\SaveToFile;
use EnactOn\ProCashBee\Core\Models\GiftCardBrand;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Filament\Notifications\Notification;

class ImportTangoBrands extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tango:import-brands';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'IMport TangoCard Catalog';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $this->info('🚀 Starting Tango import...');
        // dump("command auto import started ====>");

        try {

            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode(config('services.tango.platform_name') . ':' . config('services.tango.platform_key')),
                'Content-Type' => 'application/json',
            ])->get('https://api.tangocard.com/raas/v2/catalogs?verbose=true');
            $response->throw(); // This will throw an exception for 4xx and 5xx status codes
            $catalog = $response->json();

            // Save the response to file for further debugging
            SaveToFile::save($response->body(), $response->status(), 'Tango', 'getCatalog', 'JSON');

            if ($response->successful()) {
                $responseData = $response->json();
                $collections = collect($responseData['brands']);
                $chunks = $collections->chunk(25);

                $chunks->each(function ($chunk) {

                    foreach ($chunk as $key => $collection) {

                        $giftCard = GiftCardBrand::withoutGlobalScopes()
                            ->where('sku', $collection['brandKey'])
                            ->where('vendor', 'tango')
                            ->first();

                        if ($giftCard) {

                            // dump($giftCard);
                            // $giftCard->description = $collection['description'];
                            // $giftCard->terms = $collection['terms'];
                            // $giftCard->image = (isset($collection['imageUrls']) && isset($collection['imageUrls']['278w-326ppi']))  //will remove
                                // ? $this->giftCardLogo($collection['imageUrls']['278w-326ppi'], $collection['brandKey']) : null;
                            $giftCard->items = $collection['items'];
                            $giftCard->card_status = $collection['status'];
                            $giftCard->last_updated_at = $this->convertDatetime($collection['lastUpdateDate']);
                            $giftCard->active = ($collection['status'] === 'active') ? 1 : 0;

                            $this->updateDenominations($giftCard, $collection['items']);

                            $extra_information['brandRequirements'] = $collection['brandRequirements'];
                            $extra_information['disclaimer'] = $collection['disclaimer'];
                            $giftCard->extra_information = $extra_information;
                            // dump($giftCard->card_status);
                            $this->info('Tmago Brand Updated...'. $giftCard['id'] . "status => " . $giftCard['card_status'] );

                            $giftCard->save();

                        } else {

                            $giftCard = new GiftCardBrand();
                            $giftCard->vendor = 'tango';
                            $giftCard->sku = $collection['brandKey'];
                            $giftCard->name = $collection['brandName'];
                            // $giftCard->description = $collection['description'];
                            // $giftCard->terms = $collection['terms'];
                            $giftCard->image = (isset($collection['imageUrls']) && isset($collection['imageUrls']['278w-326ppi'])) ? $this->giftCardLogo($collection['imageUrls']['278w-326ppi'], $collection['brandKey']) : NULL;

                            $giftCard->items = ($collection['items']);
                            $giftCard->active = ($collection['status'] === 'active') ? 1 : 0;
                            // $giftCard->denomination = json_encode($collection['denomination']);
                            $giftCard->card_status = $collection['status'];
                            $giftCard->created = $collection['createdDate'];
                            $giftCard->last_updated_at =  $collection['lastUpdateDate'];
                            $extra_information['brandRequirements'] = $collection['brandRequirements'];
                            $extra_information['disclaimer'] = $collection['disclaimer'];
                            $giftCard->extra_information = $extra_information;
                            // dump("adding", $giftCard->card_status);

                            $giftCard->save();
                        }
                    }
                });
            }

            $this->info("Processed:");

            Notification::make()
                ->title('Tango Gift-Card Brand Import Completed')
                ->success()
                ->send();

        } catch (RequestException $e) {

            $statusCode = $e->response->status();
            $errorMessage = $e->getMessage();
            // dd($errorMessage);
        }
    }


    private function updateDenominations($giftCard, $items)
    {
        try {
            $currentDenominations = $giftCard->denomination ?? [];
            $tangoFixedValues = [];
            $tangoVariableRanges = [];

            foreach ($items as $item) {
                if (($item['status'] ?? '') !== 'active') continue;

                if ($item['valueType'] === 'FIXED_VALUE' && isset($item['faceValue'])) {
                    $tangoFixedValues[] = (int) $item['faceValue'];
                }

                if ($item['valueType'] === 'VARIABLE_VALUE' && isset($item['minValue'], $item['maxValue'])) {
                    $tangoVariableRanges[] = [
                        'min' => (int) $item['minValue'],
                        'max' => (int) $item['maxValue']
                    ];
                }

                if (isset($item['fixedValues']) && is_array($item['fixedValues'])) {
                    foreach ($item['fixedValues'] as $fixedValue) {
                        $tangoFixedValues[] = (int) $fixedValue;
                    }
                }

                if (isset($item['variableRange']['min'], $item['variableRange']['max'])) {
                    $tangoVariableRanges[] = [
                        'min' => (int) $item['variableRange']['min'],
                        'max' => (int) $item['variableRange']['max']
                    ];
                }
            }

            $tangoFixedValues = array_unique($tangoFixedValues);
            $finalDenominations = [];

            foreach ($currentDenominations as $existingDenom) {
                $denomValue = (int) $existingDenom;
                $isValid = false;

                if (in_array($denomValue, $tangoFixedValues)) {
                    $isValid = true;
                }

                if (!$isValid) {
                    foreach ($tangoVariableRanges as $range) {
                        if ($denomValue >= $range['min'] && $denomValue <= $range['max']) {
                            $isValid = true;
                            break;
                        }
                    }
                }

                if ($isValid) {
                    $finalDenominations[] = $denomValue;
                }
            }

            sort($finalDenominations);
            $giftCard->denomination = $finalDenominations;
        } catch (\Exception $e) {
            $this->warn("Error updating denominations: " . $e->getMessage());
        }
    }

    private function convertDatetime($isoDatetime)
    {
        if (empty($isoDatetime)) {
            return null;
        }

        try {
            return Carbon::parse($isoDatetime)->format('Y-m-d H:i:s');
        } catch (\Exception $e) {
            return null;
        }
    }


    public function giftCardLogo($logo, $slug)
    {
        $contents = file_get_contents($logo);
        $name = substr($logo, strrpos($logo, '/') + 1);
        $extension = \File::extension($name);
        $filename = $slug . '.' . $extension;

        if (!Storage::disk('frontend')->has('gift-card/tango/' . $filename)) {
            Storage::disk('frontend')->put('gift-card/tango/' . $filename, $contents);
        }
        return  Storage::disk('frontend')->url(md5('gift-card/tango') . '/' . $filename);

        // if (!Storage::disk('frontend')->has('gift-card/tgc/' . $filename)) {
        //     Storage::disk('frontend')->put('gift-card/tgc/' . $filename, $contents);
        // }
        // return  Storage::disk('frontend')->url(('gift-card/tgc') . '/' . $filename);
    }
}
