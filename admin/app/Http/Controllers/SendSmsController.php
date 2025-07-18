<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class SendSmsController extends Controller
{
    public function sendSms($mobileNumber, $otp)
    {
        $mobileNumber = $mobileNumber;
        $otp = $otp;
        
        $apikey = config('services.msg91.apikey');
        $otp_template_id = config('services.msg91.otp_template_id');

        $api_url = "https://api.msg91.com/api/v5/otp?authkey=".$apikey."&template_id=".$otp_template_id."&extra_param=&mobile=#PHNUM&invisible=0&otp=#OTP";

        $api_url = str_replace('#PHNUM', $mobileNumber, $api_url);
        $api_url = str_replace('#OTP', $otp, $api_url);
        $client = new Client();
        $response = $client->post($api_url);

        $statusCode = $response->getStatusCode();
        $responseBody = $response->getBody()->getContents();


        return response()->json([
            'status' => $statusCode,
            'response' => $responseBody,
        ]);
    }
}
