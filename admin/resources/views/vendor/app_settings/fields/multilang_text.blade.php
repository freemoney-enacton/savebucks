@component('app_settings::input_group', compact('field'))
    <div
        class="flex items-center p-2 px-2 bg-white shadow-sm fi-tabs gap-x-1 rounded-xl ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 w-max">
        @php

            $languages = config('freemoney.languages.keys');
        @endphp
        @foreach ($languages as $lang)
                    <button type="button"
                        class="lang-switch-btn lang-text  max-h-10 fi-tabs-item group flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 {{ $loop->first ? 'btn-primary active fi-active text-primary-600 fi-tabs-item-active bg-gray-50 dark:bg-white/5 label-translation-tab' : '' }}"
                        data-field-target="{{ $field['name'] }}" data-lang="{{ $lang }}">{{ $lang }}
                    </button>
        @endforeach
    </div>
    @foreach ($languages as $lang)
        {{-- @dd($field) --}}
        <input type="text" style="display: {{ $loop->first ? 'block' : 'none' }}"
            name="{{ $field['name'] }}[{{ $lang }}]"
            value="{{ \setting($field['name'], $field['name'])[$lang] ?? '' }}"
            class="{{ Arr::get($field, 'class', config('app_settings.input_class', 'form-control')) }}  multilang">
    @endforeach
@endcomponent
