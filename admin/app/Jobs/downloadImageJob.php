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
use App\Models\Offer;
use Illuminate\Queue\Middleware\WithoutOverlapping;

class downloadImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

   public $tries = 5; 
   public $network;
   public $selfJob = false;

   public function __construct($network, $selfJob = false)
   {
       $this->network = $network;
       $this->selfJob = $selfJob ?? false;
   }

   /**
    * Get the middleware the job should pass through.
    *
    * @return array<int, object>
    */
    public function middleware(): array
    {    
            
        // No middleware for self dispached job
        if ($this->selfJob) {
            return []; 
        }

        //middleware for seperate parrallel jobs
        return [
        (new WithoutOverlapping($this->network . '_manual'))
                ->dontRelease()                                 // Don't release the lock - not allowing same network job to run in parallel
                ->expireAfter(60)                               // if job is failed, Expire the lock after 60 seconds
        ];
    }

    /**  
    * Execute the job.
    */
   public function handle(): void
   {   

       $offers = Offer::select('id', 'network_image', 'image')
           ->where(function($query) {
               $query->whereNull('image')
                   ->orWhere('image', ''); 
           })
           ->whereNotNull('network_image')  
           ->where('network', $this->network)
           ->limit(15)
           ->get();

        if ($offers->count() == 0) {
            return;
        }

        // Process the current batch
        foreach ($offers as $offer) {
           $result = $this->processOfferImage($offer);
        }

       $remainingCount = Offer::where(function($query) {
               $query->whereNull('image')->orWhere('image', ''); 
           })
           ->whereNotNull('network_image')          
           ->where('network', $this->network)
           ->count();

        if ($remainingCount > 0) {
           static::dispatch($this->network, true);
        } 

    }
   
   private function processOfferImage($offer): bool
   {
       if (!$offer->network_image) {
           return false;
       }

       try {
           $response = Http::timeout(10)->get($offer->network_image);
           
           if ($response->successful()) {

               $imageContents = $response->body();
               $contentType = $response->header('Content-Type');
               
               $fileName = $this->generateFileName($contentType);
               
               Storage::disk('frontend')->put($fileName, $imageContents);
               $imageUrl = Storage::disk('frontend')->url($fileName);

               $offer->update(['image' => $imageUrl]);

               return true;

           } else {

                if ($response->status() == 403) {
                    $offer->update(['image' => 'FAILED']); 
                } else {
                    $offer->update(['image' => null]);
                }
                return false;
           }

       } catch (\Throwable $th) {

           $offer->update(['image' => null]);
           return false;
       }
   }

   private function generateFileName($contentType): string
   {
       // Extract extension from MIME type, default to jpg
       $extension = 'jpg';
       
       if (strpos($contentType, '/') !== false) {
           $mimeType = explode(';', $contentType)[0]; // Remove charset if present
           $extension = explode('/', $mimeType)[1] ?? 'jpg';
           
           // Convert jpeg to jpg for consistency
           if ($extension === 'jpeg') {
               $extension = 'jpg';
           }
       }

       return uniqid() . '.' . $extension;
   }
}
