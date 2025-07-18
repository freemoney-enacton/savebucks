<?php

namespace App\Jobs;

use App\Models\Translation;
use App\Translator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class translateTo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $sourceLang;
    protected $destLang;
    /**
     * Create a new job instance.
     */
    public function __construct($sourceLang, $destLang)
    {
        $this->sourceLang = $sourceLang;
        $this->destLang = $destLang;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        foreach (Translation::all() as $trRow) {
            $trans_value = json_decode($trRow->trans_value, true);
            $srcLangVal = $trans_value[$this->sourceLang] ?? null;
            if (!strlen($trans_value[$this->destLang] ?? null))
                $trans_value[$this->destLang] = Translator::translate($srcLangVal, $this->destLang, $this->sourceLang);
            $trRow->trans_value = json_encode($trans_value);
            $trRow->save();
        }
    }
}
