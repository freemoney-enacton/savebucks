<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div x-data="{
        state: $wire.$entangle('{{ $getStatePath() }}'),
        uploading: false,
        progress: 0,
        preview: '{{is_string($getState()) ? \Illuminate\Support\Facades\Storage::url($getState()) : ''}}',
        imageToBase64(imageFile) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(imageFile);
            });
        },
        async handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.uploading = true;
                this.progress = 0;
                this.preview = await this.imageToBase64(file);
                
                // Monitor upload progress
                $wire.upload('{{ $getStatePath() }}', file, 
                    (progress) => {
                        // Upload progress
                        this.progress = progress;
                    },
                    () => {
                        // Upload finished
                        setTimeout(() => {
                            this.uploading = false;
                            this.progress = 0;
                        }, 1000);
                    }, 
                    () => {
                        // Upload error
                        this.uploading = false;
                        this.progress = 0;
                    }
                );
            }
        }
    }"
    wire:key="{{ $getStatePath() }}-container"
    class="relative inline-block"
    >
        <input 
            x-ref="fileInput"
            type="file" 
            x-on:change="handleImageUpload($event)" 
            accept="{{$getAcceptedFileTypes() ? join(',',$getAcceptedFileTypes()) : ''}}"
            x-bind:disabled="uploading"
            style="display: {{ $isDisabled() ? 'none' : 'block' }};"
            class="mb-2"
        >

        <div class="relative inline-block" wire:ignore>
            <img 
                 x-bind:src="preview" 
                 class="preview"
                 x-bind:class="{'opacity-50': uploading}"
            >
            
            <!-- Loader Ring -->
            <div 
                x-show="uploading" 
                class="absolute inset-0 flex items-center justify-center"
            >
                <div class="image-upload-loader"></div>
            </div>
            
            <!-- Progress Percentage -->
            <div 
                x-show="uploading" 
                class="absolute top-0 right-0 px-2 py-1 mt-1 mr-1 text-xs text-white bg-blue-500 rounded-full"
            >
                <span x-text="Math.round(progress) + '%'"></span>
            </div>
        </div>

         <!-- Hide the actual Livewire file input -->
         <div style="display: none;">
            <input wire:model="{{ $getStatePath() }}" type="file">
         </div>
    
        <style>
            .preview {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                object-fit: cover;
                transition: opacity 0.3s ease;
                position: relative;
                z-index: 1;
            }
            
            .image-upload-loader {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(0, 0, 0, 0.1);
                border-top: 3px solid #3498db;
                border-radius: 50%;
                animation: image-upload-spin 1s linear infinite;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2;
            }
            
            @keyframes image-upload-spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        </style>
    </div>
</x-dynamic-component>