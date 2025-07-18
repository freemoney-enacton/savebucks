<?php

namespace App\Http\Controllers;

use App\Jobs\downloadImageJob;
use App\Models\Offer;
use EnactOn\ProCashBee\JobEvents\Jobs\ConfirmUserTask;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class ManageTaskImageController extends Controller
{

    public static function downloadTaskImage($network)
    {
        downloadImageJob::dispatch($network, false)->delay(now()->addSeconds(5));        
        return response()->json(['success' => true]);
    }

    public static function updateUserTask(Request $request)
    {
        dispatch(new ConfirmUserTask($request->network, $request->task_offer_id,$request->user_id,$request->status));
        return response()->json(['success' => true]);
    }

    public static function contactSubmit(Request $request)
    {
        return response()->json(['success' => true]);
    }
}
