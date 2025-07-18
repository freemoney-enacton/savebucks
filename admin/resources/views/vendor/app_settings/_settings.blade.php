    <div class="row">
        <div class="col-md-7 col-md-offset-2">

            @includeIf(config('app_settings.flash_partial'))

            <form method="post" action="{{ route('settings.store') }}"
                class="form-horizontal mb-4 m-8 gap-0 fi-form grid gap-y-6" enctype="multipart/form-data" role="form">
                {!! csrf_field() !!}

                @if (isset($settingsUI) && count($settingsUI))

                    @foreach (Arr::get($settingsUI, 'sections', []) as $section => $fields)
                        @component('app_settings::section', compact('fields'))
                            <div
                                class="{{ Arr::get($fields, 'section_body_class', config('app_settings.section_body_class', 'card-body')) }}">
                                @foreach (Arr::get($fields, 'inputs', []) as $field)
                                    @if (!view()->exists('app_settings::fields.' . $field['type']))
                                        <div
                                            style="background-color: #f7ecb5; box-shadow: inset 2px 2px 7px #e0c492; border-radius: 0.3rem; padding: 1rem; margin-bottom: 1rem">
                                            Defined setting <strong>{{ $field['name'] }}</strong> with
                                            type <code>{{ $field['type'] }}</code> field is not supported. <br>
                                            You can create a <code>fields/{{ $field['type'] }}.balde.php</code> to render
                                            this input however you want.
                                        </div>
                                    @endif
                                    @includeIf('app_settings::fields.' . $field['type'])
                                @endforeach
                            </div>
                        @endcomponent
                    @endforeach
                @endif

                <div class="row m-b-md">
                    <div class="col-md-12">
                        <button
                            style="--c-400:var(--primary-400);--c-500:var(--primary-500);--c-600:var(--primary-600);"
                            class="fi-btn relative grid-flow-col items-center justify-center font-semibold outline-none transition duration-75 focus-visible:ring-2 rounded-lg fi-color-custom fi-btn-color-primary fi-color-primary fi-size-md fi-btn-size-md gap-1.5 px-3 py-2 text-sm inline-grid shadow-sm bg-custom-600 text-white hover:bg-custom-500 focus-visible:ring-custom-500/50 dark:bg-custom-500 dark:hover:bg-custom-400 dark:focus-visible:ring-custom-400/50 fi-ac-action fi-ac-btn-action"
                            class="fi-tabs-item group flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 btn">
                            {{ Arr::get($settingsUI, 'submit_btn_text', 'Save Settings') }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
