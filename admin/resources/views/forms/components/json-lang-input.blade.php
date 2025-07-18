<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">

    <div x-data="{
        state: $wire.$entangle('{{ $getStatePath() }}'),
        activeLang: '{{ $getActiveLang() }}',
        langOptions: {{ json_encode($getLangOptions()) }},
        data: {{ $this->data[$field->getName()] ?? '{}' }},
    }">
        <div class="flex flex-wrap gap-2">
            <div
                class="fi-tabs flex gap-x-1  rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 w-max">
                <template x-for="( value, index) in langOptions">
                    <span @click="activeLang = index" x-text="index" :key="index"
                        :style="index === activeLang ? 'background-color: #da790b' : ''"
                        class="fi-tabs-item group flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"></span>
                </template>
            </div>

            <input type="text" x-model.live="data[activeLang]" x-on:change="state = data"
                class="fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none">
        </div>
    </div>
</x-dynamic-component>


@push('scripts')
    <script></script>
@endpush
