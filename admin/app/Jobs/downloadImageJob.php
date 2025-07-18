<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class downloadImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public $offers;
    public $network;

    public function __construct($offers = [], $network)
    {
        $this->offers = $offers;
        $this->network = $network;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        foreach ($this->offers as $offer) {
            if ($offer->network_image) {
                try {
                    $response = Http::timeout(3)->get($offer->network_image,);
                    Log::info($response->header('Content-Type'));
                    Log::info("res". $response->successful() ." url". $offer->network_image);
                    if ($response->successful()) {
                        $imageContents = $response->body();
                        $contentType = $response->header('Content-Type');
                        if ($contentType == 'png' || $contentType == 'jpg' || $contentType == 'jpeg') {
                            $fileName = uniqid() . '.' . $contentType;
                        } else {
                            $mimeType = explode(';', $contentType)[0];
                            $extension = explode('/', $mimeType)[1];
                            $fileName = uniqid() . '.' . $extension ?? 'jpg';
                        }

                        Storage::disk('frontend')->put( $fileName, $imageContents);
                        $imageUrl = Storage::disk('frontend')->url( $fileName);

                        $offer->image = $imageUrl;
                        $offer->save();
                    } else {
                        $offer->image = null;
                        $offer->save();
                    }
                } catch (\Throwable $th) {
                    throw $th;
                }
            }
        }
    }
}
