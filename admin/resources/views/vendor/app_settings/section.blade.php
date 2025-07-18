<div
    class="fi-section rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 {{ Arr::get($fields, 'section_class', config('app_settings.section_class', 'card ')) }} section-{{ Str::slug($fields['title']) }}">
    <div
        class="fi-section-header flex flex-col gap-3 px-6 py-4 {{ Arr::get($fields, 'section_heading_class', config('app_settings.section_heading_class', 'card-header')) }}">
        {{-- <i class="{{ Arr::get($fields, 'icon', 'glyphicon glyphicon-flash') }}"></i> --}}
        <h3 class="fi-section-header-heading text-base font-semibold leading-6 text-gray-950 dark:text-white">
            {{ $fields['title'] }} </h3>
    </div>

    <div class="fi-section-content-ctn border-t border-gray-200 dark:border-white/10 p-6">
        {{-- @if ($desc = Arr::get($fields, 'descriptions'))
            <div
                class="pb-0 {{ config('app_settings.section_body_class', Arr::get($fields, 'section_body_class', 'card-body')) }}">
                <p class="text-muted mb-0 ">{{ $desc }}</p>
            </div>
        @endif --}}

        {{ $slot }}
    </div>
</div>
<!-- end card for {{ $fields['title'] }} -->
