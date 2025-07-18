<?php

namespace App\Jobs;

use App\Mail\UserOfferSalesMail;
use App\Models\FrontUser;
use App\Models\UserOfferSale;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendUserOfferSalesEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public $userId;
    public function __construct($user)
    {
        $this->userId = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
       
        $user = FrontUser::where('id', $this->userId)->first();
        $yesterdayStart = date('Y-m-d 00:00:00', strtotime('-1 day'));
        $yesterdayEnd = date('Y-m-d 23:59:59', strtotime('-1 day'));
       
        $userOfferSales = UserOfferSale::where('user_id', $this->userId)
            ->where('mail_sent', 0)
            ->whereBetween('updated_at', [$yesterdayStart, $yesterdayEnd])
            // ->where('status', 'confirmed')
            ->with('offer')
            ->get();
        
        \Mail::to($user->email)->send(new UserOfferSalesMail($userOfferSales, $user));
    }
}
