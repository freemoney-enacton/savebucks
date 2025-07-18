<?php

namespace App\Http\Controllers;

use App\Models\AffiliateNetwork;
use App\Models\Network;
use DateTime;
use EnactOn\ProCashBee\JobEvents\Jobs\SendContactRequestToNeeto;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class GeneralController extends Controller
{

    public static function contactSubmit(Request $request)
    {
        
        dispatch(new SendContactRequestToNeeto($request->all()));
        return response()->json(['success' => true]);
    }

    public  function daisyconAuth(Request $request)
    {
            try{
            $url = 'https://login.daisycon.com/oauth/access-token';
            $network = AffiliateNetwork::where('namespace','DaisyCon')->where('enabled',1)->first();
            
            if(!$network){
                return response()->json(['success' => true]); 
            }
            $auth_tokens = ($network->auth_tokens);
            

           $data= [
                'grant_type'    => 'authorization_code',
                'redirect_uri'  => config('app.url').'/daisycon-auth',
                'code'          => $request->code,
                'client_id'     => $auth_tokens['client_id'] ,
                'client_secret' => $auth_tokens['client_secret'],
		        'code_verifier' => $auth_tokens['code_verifier'],
           ];
        
        
            $curl = curl_init($url);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($curl);
            curl_close($curl);
            
            $responseData = json_decode($response,true); 
            $auth_tokens['access_token'] = $responseData['access_token'];
            $auth_tokens['refresh_token'] = $responseData['refresh_token'];
            $auth_tokens['expires_in'] = (new DateTime())->modify('+'.$responseData['expires_in'].' seconds')->format('Y-m-d H:i:s');
            $auth_tokens['refresh_token_expires_in'] = (new DateTime())->modify('+30 days')->format('Y-m-d H:i:s');
           

            $network->auth_tokens = ($auth_tokens);
            $network->save();
            return response()->json(['success' => true]);
        }
        catch(\exeception $e){
            \Log::Info($e);
            return response()->json(['error' => $e->message]);

        }
    }

    public  function daisyconGenerateToken(Request $request)
    {
       
        $codeVerifier = $this->randomString(random_int(43, 128));
        $codeChallenge = $this->hash($codeVerifier);
        $clientId = '2241b1c2-a8c8-4151-a0fe-17d2870c3fd4'; // Replace with your actual client ID
        $redirectUri = config('app.url').'/daisycon-auth'; // Replace with your actual redirect URI
        $network = AffiliateNetwork::where('namespace','DaisyCon')->where('enabled',1)->first();
        $auth_tokens = $network->auth_tokens;
       
        $auth_tokens['code_verifier'] = $codeVerifier;
        
        $network->auth_tokens = $auth_tokens;
        $network->save();
        
        $authorizationUrl = "https://login.daisycon.com/oauth/authorize?response_type=code&client_id={$clientId}&redirect_uri={$redirectUri}&code_challenge={$codeChallenge}";

        return redirect($authorizationUrl);
    }


    public function randomString(int $length): string
    {
        if ($length < 1) {
            throw new InvalidArgumentException('Length must be a positive integer');
        }
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~';
        $length = strlen($chars) - 1;
        $out = '';
        for ($i  = 0; $i < $length; ++$i) {
            $out .= $chars[random_int(0, $length)];
        }
        return $out;
    }

    public function hash(string $code): string
    {
        return str_replace(
            '=',
            '',
            strtr(
                base64_encode(
                    hash('sha256', $code, true)
                ),
                '+/',
                '-_'
            )
        );
    }
}
