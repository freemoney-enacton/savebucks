<x-filament-panels::page class="custom-trans">
    <style>
        .action-btn::after {
            content: '';
            display: block;
            width: 1.2em;
            height: 1.2em;
            position: absolute;
            left: calc(50% - 0.75em);
            top: calc(50% - 0.75em);
            border: 0.15em solid transparent;
            border-right-color: white;
            border-radius: 50%;
            animation: button-anim 0.7s linear infinite;
            opacity: 0;
        }

        @keyframes button-anim {
            from {
                transform: rotate(0);
            }

            to {
                transform: rotate(360deg);
            }
        }

        .action-btn.loading {
            color: transparent;
        }

        .action-btn.loading::after {
            opacity: 1;
        }

        /* em values are used to adjust button values such as padding, radius etc. based on font-size */
    </style>
    <div class="page-content row">
        {{-- <div class="w-full"> --}}
        <div class="copy-to-wrapper">

            <form class="form-inline">
                <input type="hidden" name="_token" value="{{ csrf_token() }}" autocomplete="off">
                <input type="hidden" name="id" id="id" value="">
                <div class="grid grid-flow-col grid-cols-2 grid-rows-1 gap-2 py-3">
                    <div class="clear">
                        <button
                            style="--c-400:var(--primary-400);--c-500:var(--primary-500);--c-600:var(--primary-600);"
                            class="action-btn clear-btn fi-btn fi-color-custom fi-btn-color-primary fi-color-primary fi-size-md fi-btn-size-md bg-custom-600 hover:bg-custom-500 focus-visible:ring-custom-500/50 dark:bg-custom-500 dark:hover:bg-custom-400 dark:focus-visible:ring-custom-400/50 fi-ac-action fi-ac-btn-action relative inline-grid grid-flow-col items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm outline-none transition duration-75 focus-visible:ring-2"id="clear-btn">Clear
                            cache</button>
                    </div>
                    {{-- <button type="submit" class="rounded-full bg-amber-500 px-4 py-3 fi-ac-action fi-ac-btn-action"
                            wire:click="copyTo">
                            Copy
                        </button> --}}

                    <div class="flex w-full gap-2 justify-end">
                        <div class="lang-select flex items-center gap-1.5">
                            <label for="source_lang" class="form-label block">{{ __('Source') }} </label>
                            <select name="source_lang"
                                class="fi-select-input block w-full rounded-lg border border-gray-400 bg-transparent py-1.5 pe-8 ps-3 text-base text-gray-950 transition duration-75 focus:ring-0 disabled:text-gray-500 disabled:[-webkit-text-fill-color:theme(colors.gray.500)] dark:border-white/20 dark:text-white dark:disabled:text-gray-400 dark:disabled:[-webkit-text-fill-color:theme(colors.gray.400)] sm:text-sm sm:leading-6 [&_optgroup]:bg-white [&_optgroup]:dark:bg-gray-900 [&_option]:bg-white [&_option]:dark:bg-gray-900"
                                id="source_lang" required="" wire:model="source_lang">
                                @foreach ($this->langs as $state => $value)
                                    <option value="{{ $state }}">{{ $value }}</option>
                                @endforeach

                            </select>
                        </div>
                        <div class="lang-select flex items-center gap-1.5">
                            <label for="dest_lang" class="form-label block">{{ __('Destination') }} </label>
                            <select
                                name="dest_lang"class="border border-gray-400 dark:border-white/20 fi-select-input block w-full rounded-lg bg-transparent py-1.5 pe-8 text-base text-gray-950 transition duration-75 focus:ring-0 disabled:text-gray-500 disabled:[-webkit-text-fill-color:theme(colors.gray.500)] dark:text-white dark:disabled:text-gray-400 dark:disabled:[-webkit-text-fill-color:theme(colors.gray.400)] sm:text-sm sm:leading-6 [&_optgroup]:bg-white [&_optgroup]:dark:bg-gray-900 [&_option]:bg-white [&_option]:dark:bg-gray-900 ps-3"
                                id="dest_lang" required="" wire:model="dest_lang">
                                @foreach ($this->langs as $state => $value)
                                    <option value="{{ $state }}">{{ $value }}</option>
                                @endforeach
                            </select>
                        </div>
                        <button
                            style="--c-400:var(--primary-400);--c-500:var(--primary-500);--c-600:var(--primary-600);"
                            class="fi-btn fi-btn-color-gray fi-color-gray fi-size-md fi-btn-size-md fi-ac-action fi-ac-btn-action relative inline-grid grid-flow-col items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-950 shadow-sm outline-none ring-1 ring-gray-950/10 transition duration-75 hover:bg-gray-50 focus-visible:ring-2 dark:bg-white/5 dark:text-white dark:ring-white/20 dark:hover:bg-white/10"
                            type="submit" id="copy-btn">
                            <span class="fi-btn-label">
                                Copy
                            </span>
                        </button>

                        <button
                            style="--c-400:var(--primary-400);--c-500:var(--primary-500);--c-600:var(--primary-600);"
                            class="action-btn fi-btn fi-color-custom fi-btn-color-primary fi-color-primary fi-size-md fi-btn-size-md bg-custom-600 hover:bg-custom-500 focus-visible:ring-custom-500/50 dark:bg-custom-500 dark:hover:bg-custom-400 dark:focus-visible:ring-custom-400/50 fi-ac-action fi-ac-btn-action relative inline-grid grid-flow-col items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm outline-none transition duration-75 focus-visible:ring-2"
                            type="submit" id="translate-btn">
                            <span class="fi-btn-label">
                                Translate
                            </span>
                        </button>
                    </div>
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
            $tabs = App\Models\Translation::select('page')->distinct()->get()->pluck('page')->toArray();
        @endphp
        <section
            class="fi-tabs mx-auto flex w-max max-w-full gap-x-1 overflow-x-auto rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 my-2">
            @foreach ($tabs as $tab)
                <button
                    class="fi-tabs-item fi-active fi-tabs-item-active label-translation-tab group flex items-center gap-x-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium outline-none transition duration-75 dark:bg-white/5"
                    id="{{ $tab }}">
                    {{ str_replace('_', ' ', Str::ucfirst($tab)) }}</button>
            @endforeach

        </section>

        <div class="contentContainer flex flex-col gap-8 py-4" id="contentContainer">

        </div>

    </div>

</x-filament-panels::page>
<script>
    window.addEventListener("load", (event) => {
        var tabs = document.querySelectorAll('.label-translation-tab');
        var activeTab = tabs[0].id;
        document.getElementById(activeTab).classList.add('active', 'fi-active', 'text-primary-600');
        window.getTabwiseTranslation(activeTab);
        document.querySelectorAll('.label-translation-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {

                document.getElementById(activeTab).classList.remove('fi-active',
                    'text-primary-600', 'active');
                if (activeTab != tab.id) {
                    activeTab = tab.id
                }

                document.getElementById(activeTab).classList.add('active', 'fi-active',
                    'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50',
                    'dark:bg-white/5', 'bg-white', 'label-translation-tab', 'active');
                window.getTabwiseTranslation(activeTab);

            })
        })

        document.getElementById('clear-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('clear-btn').classList.add("loading");
            fetch('https://freemoney-api.enactweb.com/api/v1/cache/translations').then(response => {
                if (response.status == 200) {
                    document.getElementById('clear-btn').classList.remove("loading");
                    new FilamentNotification()
                        .success()
                        .title('Cache cleared successfully')
                        .send()
                } else {
                    document.getElementById('clear-btn').classList.remove("loading");
                    new FilamentNotification()
                        .danger()
                        .title('Something went wrong')
                        .send()
                }
            })

        })
        var from = document.getElementById('source_lang').value;
        var to = document.getElementById('dest_lang').value;
        document.getElementById('source_lang').addEventListener('change', (e) => {
            from = e.target.value;
        })
        document.getElementById('dest_lang').addEventListener('change', (e) => {
            to = e.target.value;
        })

        document.getElementById('copy-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('translate-btn').classList.add("loading");
            fetch(`/admin/copyTo/${from}/${to}`, {
                    headers: {
                        "accept": "application/json",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/json",
                    },
                    referrerPolicy: "same-origin",
                    body: null,
                    method: "get",
                    mode: "cors",
                    credentials: "include"
                })
                .then(response => {
                    document.getElementById('translate-btn').classList.remove("loading");
                    if (response.status == 200) {
                        new FilamentNotification()
                            .success()
                            .title('copy done successful')
                            .send()
                    } else {
                        new FilamentNotification()
                            .danger()
                            .title('Something went wrong')
                            .send()
                    }
                })
        })

        document.getElementById('translate-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('translate-btn').classList.add("loading");
            fetch(`/admin/translateTo/${from}/${to}`, {
                    headers: {
                        "accept": "application/json",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/json",
                    },
                    referrerPolicy: "same-origin",
                    body: null,
                    method: "get",
                    mode: "cors",
                    credentials: "include"
                })
                .then(response => {
                    document.getElementById('translate-btn').classList.remove("loading");
                    if (response.status == 200) {
                        new FilamentNotification()
                            .success()
                            .title('Translation successful')
                            .send()
                    } else {
                        new FilamentNotification()
                            .danger()
                            .title('Something went wrong')
                            .send()
                    }
                })
        })

    });
    window.getTabwiseTranslation = (tab) => {
        fetch(`/admin/get-translations/${tab}`, {
                headers: {
                    "accept": "application/json",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json",
                },
                referrerPolicy: "same-origin",
                body: null,
                method: "get",
                mode: "cors",
                credentials: "include"
            })
            .then(response => response.text())
            .then(html => {
                const contentContainer = document.getElementById('contentContainer');
                if (contentContainer) {
                    contentContainer.innerHTML = html;
                    const buttons = document.querySelectorAll('.lang-switch-btn.lang-text');
                    buttons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            let currentBtn = e.target;
                            let currentBtnSibilings = getSiblings(currentBtn)

                            currentBtnSibilings.forEach(btn => btn.classList.remove('active',
                                'fi-active',
                                'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50',
                                'dark:bg-white/5', 'bg-white', 'label-translation-tab',
                                'active'))

                            e.target.classList.add('active', 'fi-active',
                                'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50',
                                'dark:bg-white/5', 'bg-white', 'label-translation-tab',
                                'active')
                            let inputFieldName = currentBtn.getAttribute('data-field-target')
                            let inputActiveLang = currentBtn.getAttribute('data-lang')

                            let inputsToBeHidden = currentBtn.parentNode.parentNode
                                .querySelectorAll(
                                    `input.multilang`)
                            inputsToBeHidden.forEach(input => input.style.display = 'none')

                            let activeInput = currentBtn.parentNode.parentNode.querySelector(
                                `input[name="${inputFieldName}"]`)
                            console.log("activeInput", activeInput, currentBtn.parentNode
                                .parentNode, inputFieldName, inputActiveLang)
                            activeInput.style.display = 'block';
                            // const currentBtn = e.target;
                            // const inputFieldName = currentBtn.getAttribute(
                            //     'data-field-target');
                            // const inputActiveLang = currentBtn.getAttribute(
                            //     'data-lang');
                            // const parentContainer = currentBtn.parentElement
                            //     .parentElement;
                            // const inputsToBeHidden = parentContainer
                            //     .querySelectorAll(
                            //         'input.multilang');

                            // // Show only the input field associated with the clicked button's language
                            // inputsToBeHidden.forEach(input => {
                            //     const lang = input.getAttribute('name')
                            //         .split('[')[1]
                            //         .split(']')[0];
                            //     if (lang === inputActiveLang &&
                            //         inputFieldName == input
                            //         .name) {
                            //         input.style.display = 'block';
                            //         button.classList.add('active', 'fi-active',
                            //             'text-primary-600', 'fi-tabs-item-active',
                            //             'bg-gray-50',
                            //             'dark:bg-white/5', 'bg-white',
                            //             'label-translation-tab', 'active');
                            //     } else {
                            //         input.style.display = 'none';
                            //         console.log("input");
                            //         button.classList.remove('active', 'fi-active',
                            //             'text-primary-600', 'fi-tabs-item-active',
                            //             'bg-gray-50',
                            //             'dark:bg-white/5', 'bg-white',
                            //             'label-translation-tab', 'active');
                            //     }
                            // });

                            // buttons.forEach(btn => btn.classList.remove(
                            //     'active', 'fi-active',
                            //     'text-primary-600', 'fi-tabs-item-active',
                            //     'bg-gray-50',
                            //     'dark:bg-white/5', 'bg-white',
                            //     'label-translation-tab', 'active'));
                            // currentBtn.classList.add('active', 'fi-active',
                            //     'text-primary-600', 'fi-tabs-item-active',
                            //     'bg-gray-50',
                            //     'dark:bg-white/5', 'bg-white',
                            //     'label-translation-tab', 'active');
                            // Toggle 'btn-primary' class for language buttons
                        });
                    });
                }
            })
            .catch(error => console.error('Error fetching the view:', error));
    };

    function getSiblings(elem) {
        const siblings = [];
        let sibling = elem.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== elem && sibling.classList.contains(
                    'lang-switch-btn')) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling;
        }
        return siblings;
    }
</script>
