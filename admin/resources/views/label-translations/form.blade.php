<form method="post" action="{{ route('label_translations.store') }}"
    class="grid grid-cols-2 gap-8 rounded-xl border border-gray-200 bg-white p-4 dark:bg-gray-900 dark:border-white/10">
    @csrf
    {{-- @method('POST') --}}

    @foreach ($translations as $translation)
        <div class="input-container flex flex-col gap-y-2" id="{{ $translation['id'] }}">
            <label for="{{ $translation['id'] }}" class="text-sm font-medium leading-6 text-gray-950 dark:text-white" >
                {{ str_replace('_', ' ', Str::ucfirst($translation['trans_key'])) }}</label>
            <div
                class="fi-tabs flex w-max gap-x-1 rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">

                @foreach ($languages as $lang)
                    <button type="button"
                        class="lang-switch-btn lang-text fi-tabs-item {{ $loop->first ? 'btn-primary active fi-active text-primary-600 fi-tabs-item-active bg-gray-50 dark:bg-white/5  label-translation-tab' : '' }} group flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
                        data-field-target="{{ $translation['id'] }}[{{ $lang }}]"
                        data-lang="{{ $lang }}">{{ $lang }}</button>
                @endforeach
            </div>
            @php
                $translation_value = json_decode($translation['trans_value'], true);
            @endphp
            @foreach ($languages as $lang)
                <input
                    class="fi-input-wrp [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input multilang flex w-full overflow-hidden rounded-lg border-none bg-white bg-white/0 pe-3 ps-3 shadow-sm outline-none ring-1 ring-gray-950/10 transition duration-75 placeholder:text-gray-400 dark:bg-white/5 dark:ring-white/20 sm:text-sm sm:leading-6 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2"
                    type="text" style="display: {{ $loop->first ? 'block' : 'none' }}"
                    name="{{ $translation['id'] }}[{{ $lang }}]"
                    value="{{ array_key_exists($lang, $translation_value) ? $translation_value[$lang] : '' }}">
            @endforeach
        </div>
    @endforeach

    <button type="submit" class="btn btn-primary">Save</button>
</form>
