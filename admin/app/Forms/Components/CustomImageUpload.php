<?php

namespace App\Forms\Components;

use Closure;
use Illuminate\Contracts\Support\Arrayable;

use Filament\Forms\Components\Field;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Livewire\WithFileUploads;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use Illuminate\Contracts\Filesystem\Filesystem;

class CustomImageUpload extends Field
{
    use WithFileUploads;

    protected string $view = 'forms.components.custom-image-upload';

    protected array | Arrayable | Closure | null $acceptedFileTypes = null;
	protected string | Closure | null $directory = null;
    protected string | Closure | null $diskName = null;
    protected string | Closure | null $fileName = null;
	protected int | Closure | null $maxSize = null;
    protected int | Closure | null $minSize = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->beforeStateDehydrated(function(CustomImageUpload $component, $state) {
            $file = $component->getState();

            if(is_string($file)) {
                $component->state($file);
                return;
            }

            if(is_null($file)) {
                $component->state(null);
                return;
            }
           
            if(is_array($file) && empty($file)) {
                $component->state(null);
                return;
            }
            if($file instanceof TemporaryUploadedFile) {

                $disk = $component->getDisk();
                $directory = $component->getDirectory();
                $fileName = $component->getFileName();

                $path = $file->storeAs($directory, $fileName . '.' . $file->getClientOriginalExtension(), $disk);
                $component->state($path);
            }
    
            // $path = $file->storeAs('blocks', $file->getClientOriginalName() . '.' . $file->getClientOriginalExtension(), 'public');
            // $component->state($path);
        });

        //new
        $this->afterStateUpdated(function(CustomImageUpload $component, $state) {
            // If a temporary file exists, keep it in the component's state
            if ($state instanceof TemporaryUploadedFile) {
                $component->state($state);
            }
        });
        //new
    }

    public function temporaryFileToBase64($temporaryFile)
    {   
        if (!$temporaryFile) {
            return '';
        }

        // Read the file content into a binary string
        $fileData = file_get_contents($temporaryFile->getPathname());
        
        // Encode the file data into Base64
        $base64EncodedFile = base64_encode($fileData);
        
        // Get the MIME type of the file
        $mimeType = $temporaryFile->getMimeType();
        
        // Create the Base64 data URI scheme
        $base64File = 'data:' . $mimeType . ';base64,' . $base64EncodedFile;
        
        return $base64File;
    }

    public function getPreviewUrl(): ?string
    {   
        $state = $this->getState();
        
        if(is_null($state)) {
            return '';
        }

        if(is_string($state)) {
            return Storage::url($state);
        }
        
        if(is_string($this->getState())) {
            return Storage::url($getState());
        }

        if($state instanceof TemporaryUploadedFile) {
            return $this->temporaryFileToBase64($state);
        }

        return '';
    }

    public function directory(string | Closure | null $directory): static
    {
        $this->directory = $directory;

        return $this;
    }
	
    public function disk(string | Closure | null $name): static
    {
        $this->diskName = $name;

        return $this;
    }
	
    public function fileName(string | Closure | null $name): static
    {
        $this->fileName = $name;

        return $this;
    }
	
    public function acceptedFileTypes(array | Arrayable | Closure $types): static
    {
        $this->acceptedFileTypes = $types;

        $this->rule(static function (CustomImageUpload $component) {
            $types = implode(',', ($component->getAcceptedFileTypes() ?? []));

            return "mimetypes:{$types}";
        });

        return $this;
    }

    public function maxSize(int | Closure | null $size): static
    {
        $this->maxSize = $size;

        $this->rule(static function (CustomImageUpload $component): string {
            $size = $component->getMaxSize();

            return "max:{$size}";
        });

        return $this;
    }

    public function minSize(int | Closure | null $size): static
    {
        $this->minSize = $size;

        $this->rule(static function (CustomImageUpload $component): string {
            $size = $component->getMinSize();

            return "min:{$size}";
        });

        return $this;
    }
	
	public function getAcceptedFileTypes(): ?array
    {
        $types = $this->evaluate($this->acceptedFileTypes);

        if ($types instanceof Arrayable) {
            $types = $types->toArray();
        }

        return $types;
    }

    public function getDirectory(): ?string
    {
        return $this->evaluate($this->directory) ?? '';
    }

    public function getFileName(): ?string
    {
        return $this->evaluate($this->fileName) ?? Str::uuid();
    }
    public function getDisk(): ?string
    {
        return $this->evaluate($this->diskName) ?? 'public';
    }

    public function getMaxSize(): ?int
    {
        return $this->evaluate($this->maxSize);
    }

    public function getMinSize(): ?int
    {
        return $this->evaluate($this->minSize);
    }

    public function getValidationRules(): array
    {
        $rules = [
            $this->getRequiredValidationRule(),
            // 'array',
        ];

        $rules[] = function (string $attribute, array|string $value, Closure $fail): void {
            if(is_string($value)) return;
            
            // Handle the case when it's an empty array - treat as null
            if(is_array($value) && empty($value)) return;

            if(!($value instanceof TemporaryUploadedFile)) return;

            $file = $value;

            $name = $this->getName();

            $validator = Validator::make(
                [$name => $file],
                ["{$name}" => ['file', ...parent::getValidationRules()]],
                [],
                ["{$name}" => $this->getValidationAttribute()],
            );

            if (! $validator->fails()) {
                return;
            }

            $fail($validator->errors()->first());
        };

        return $rules;
    }

    
}
