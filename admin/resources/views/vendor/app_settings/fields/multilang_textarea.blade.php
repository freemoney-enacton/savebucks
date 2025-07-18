{{-- @component('app_settings::input_group', compact('field'))
    @php
        $languages = config('freemoney.languages.keys');
    @endphp
    <div
        class="flex items-center p-2 px-2 bg-white shadow-sm fi-tabs gap-x-1 rounded-xl ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 w-max">
        @foreach ($languages as $lang)
            <button type="button"
                class="lang-switch-btn lang-text  max-h-10 fi-tabs-item group flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 {{ $loop->first ? 'btn-primary active fi-active text-primary-600 fi-tabs-item-active bg-gray-50 dark:bg-white/5 label-translation-tab' : '' }}"
                data-field-target="{{ $field['name'] }}" data-lang="{{ $lang }}">{{ $lang }}</button>
        @endforeach
    </div>
    @foreach ($languages as $lang)
        <textarea style="display: {{ $loop->first ? 'block' : 'none' }}" name="{{ $field['name'] }}[{{ $lang }}]"
            class="{{ Arr::get($field, 'class', config('app_settings.input_class', 'form-control')) }}  multilang">{{ \setting($field['name'], $field['name'])[$lang] ?? '' }}</textarea>
    @endforeach
@endcomponent --}}

@component('app_settings::input_group', compact('field'))
    @php
        $languages = config('freemoney.languages.keys');
        // Add a unique class for easier targeting
        $fieldClass = 'multilang-field-' . $field['name'];
    @endphp
    <div
        class="flex items-center p-2 px-2 bg-white shadow-sm fi-tabs gap-x-1 rounded-xl ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 w-max">
        @foreach ($languages as $lang)
            <button type="button"
                class="lang-switch-btn lang-text max-h-10 fi-tabs-item group flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 {{ $loop->first ? 'btn-primary active fi-active text-primary-600 fi-tabs-item-active bg-gray-50 dark:bg-white/5 label-translation-tab' : '' }}"
                data-field-target="{{ $field['name'] }}" data-lang="{{ $lang }}">{{ $lang }}</button>
        @endforeach
    </div>
    <div class="{{ $fieldClass }}">
        @foreach ($languages as $lang)
            <textarea style="display: {{ $loop->first ? 'block' : 'none' }}" 
                name="{{ $field['name'] }}[{{ $lang }}]"
                data-field-name="{{ $field['name'] }}"
                data-lang="{{ $lang }}"
                class="{{ Arr::get($field, 'class', config('app_settings.input_class', 'form-control')) }} multilang">{{ trim(\setting($field['name'], $field['name'])[$lang] ?? '') }}</textarea>
        @endforeach
    </div>
@endcomponent


<script>
    document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for language switching
    document.querySelectorAll('.lang-switch-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            const fieldName = this.getAttribute('data-field-target');
            const lang = this.getAttribute('data-lang');
            
            // Make all buttons inactive
            document.querySelectorAll(`.lang-switch-btn[data-field-target="${fieldName}"]`).forEach(btn => {
                btn.classList.remove('active', 'fi-active', 'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50', 'dark:bg-white/5');
            });
            
            // Make this button active
            this.classList.add('active', 'fi-active', 'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50', 'dark:bg-white/5');
            
            // Hide all textareas for this field
            const fieldContainer = document.querySelector(`.multilang-field-${fieldName}`);
            if (fieldContainer) {
                fieldContainer.querySelectorAll('textarea').forEach(textarea => {
                    textarea.style.display = 'none';
                });
                
                // Show only the textarea for the selected language
                const targetTextarea = fieldContainer.querySelector(`textarea[data-lang="${lang}"]`);
                if (targetTextarea) {
                    targetTextarea.style.display = 'block';
                }
            }
        });
    });
});
</script>
