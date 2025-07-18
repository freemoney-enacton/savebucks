<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;
// use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Page extends Model
{
    use HasTranslations;

    protected static function booted()
    {       

        static::saving(function ($record) {  
            
            $blocks = $record->getTranslations('blocks');
           
            foreach ($blocks as $key => $value) {                 
                $record->setTranslation('blocks', $key, static::mutateBlocksValue(array_values($value)));
            }
          
        });
       
    }

    protected static function mutateBlocksValue(array $data)
    {  
        foreach ($data as $k => $value) {
            foreach ($value as $key => $value2) {

                if (isset($value2['items'])) {
                    $data[$k][$key]['items'] = array_values($value2['items']);
                }

                if (isset($value2['myitems'])) {
                    $data[$k][$key]['myitems'] = array_values($value2['myitems']);
                }
            }
        }

        return $data;
    }


    protected $translatable = [
        'title', 'content', 'name', 'blocks', 'meta_title','meta_desc'
    ];
    protected $guarded = ['id'];

    protected $casts = [
        'exclude_seo' => 'boolean',
        'blocks' => 'json',
        'title' => 'json',
        'content' => 'json',
        'name' => 'json',
        'status' => ContentStatus::class,        
    ];

    public function parent()
    {

        return $this->belongsTo(Page::class, 'parent_id');
    }

    public function allChildren()
    {

        return $this->hasMany(Page::class, 'parent_id');
    }

    // public function getBlocksAttribute($value)
    // {
    //     dd($value);
    // }

}
