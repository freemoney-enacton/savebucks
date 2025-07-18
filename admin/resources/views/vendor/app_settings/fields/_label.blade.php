@if ($label = Arr::get($field, 'label'))
    <label for="{{ Arr::get($field, 'name') }}"
        class="fi-fo-field-wrp-label inline-flex items-center gap-x-3 text-sm font-medium leading-6 text-gray-950 dark:text-white">{{ $label }}</label>
@endif
