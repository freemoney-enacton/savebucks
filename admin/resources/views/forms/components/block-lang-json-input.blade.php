{{-- <x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div x-data="{ state: $wire.$entangle('{{ $getStatePath() }}') }">
        <!-- Interact with the `state` property in Alpine.js -->
    </div>
</x-dynamic-component> --}}
<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">

    <div x-data="{
        state: $wire.$entangle('{{ $getStatePath() }}'),
        activeLang: '{{ $getActiveLang() }}',
        langOptions: {{ json_encode($getLangOptions()) }},
        data: {{ $this->data[$field->getName()] }},
    }">
        <div class="flex flex-wrap gap-2">
            <template x-for="( value, index) in langOptions">
                <span @click="activeLang = index" x-text="index" :key="index"
                    :style="index === activeLang ? 'background-color: #da790b' : ''" class="cursor-pointer p-2"></span>
            </template>

            <input type="text" x-model.live="data[activeLang]" x-on:change="state = data"
                class="fi-input block w-full border-1 py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500 disabled:[-webkit-text-fill-color:theme(colors.gray.500)] disabled:placeholder:[-webkit-text-fill-color:theme(colors.gray.400)] dark:text-white dark:placeholder:text-gray-500 dark:disabled:text-gray-400 dark:disabled:[-webkit-text-fill-color:theme(colors.gray.400)] dark:disabled:placeholder:[-webkit-text-fill-color:theme(colors.gray.500)] sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3">
        </div>
    </div>
</x-dynamic-component>
