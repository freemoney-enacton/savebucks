<x-filament-panels::page class="custom-trans">
    <div class="page-content row">
        {{-- <div class="w-full"> --}}
        <div class="copy-to-wrapper">

            <form class="form-inline">
                <input type="hidden" name="_token" value="{{ csrf_token() }}" autocomplete="off">
                <input type="hidden" name="id" id="id" value="">

                <div class="grid grid-cols-2 grid-flow-col gap-2 grid-rows-1 py-3">
                    <div class="col">
                        <div class="lang-select flex items-center gap-2.5">
                            <label for="source_lang" class="form-label block">{{ __('Source') }} </label>
                            <select name="source_lang"
                                class="block rounded-lg p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-amber-500/50 border border-gray-400 focus:border-amber-500 placeholder:text-gray-500 placeholder:text-base sm:text-sm sm:leading-6 pl-3 w-[120px]"
                                id="source_lang" required="" wire:model="source_lang">
                                @foreach ($this->langs as $state => $value)
                                    <option value="{{ $state }}">{{ $value }}</option>
                                @endforeach

                            </select>
                        </div>
                    </div>
                    <div class="col">
                        <div class="lang-select  flex items-center gap-2.5">
                            <label for="dest_lang" class="form-label block">{{ __('Destination') }} </label>
                            <select
                                name="dest_lang"class="block rounded-lg p-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-amber-500/50 border border-gray-400 focus:border-amber-500 placeholder:text-gray-500 placeholder:text-base sm:text-sm sm:leading-6 pl-3 w-[120px]"
                                id="dest_lang" required="" wire:model="dest_lang">
                                @foreach ($this->langs as $state => $value)
                                    <option value="{{ $state }}">{{ $value }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    {{-- <button type="submit" class="rounded-full bg-amber-500 px-4 py-3 fi-ac-action fi-ac-btn-action"
                            wire:click="copyTo">
                            Copy
                        </button> --}}

                    <button style="--c-400:var(--primary-400);--c-500:var(--primary-500);--c-600:var(--primary-600);"
                        class="fi-btn relative grid-flow-col items-center justify-center font-semibold outline-none transition duration-75 focus-visible:ring-2 rounded-lg fi-color-custom fi-btn-color-primary fi-color-primary fi-size-md fi-btn-size-md gap-1.5 px-3 py-2 text-sm inline-grid shadow-sm bg-custom-600 text-white hover:bg-custom-500 focus-visible:ring-custom-500/50 dark:bg-custom-500 dark:hover:bg-custom-400 dark:focus-visible:ring-custom-400/50 fi-ac-action fi-ac-btn-action"
                        type="submit" wire:loading.attr="disabled"wire:click="copyTo">
                        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                            class="animate-spin fi-btn-icon transition duration-75 h-5 w-5 text-white"
                            wire:loading.delay.default="" wire:target="mountAction('copyTo')">
                            <path clip-rule="evenodd"
                                d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                fill-rule="evenodd" fill="currentColor" opacity="0.2"></path>
                            <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor">
                            </path>
                        </svg>
                        <span class="fi-btn-label">
                            Copy
                        </span>

                    </button>

                    <button style="--c-400:var(--primary-400);--c-500:var(--primary-500);--c-600:var(--primary-600);"
                        class="fi-btn relative grid-flow-col items-center justify-center font-semibold outline-none transition duration-75 focus-visible:ring-2 rounded-lg fi-color-custom fi-btn-color-primary fi-color-primary fi-size-md fi-btn-size-md gap-1.5 px-3 py-2 text-sm inline-grid shadow-sm bg-custom-600 text-white hover:bg-custom-500 focus-visible:ring-custom-500/50 dark:bg-custom-500 dark:hover:bg-custom-400 dark:focus-visible:ring-custom-400/50 fi-ac-action fi-ac-btn-action"
                        type="submit" wire:loading.attr="disabled" wire:click="translateTo">
                        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                            class="animate-spin fi-btn-icon transition duration-75 h-5 w-5 text-white"
                            wire:loading.delay.default="" wire:target="mountAction('translateTo')">
                            <path clip-rule="evenodd"
                                d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                fill-rule="evenodd" fill="currentColor" opacity="0.2"></path>
                            <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor">
                            </path>
                        </svg>
                        <span class="fi-btn-label">
                            Translate
                        </span>

                    </button>
                    {{-- <button type="submit"
                            class="rounded-full bg-amber-500 px-4 py-3 fi-ac-action fi-ac-btn-action "
                            wire:click="translateTo">
                            Translate
                        </button> --}}
                </div>


            </form>

        </div>
        {{-- </div> --}}
        @php
            $tabs = array_keys($this->translationTabs());
        @endphp
        <section
            class=" fi-tabs flex max-w-full gap-x-1 overflow-x-auto mx-auto rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 w-max">
            @foreach ($tabs as $tab)
                <button wire:click="changeTab('{{ $tab }}')"
                    class="fi-tabs-item group flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 fi-active fi-tabs-item-active bg-gray-50 dark:bg-white/5 {{ $tab == $this->activeTab ? 'fi-active active text-primary-600' : 'bg-white' }}">{{ str_replace('_', ' ', Str::ucfirst($tab)) }}</button>
            @endforeach

        </section>

        <div class="py-4">
            <x-filament-panels::form wire:submit="save">
                {{ $this->form }}
                <x-filament-panels::form.actions :actions="$this->getFormActions()" />
            </x-filament-panels::form>
        </div>

    </div>


</x-filament-panels::page>
