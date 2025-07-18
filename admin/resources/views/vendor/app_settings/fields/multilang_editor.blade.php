@component('app_settings::input_group', compact('field'))
    <div
        class="fi-tabs flex gap-x-1 items-center rounded-xl p-2 bg-white px-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 w-max">
        @php

            $languages = config('freemoney.languages.keys');
        @endphp
        @foreach ($languages as $lang)
            <button type="button"
                class="lang-switch-btn lang-editor max-h-10 fi-tabs-item group flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 {{ $loop->first ? 'btn-primary active fi-active text-primary-600 fi-tabs-item-active bg-gray-50 dark:bg-white/5 label-translation-tab' : '' }}"
                data-field-target="{{ $field['name'] }}" data-lang="{{ $lang }}">{{ $lang }}</button>
        @endforeach
    </div>
    @foreach ($languages as $lang)
        <textarea style="display: {{ $loop->first ? 'block' : 'none' }}" name="{{ $field['name'] }}[{{ $lang }}]"
            class="form-control multilang editor">{{ \setting($field['name'], $field['name'])[$lang] ?? '' }}</textarea>
    @endforeach
@endcomponent
