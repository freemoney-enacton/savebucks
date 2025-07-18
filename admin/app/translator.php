<?php

namespace App;

use Stichoza\GoogleTranslate\GoogleTranslate as GooglePublicTranslate;
use Google\Cloud\Translate\V2\TranslateClient as GoogleApiTranslate;

class Translator
{


    public  static function translate($string, $dest_lang, $source_lan)
    {

        if (strlen($source_lan) > 2) $source_lan = substr($source_lan, 0, 2);
        if (strlen($dest_lang) > 2) $dest_lang = substr($dest_lang, 0, 2);


        if (strlen(config('pcb.services.google_translate_apikey', null)) > 5) {
            $translate = new GoogleApiTranslate([
                'key' => config('pcb.services.google_translate_apikey')
            ]);


            $result = $translate->translate($string, ['target' =>  $dest_lang, 'source' => $source_lan]);

            return isset($result['text']) ? html_entity_decode($result['text'], ENT_QUOTES | ENT_HTML5, 'utf-8') : null;
        } else {

            return html_entity_decode(GooglePublicTranslate::trans($string, $dest_lang, $source_lan), ENT_QUOTES | ENT_HTML5, 'utf-8');
        }
    }
}
