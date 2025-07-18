<?php

namespace App\Console\Commands;

use App\Jobs\SendUserOfferSalesEmail;
use App\Models\UserOfferSale;
use Illuminate\Console\Command;
use App\Mail\UserOfferSalesMail;

class CheckYesterdayUserOfferSales extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'CheckUserOfferSales:sendUserSummaryEmail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check yesterday\'s user offer sales and send emails';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = UserOfferSale::whereBetween('updated_at', [date('Y-m-d 00:00:00', strtotime('-1 day')), date('Y-m-d 23:59:59', strtotime('-1 day'))])
        // ->where('status', 'confirmed')
        ->select('user_id')->distinct()->get();
        

        foreach ($users as $user) {
            dispatch(new SendUserOfferSalesEmail($user->user_id));
        }

        $this->info('User offer sales for yesterday have been checked and emails dispatched.');
    }
}
