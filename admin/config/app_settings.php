<?php

return [

    // All the sections for the settings page
    'sections' => [
        'web' => [
            'title' => 'General Settings',
            'descriptions' => 'Application general settings.', // (optional)
            'icon' => 'fa fa-cog', // (optional)


            'inputs' => [
                [
                    'name' => 'name', // unique key for setting
                    'type' => 'text', // type of input can be text, number, textarea, select, boolean, checkbox etc.
                    'label' => 'Name', // label for input
                    // optional properties
                    'placeholder' => 'Name', // placeholder for input
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:!text-gray-400 placeholder:!text-sm  w-full border-none outline-none', // override global input_class
                    'style' => '', // any inline styles
                    'rules' => 'required|min:2|max:20', // validation rules for this input
                    'hint' => 'Will be used for SEO, Email etc' // help block text for input
                ],
                [
                    'name' => 'about',
                    'type' => 'multilang_editor',
                    'label' => 'About',
                    'hint' => 'Will be shown in the footer and other places where about content is expected.',
                    'data_type' => 'array',
                ],
                [
                    'name' => 'logo',
                    'type' => 'image',
                    'label' => 'Upload logo',
                    'hint' => 'Must be an image and cropped in desired size',
                    'rules' => 'image|max:500',
                    'disk' => 'frontend', // which disk you want to upload
                    'path' => '/', // path on the disk,
                    'preview_class' => 'thumbnail',
                    'preview_style' => 'height:40px',
                ],
                [
                    'name' => 'light_logo',
                    'type' => 'image',
                    'label' => 'Upload Light logo',
                    'hint' => 'Must be an image and cropped in desired size',
                    'rules' => 'image|max:500',
                    'disk' => 'frontend', // which disk you want to upload
                    'path' => '/', // path on the disk,
                    'preview_class' => 'thumbnail',
                    'preview_style' => 'height:40px',
                ],
                [
                    'name' => 'app_logo',
                    'type' => 'image',
                    'label' => 'Upload App logo',
                    'hint' => 'Must be an image and cropped in desired size',
                    'rules' => 'image|max:500',
                    'disk' => 'frontend', // which disk you want to upload
                    'path' => '/', // path on the disk,
                    'preview_class' => 'thumbnail',
                    'preview_style' => 'height:40px',
                ],
                [
                    'name' => 'favicon',
                    'type' => 'image',
                    'label' => 'Favicon',
                    'hint' => 'Must be an image and cropped in desired size',
                    'rules' => 'image|max:500',
                    'disk' => 'frontend', // which disk you want to upload
                    'path' => '/settings', // path on the disk,
                    'preview_class' => 'thumbnail',
                    'preview_style' => 'height:40px'
                ],
                [
                    'name' => 'copyright',
                    'type' => 'multilang_text',
                    'label' => 'Copyright Text',
                    'data_type' => 'array',
                ],

                [
                    'name' => 'default_lang',
                    'type' => 'select',
                    'label' => 'Default Language',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'rules' => 'required|min:2|max:2',

                    'options' => function () {
                        return \App\Models\Language::where('is_enabled', 1)->pluck('name', 'code')->toArray();
                    }
                ],
                [
                    'name' => 'fallback_lang',
                    'type' => 'select',
                    'label' => 'Fallback Language',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'rules' => 'required|min:2|max:2',

                    'options' => function () {
                        return \App\Models\Language::where('is_enabled', 1)->pluck('name', 'code')->toArray();
                    }
                ],
                [
                    'name' => 'default_country',
                    'type' => 'select',
                    'label' => 'Country',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'rules' => 'required|min:2|max:2',
                    'options' => function () {
                        return \App\Models\Country::where('is_enabled', 1)->pluck('code', 'code')->toArray();
                    },
                    'value' => 'IN',
                ],
                [
                    'name' => 'default_date_format',
                    'type' => 'select',
                    'label' => 'Default Date Format',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'options' => [
                        'MM/DD/YYYY' => 'MM/dd/yyyy',
                        'DD/MM/YYYY' => 'dd/MM/yyyy',
                        'YYYY-MM-DD' => 'yyyy-MM-dd',
                        'MMMM D, YYYY' => 'MMMM d, yyyy',
                        'D MMM YYYY' => 'd MMM yyyy',
                        'MM/DD/YY' => 'MM/dd/yy',
                        'DD MMM YYYY' => 'dd MMM yyyy'
                    ],
                    'value' => 'MM/DD/YYYY',
                ],
                [
                    'name' => 'tango_auto_payout_enabled',
                    'type' => 'boolean',
                    'label' => 'Enable Tango Gift Card Auto Payout',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'value' => '0',
                    'hint' => 'Select YES to enable automatic processing of Tango gift card payouts. When enabled, created payout requests will be automatically processed.',
                    'options' => [
                        '0' => 'NO',
                        '1' => 'YES',
                    ],
                ],
                [
                    'name'  => 'admin_emails',
                    'type'  => 'text',
                    'label' => 'Admin Emails',
                    // optional properties
                    'placeholder' => 'Enter Admin Emails, e.g: admin@gmail.com, admin2@gmail.com', // placeholder for input
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:!text-gray-400 placeholder:!text-sm  w-full border-none outline-none', // override global input_class
                    'style' => '', // any inline styles
                    'rules' => 'required|min:2',
                    'hint'  => 'Enter coma seperated Admin Emails for recieve mails, e.g: admin@gmail.com, admin2@gmail.com',
                ],
                [
                    'name'  => 'affiliate_admin_emails',
                    'type'  => 'text',
                    'label' => 'Affiliate Panel Admin Emails',
                    // optional properties
                    'placeholder' => 'Enter Affiliate Admin Emails, e.g: admin@gmail.com, admin2@gmail.com', // placeholder for input
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:!text-gray-400 placeholder:!text-sm  w-full border-none outline-none', // override global input_class
                    'style' => '', // any inline styles
                    'rules' => 'required|min:2',
                    'hint'  => 'Enter coma seperated Admin Emails for affiliate panel to recieve mails, e.g: admin@gmail.com, admin2@gmail.com',
                ],
                // [
                //     'type' => 'select',
                //     'name' => 'timezone',
                //     'label' => 'Timezone',
                //     'rules' => 'required',
                //     'options' => array_combine(timezone_identifiers_list(), timezone_identifiers_list()),
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                // ],
            ]
        ],

        // 'email' => [
        //     'title' => 'Email Settings',
        //     'descriptions' => 'How app email will be sent.',
        //     'icon' => 'fa fa-envelope',

        //     'inputs' => [
        //         //    TODO : Add all mail config values from here
        //         [
        //             'name' => 'mailer',
        //             'type' => 'text',
        //             'label' => 'Mail Mailer',
        //             'value' => 'smtp',
        //             'placeholder' => 'Mail Mailer',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //             'hint' => 'the default mail protocol like smtp, imap, pop3'
        //         ],
        //         [
        //             'name' => 'host',
        //             'type' => 'text',
        //             'label' => 'Mail Host',
        //             'value' => 'smtp.mailtrap.io',
        //             'placeholder' => 'Mail Host',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //             'hint' => 'mail service provider'
        //         ],
        //         [
        //             'name' => 'port',
        //             'type' => 'text',
        //             'label' => 'Mail Port',
        //             'value' => '2525',
        //             'placeholder' => 'Mail Port',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //             'hint' => 'port for mail sending'
        //         ],
        //         [
        //             'name' => 'username',
        //             'type' => 'text',
        //             'label' => 'Mail Username',
        //             'placeholder' => 'Mail Username',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //             'hint' => 'used to authenticate mail service'
        //         ],
        //         [
        //             'name' => 'password',
        //             'type' => 'text',
        //             'label' => 'Mail Password',
        //             'placeholder' => 'Mail Password',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //             'hint' => 'used to authenticate mail service'
        //         ],
        //         [
        //             'name' => 'encryption',
        //             'type' => 'text',
        //             'label' => 'Mail Encryption',
        //             'value' => 'tls',
        //             'placeholder' => 'Mail Encryption',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //             'hint' => 'encryption used to secure mail'
        //         ],
        //         [
        //             'name' => 'from_address',
        //             'type' => 'text',
        //             'label' => 'Mail From Address',
        //             'placeholder' => 'Mail From Address',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //             'hint' => 'address to be displayed in mail\'s sender field'
        //         ],
        //         [
        //             'name' => 'from_name',
        //             'type' => 'multilang_text',
        //             'label' => 'Mail From Name',
        //             'placeholder' => 'Mail From Name',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //             'rules' => 'required',
        //             'hint' => 'name to be displayed in mail\'s sender field',
        //             'data_type' => 'array',
        //         ],
        //         [
        //             'name' => 'support_email',
        //             'type' => 'text',
        //             'label' => 'Support Email',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //         ],

        //     ]
        // ],

        'seo' => [
            'title' => 'SEO',
            'descriptions' => 'Set default meta title, desc and h1/h2 tags for Pages',
            'icon' => 'fa fa-envelope',
            // 'hint' => 'Macros Supported are  #MONTH, #TITLE, #DESC',

            'inputs' => [

                [
                    'name' => 'contact_us_title',
                    'type' => 'multilang_text',
                    'label' => 'Contact Us -  Meta Title',
                    'data_type' => 'array',

                ],
                [
                    'name' => 'contact_us_desc',
                    'type' => 'multilang_textarea',
                    'label' => 'Contact Us - Meta Description',
                    'data_type' => 'array',

                ],

                [
                    'name' => 'business_inquiry_title',
                    'type' => 'multilang_text',
                    'label' => 'Business Inquiry -  Meta Title',
                    'data_type' => 'array',

                ],
                [
                    'name' => 'business_inquiry_desc',
                    'type' => 'multilang_textarea',
                    'label' => 'Business Inquiry - Meta Description',
                    'data_type' => 'array',

                ],


                [
                    'name' => 'faq_title',
                    'type' => 'multilang_text',
                    'label' => 'Faq - Meta Title',
                    'data_type' => 'array',

                ],
                [
                    'name' => 'faq_desc',
                    'type' => 'multilang_textarea',
                    'label' => 'Faq - Meta Description',
                    'data_type' => 'array',

                ],

                [
                    'name' => 'offers_title',
                    'type' => 'multilang_text',
                    'label' => 'Offers - Meta Title',
                    'data_type' => 'array',

                ],
                [
                    'name' => 'offers_desc',
                    'type' => 'multilang_textarea',
                    'label' => 'Offers - Meta Description',
                    'data_type' => 'array',

                ],

                [
                    'name' => 'userdashboard_earning_title',
                    'type' => 'multilang_text',
                    'label' => 'Userdashboard Earning Title',
                    'data_type' => 'array',
                ],
                [
                    'name' => 'userdashboard_withdrawal_title',
                    'type' => 'multilang_text',
                    'label' => 'Userdashboard Withdrawal Title',
                    'data_type' => 'array',
                ],
                [
                    'name' => 'userdashboard_ongoing_offers_title',
                    'type' => 'multilang_text',
                    'label' => 'Userdashboard Ongoing Offers Title',
                    'data_type' => 'array',
                ],
                [
                    'name' => 'userdashboard_chargebacks_title',
                    'type' => 'multilang_text',
                    'label' => 'Userdashboard Chargebacks Title',
                    'data_type' => 'array',
                ],
                [
                    'name' => 'userdashboard_referearn_title',
                    'type' => 'multilang_text',
                    'label' => 'Userdashboard Refer and Earn Title',
                    'data_type' => 'array',
                ],
                [
                    'name' => 'userdashboard_profile_title',
                    'type' => 'multilang_text',
                    'label' => 'Userdashboard Profile Title',
                    'data_type' => 'array',
                ],

                [
                    'name' => 'all_store_meta_title',
                    'type' => 'multilang_text',
                    'label' => 'All Store -  Meta Title',
                    'data_type' => 'array',

                ],
                [
                    'name' => 'all_store_meta_desc',
                    'type' => 'multilang_textarea',
                    'label' => 'All Store - Meta Description',
                    'data_type' => 'array',
                ],

                [
                    'name' => 'store_title',
                    'type' => 'multilang_text',
                    'label' => 'Store -  Meta Title',
                    'data_type' => 'array',

                ],
                [
                    'name' => 'store_desc',
                    'type' => 'multilang_textarea',
                    'label' => 'Store - Meta Description',
                    'data_type' => 'array',
                ],
                [
                    'name' => 'store_h1',
                    'type' => 'multilang_text',
                    'label' => 'Store -  h1',
                    'data_type' => 'array',

                ],
                [
                    'name' => 'store_h2',
                    'type' => 'multilang_text',
                    'label' => 'Store -  h2',
                    'data_type' => 'array',

                ],

                [
                    'name' => 'store_category_title',
                    'type' => 'multilang_text',
                    'label' => 'Store Category -  Meta Title',
                    'data_type' => 'array',

                ],
                [
                    'name' => 'store_category_desc',
                    'type' => 'multilang_textarea',
                    'label' => 'Store Category - Meta Description',
                    'data_type' => 'array',
                ],
                [
                    'name' => 'store_category_h1',
                    'type' => 'multilang_text',
                    'label' => 'Store Category -  h1',
                    'data_type' => 'array',

                ],
                [
                    'name' => 'store_category_h2',
                    'type' => 'multilang_text',
                    'label' => 'Store Category -  h2',
                    'data_type' => 'array',

                ],


            ],

        ],






        // 'gift_card' => [
        //     'title' => 'Tillo Gift Card Settings',
        //     'descriptions' => 'config for tillo gift card integration',
        //     'icon' => 'fa fa-gift',
        //     // TODO: Add Key value for all popular social networks, prefix social_ - DISHANT
        //     // fb,tw , yt, insta, telegram, pinterest
        //     'inputs' => [
        //         [
        //             'name' => 'gift_card_api_url',
        //             'type' => 'text',
        //             'label' => 'Gift Card Api Url',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //         ],
        //         [
        //             'name' => 'gift_card_api_key',
        //             'type' => 'text',
        //             'label' => 'Gift Card Api Key',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //         ],
        //         [
        //             'name' => 'gift_card_api_secret',
        //             'type' => 'text',
        //             'label' => 'Gift Card Aapi Secret',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //         ],
        //         [
        //             'name' => 'gift_card_from_email',
        //             'type' => 'email',
        //             'label' => 'Gift Card From Email',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //         ],
        //         [
        //             'name' => 'gift_card_from_name',
        //             'type' => 'text',
        //             'label' => 'Gift Card From name',
        //             'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
        //         ],
        //     ],
        // ],


        'social' => [
            'title' => 'Social Media Links',
            'descriptions' => 'Links for all of your social media will be here',
            'icon' => 'fa fa-users',
            'inputs' => [
                [
                    'name' => 'facebook',
                    'type' => 'text',
                    'label' => 'Facebook Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'twitter',
                    'type' => 'text',
                    'label' => 'Twitter Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'youtube',
                    'type' => 'text',
                    'label' => 'Youtube Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'instagram',
                    'type' => 'text',
                    'label' => 'Instagram Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'telegram',
                    'type' => 'text',
                    'label' => 'Telegram Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'pinterest',
                    'type' => 'text',
                    'label' => 'Pinterest Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'whatsapp',
                    'type' => 'text',
                    'label' => 'Whatsapp Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'reddit',
                    'type' => 'text',
                    'label' => 'Reddit Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'discord',
                    'type' => 'text',
                    'label' => 'Discord Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'linkdin',
                    'type' => 'text',
                    'label' => 'Linkdin Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'tiktok',
                    'type' => 'text',
                    'label' => 'Tiktok Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
                [
                    'name' => 'snapchat',
                    'type' => 'text',
                    'label' => 'Snapchat Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],
            ]
        ],

        'services' => [
            'title' => 'Third Party Integrations',
            'descriptions' => 'Details for third party will be here',
            'icon' => 'fa fa-anchor',
            'inputs' => [
                [
                    'name' => 'intercom_enabled',
                    'type' => 'boolean',
                    'label' => 'Enable Intercom',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'value' => '0',
                    'hint' => 'Select yes to enable intercom support and show intercom widget on website.',
                    'options' => [
                        '0' => 'NO',
                        '1' => 'YES',
                    ],
                ],
                [
                    'name' => 'kyc_verification_enabled',
                    'type' => 'boolean',
                    'label' => 'KYC Verification Intercom',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'value' => '0',
                    'hint' => 'Select yes to enable KYC Verification during withdrawals',
                    'options' => [
                        '0' => 'NO',
                        '1' => 'YES',
                    ],
                ],
                [
                    'name' => 'kyc_verification_on_first_payout',
                    'type' => 'boolean',
                    'label' => 'KYC Verification on First Payout',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'value' => '0',
                    'hint' => 'Select yes to show the KYC popup for the first payout on withdrawal',
                    'options' => [
                        '0' => 'NO',
                        '1' => 'YES',
                    ],
                ],
                [
                    'name' => 'brevo_api_key',
                    'type' => 'text',
                    'label' => 'Brevo API Key',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => '<a href="https://gutena.io/how-to-find-brevo-sendinblue-api-key-and-list-id" target="_blank"> CLick here for reference to find API Key and List ID</a>'
                ],
                [
                    'name' => 'brevo_guest_list_id',
                    'type' => 'text',
                    'label' => 'Brevo List ID for Guest',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => '<a href="https://gutena.io/how-to-find-brevo-sendinblue-api-key-and-list-id" target="_blank"> CLick here for reference to find API Key and List ID</a>'
                ],
                [
                    'name' => 'brevo_user_list_id',
                    'type' => 'text',
                    'label' => 'Brevo List ID for Users',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => '<a href="https://gutena.io/how-to-find-brevo-sendinblue-api-key-and-list-id" target="_blank"> CLick here for reference to find API Key and List ID</a>'
                ],
                [
                    'name' => 'neeto_api_key',
                    'type' => 'text',
                    'label' => 'Neeto API Key',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                ],



            ]
        ],

        'earning' => [
            'title' => 'Earning Settings',
            'descriptions' => 'All the earning related settings will stay here',
            'icon' => 'fa fa-money',
            'inputs' => [
                [
                    'name' => 'token_icon',
                    'type' => 'image',
                    'label' => 'Token Icon',
                    'hint' => 'This image is used to display the icon of the token or points. It should be an image with .png,.jpg extension and max size of 500kb.',
                    'rules' => 'image|max:500',
                    'disk' => 'frontend', // which disk you want to upload
                    'path' => '/', // path on the disk,
                    'preview_class' => 'thumbnail',
                    'preview_style' => 'height:40px'
                ],
                [
                    'name' => 'token_conversion_rate',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'value' => '1000',
                    'label' => 'Token Conversion Rate',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'The value of token compared to 1 unit of base currency. Eg: If base currency is 1$ then 1$ = 1000 tokens'
                ],
                [
                    'name' => 'tokens_per_level',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'value' => '1000',
                    'label' => 'Tokens per Level',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'The amount of tokens required by the user to level up.'
                ],
                [

                    'type' => 'select',
                    'name' => 'default_currency',
                    'label' => 'Default Currency to use for system',
                    'rules' => 'required',
                    'options' => function () {
                        return App\Models\Currency::where('enabled', 1)->pluck('iso_code', 'iso_code')->toArray();
                    },
                    'hint' => '<a class="text-blue-500 active" href="/admin/currencies">Create New Currency Here</a>'

                ],
                [
                    'name'      => 'earning_amount_round',
                    'type'      => 'text',
                    'label'     => 'Digits to round the user cashback amount',
                    'data_type' => 'integer',
                    'value'     => 1


                ],

            ]
        ],
        'rewards' => [
            'title' => 'Rewards Settings',
            'descriptions' => 'All the rewards related settings will stay here',
            'icon' => 'fa fa-money',
            'inputs' => [
                [
                    'name' => 'ladder_earning_required',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'value' => '1000',
                    'label' => 'Bonus Ladder Earning Required',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'The amount the user should earn within specified time before accessing the Bonus Ladder'
                ],
                [
                    'name' => 'ladder_earning_interval',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'value' => '1000',
                    'label' => 'Bonus Ladder Earning Interval (In Days)',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'The duration in which the user have to earn required amount for the accessing the Bonus Ladder.'
                ],
                [
                    'name' => 'ladder_claim_interval',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'value' => '1000',
                    'label' => 'Bonus Ladder Claim Interval (In Hrs)',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'The duration between two consecutive Bonus Ladder by the same user.'
                ],
                [
                    'name' => 'streak_earning_required',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'value' => '1000',
                    'label' => 'Streak Earning Required',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'The amount user need to earn to keep the streak active.'
                ],
                [
                    'name' => 'streak_lifetime_in_days',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'value' => '1000',
                    'label' => 'Streak Lifetime (In Days)',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'The lifetime of the streak for the user. If the user have not earned the requierd amount within this duration, the streak ends and restarts.'
                ],


            ]
        ],

        'dev' => [
            'title' => 'Developer Settings',
            'descriptions' => 'All settings that a developer needs will be here',
            'icon' => 'fa fa-desktop',
            'inputs' => [
                [
                    'name' => 'code_head',
                    'type' => 'textarea',
                    'label' => 'Head',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'Placed at the head',
                    'rows' => 1,
                ],
                [
                    'name' => 'code_foot',
                    'type' => 'textarea',
                    'label' => 'Foot',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'Placed at the footer',
                    'rows' => 1,
                ],
                [
                    'name' => 'code_body',
                    'type' => 'textarea',
                    'label' => 'Body',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'Place at the start of the body',
                    'rows' => 1,
                ]

            ]
        ],

        'theme' => [
            'title' => 'UI/Theme Settings ',
            'descriptions' => 'All settings needs to UI',
            'icon' => 'fa fa-gear',

            'inputs' => [

                [
                    'name' => 'primary_btn_gr',
                    'type' => 'text',
                    'label' => 'Primary Button Gradient',
                    'hint' => 'Enter gradient color for primary buttons. Use this link to generate gradient color: <a target="_blank" style="color: blue;" href="https://cssgradient.io">https://cssgradient.io</a> <br/> Default value: linear-gradient(180deg, #8f82ff 0%, #4638f1 100%).',
                    'value' => 'linear-gradient(180deg, #8f82ff 0%, #4638f1 100%)'
                ],
                [
                    'name' => 'outline_btn_border_gr',
                    'type' => 'text',
                    'label' => 'Outline Button Border Gradient',
                    'hint' => 'Enter gradient color for outline button borders. Use this link to generate gradient color: <a target="_blank" style="color: blue;" href="https://cssgradient.io">https://cssgradient.io</a> <br/> Default value: linear-gradient(180deg, #8f82ff 0%, #4638f1 100%).',
                    'value' => 'linear-gradient(180deg, #8f82ff 0%, #4638f1 100%)'
                ],
                [
                    'name' => 'btn_primary_text',
                    'type' => 'text',
                    'label' => 'Primary Button Text Color',
                    'hint' => 'Enter text color for primary buttons. Default value: #ffffff',
                    'value' => '#ffffff'
                ],
                [
                    'name' => 'btn_outline_text',
                    'type' => 'text',
                    'label' => 'Outline Button Text Color',
                    'hint' => 'Enter text color for outline buttons. Default value: #ffffff',
                    'value' => '#ffffff'
                ],
                [
                    'name' => 'footer_bg',
                    'type' => 'text',
                    'label' => 'Footer Background Color',
                    'hint' => 'Enter background color for footer. Default value: #0b0b0b',
                    'value' => '#0b0b0b'
                ],
                [
                    'name' => 'footer_text',
                    'type' => 'text',
                    'label' => 'Footer Text Color',
                    'hint' => 'Enter text color for footer. Default value: #a7a7a7',
                    'value' => '#a7a7a7'
                ],
                [
                    'name' => 'body_bg',
                    'type' => 'text',
                    'label' => 'Body Background Color',
                    'hint' => 'Enter background color for body. Default value: #050505',
                    'value' => '#050505'
                ],
                [
                    'name' => 'card_bg',
                    'type' => 'text',
                    'label' => 'Card Background Color',
                    'hint' => 'Enter background color for cards. Default value: #161617',
                    'value' => '#161617'
                ],
                [
                    'name' => 'card_secondary_bg',
                    'type' => 'text',
                    'label' => 'Card Secondary Background Color',
                    'hint' => 'Enter secondary background color for cards. Default value: #1f1f1f',
                    'value' => '#1f1f1f'
                ],
                [
                    'name' => 'body_text_primary',
                    'type' => 'text',
                    'label' => 'Body Text Primary Color',
                    'hint' => 'Enter primary text color for body. Default value: #8d8d8d',
                    'value' => '#8d8d8d'
                ],
                [
                    'name' => 'body_text_secondary',
                    'type' => 'text',
                    'label' => 'Body Text Secondary Color',
                    'hint' => 'Enter secondary text color for body. Default value: #ffffff',
                    'value' => '#ffffff'
                ],
                [
                    'name' => 'border_gr',
                    'type' => 'text',
                    'label' => 'Border Gradient',
                    'hint' => 'Enter gradient color for borders. Use this link to generate gradient color: <a target="_blank" style="color: blue;" href="https://cssgradient.io">https://cssgradient.io</a> <br/> Default value: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)).',
                    'value' => 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))'
                ],
                [
                    'name' => 'border_hover_gr',
                    'type' => 'text',
                    'label' => 'Border Hover Gradient',
                    'hint' => 'Enter gradient color for borders on hover. Use this link to generate gradient color: <a target="_blank" style="color: blue;" href="https://cssgradient.io">https://cssgradient.io</a> <br/> Default value: linear-gradient(89.54deg, #d5478e 0.29%, #7008d2 49.92%, #437ddb 99.54%).',
                    'value' => 'linear-gradient(89.54deg, #d5478e 0.29%, #7008d2 49.92%, #437ddb 99.54%)'
                ],
                [
                    'name' => 'section_title_gr',
                    'type' => 'text',
                    'label' => 'Section Title Gradient',
                    'hint' => 'Enter gradient color for section titles. Use this link to generate gradient color: <a target="_blank" style="color: blue;" href="https://cssgradient.io">https://cssgradient.io</a> <br/> Default value: linear-gradient(172.07deg, #ffffff 29.49%, #999999 75.15%).',
                    'value' => 'linear-gradient(172.07deg, #ffffff 29.49%, #999999 75.15%)'
                ],
                [
                    'name' => 'primary_gr',
                    'type' => 'text',
                    'label' => 'Primary Gradient',
                    'hint' => 'Enter primary gradient color. Use this link to generate gradient color: <a target="_blank" style="color: blue;" href="https://cssgradient.io">https://cssgradient.io</a> <br/> Default value: linear-gradient(180deg, #8f82ff 0%, #4638f1 100%).',
                    'value' => 'linear-gradient(180deg, #8f82ff 0%, #4638f1 100%)'
                ],
                [
                    'name' => 'secondary_gr',
                    'type' => 'text',
                    'label' => 'Secondary Gradient',
                    'hint' => 'Enter seconary gradient color. Use this link to generate gradient color: <a target="_blank" style="color: blue;" href="https://cssgradient.io">https://cssgradient.io</a> <br/> Default value: linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0.04%, rgba(255, 255, 255, 0.14) 100%).',
                    'value' => 'linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0.04%, rgba(255, 255, 255, 0.14) 100%)'
                ],
                [
                    'name' => 'input_bg',
                    'type' => 'text',
                    'label' => 'Input Background',
                    'hint' => 'Enter background color for input fields. Use this link to generate gradient color: <a target="_blank" style="color: blue;" href="https://cssgradient.io">https://cssgradient.io</a> <br/> Default value: linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0.04%, rgba(255, 255, 255, 0.14) 100%).',
                    'value' => 'linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0.04%, rgba(255, 255, 255, 0.14) 100%)'
                ],
                [
                    'name' => 'primary',
                    'type' => 'text',
                    'label' => 'Primary Color',
                    'hint' => 'Enter primary color. Default value: #8e81ff',
                    'value' => '#8e81ff'
                ],

                [
                    'name' => 'offer_style',
                    'type' => 'select',
                    'label' => 'Offer Card Style',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'value' => '1',
                    'hint' => 'This will change how the offers card look across the website,',
                    'options' => [
                        'large' => "Large",
                        'small' => "Small"
                    ]
                ],
                [
                    'name' => 'cashout_card_style',
                    'type' => 'select',
                    'label' => 'Cashout Card Style',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'value' => '1',
                    'hint' => 'This will change how the cashout card look across the website,',
                    'value' => 'with_logo',
                    'options' => [
                        'with_card_image' => "With Card Image",
                        'with_logo' => "With Logo"
                    ]
                ],

                // [
                //     'name' => 'container_width',
                //     'type' => 'select',
                //     'label' => 'Container _Width',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                //     'value' => '1320px',
                //     'hint' => 'Based on the selection, UI Will change',
                //     'options' => [
                //         '1320px' => "1320px",
                //         '1600px' => "1600px"
                //     ]
                // ],
                // [
                //     'name' => 'font_code',
                //     'type' => 'textarea',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                //     'label' => 'Font Code'
                // ],
                // [
                //     'name' => 'similar_store_count',
                //     'type' => 'text',
                //     'data_type' => 'integer',
                //     'label' => 'Similar Store On Single Store Page',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                //     'value' => 4,
                // ],
                // [
                //     'name' => 'footer_columns_count',
                //     'type' => 'text',
                //     'data_type' => 'integer',
                //     'label' => 'No of columns for footer',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                //     'value' => 6,
                // ],
            ]

        ],

        'forms' => [
            'title' => 'Forms',
            'descriptions' => 'This is where you would find the configuration of forms on our website.',
            'icon' => 'fa fa-gear',
            'inputs' => [
                [
                    'name' => 'contact_form_reasons',
                    'type' => 'textarea',
                    'label' => 'Contact Form Reasons',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'Add reasons for contact form separated by new line',
                ],
                [
                    'name' => 'business_inquiry_reasons',
                    'type' => 'textarea',
                    'label' => 'Business Inquiry Reasons',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'Add reasons for business inquiry form separated by new line',
                ],
            ]
        ],

        'analytics' => [
            'title' => 'Analytics',
            'descriptions' => 'Add the google or facebook or other analytics pixel id here.',
            'icon' => 'fa fa-chart-column',
            'inputs' => [
                [
                    'name' => 'gtm_pixel_id',
                    'type' => 'text',
                    'label' => 'Google Tagmanager Pixel Id',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'Add the Google Tag Manager pixel id',
                ],
                [
                    'name' => 'fb_pixel_id',
                    'type' => 'text',
                    'label' => 'Facebook Pixel Id',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'Add the Facebook pixel id',
                ]
            ]
        ],
        'cta_bar' => [
            'title' => 'TopBar - Call to Action',
            'descriptions' => 'Call to Action bar with title, button, hyperlink setting to show in Footer / Header',
            'icon' => 'fa fa-gear',
            'inputs' => [
                [
                    'name' => 'cta_enabled',
                    'type' => 'boolean',
                    'label' => 'Enable Call to Action Bar',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'value' => true,
                    'hint' => 'select yes to start showing up in front-end',
                    'options' => [
                        '0' => 'NO',
                        '1' => 'YES',
                    ],
                ],
                [
                    'name' => 'cta_location',
                    'type' => 'select',
                    'label' => 'Call-to-Action Bar Location',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'value' => 'footer',
                    'hint' => 'Based on the selection, it shows up in Header or Footer',
                    'options' => [
                        'header' => "Header",
                        'footer' => "Footer"
                    ]
                ],
                [
                    'name' => 'cta_bg_color',
                    'type' => 'color',
                    'label' => 'Call-to-Action Bar Background Color',
                    'class' => 'colorpicker',
                    'hint' => 'Default is "#6423D2"',
                    'value' => '#6423D2'
                ],
                [
                    'name' => 'cta_content',
                    'type' => 'multilang_editor',
                    'label' => 'Call to Action Content',
                    'data_type' => 'array',

                ],
            ]
        ],

        'store_settings' => [
            'title' => 'Store Settings',
            'descriptions' => 'Configure your stores here',
            'icon' => 'fa fa-store',

            'inputs' => [

                [
                    'name'      => 'tracking_speed',
                    'type'      => 'multilang_text',
                    'label'     => 'Tracking Speed',
                    'data_type' => 'array',
                    'hint'      => 'the tracking speed of the store',

                ],
                [
                    'name'      => 'confirm_duration',
                    'type'      => 'text',
                    'label'     => 'Confirm Duration',
                    'data_type' => 'text',
                    'value'     => '+90 Tage',
                    'hint'      => 'average amount of days that a store takes to confirm cashback. NOTE : it should be php strtotime compliant, ex- +90 days, last day of next month etc'

                ],
                [
                    'name'      => 'cashback_percent_round',
                    'type'      => 'text',
                    'label'     => 'Digits to round the cashback percent',
                    'data_type' => 'integer',
                    'value'     => 1


                ],
                [
                    'name'      => 'cashback_amount_round',
                    'type'      => 'text',
                    'label'     => 'Digits to round the cashback amount',
                    'data_type' => 'integer',
                    'value'     => 0

                ],

            ]
        ],

        'cashback' => [
            'title' => 'Cashback Settings',
            'descriptions' => 'All the cashback related settings will stay here',
            'icon' => 'fa fa-money',
            // TODO:  cashback_ ->  'default_user_percent , out_seconds , referral_percent ,
            'inputs' => [
                // [
                //     'name' => 'icon',
                //     'type' => 'image',
                //     'label' => 'Icon',
                //     'hint' => 'Must be an image and cropped in desired size',
                //     'rules' => 'image|max:500',
                //     'disk' => 'web', // which disk you want to upload
                //     'path' => '/', // path on the disk,
                //     'preview_class' => 'thumbnail',
                //     'preview_style' => 'height:40px'
                // ],
                [
                    'name' => 'default_user_percent',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'label' => 'Default User Cash Back',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'default cashback that a user will recieve'
                ],
                // [
                //     'name' => 'out_seconds',
                //     'type' => 'text',
                //     'data_type' => 'integer',
                //     'label' => 'Cashback Out Seconds',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                //     'hint' => 'cashback out seconds'
                // ],
                // [
                //     'name' => 'header_cache_seconds',
                //     'type' => 'text',
                //     'data_type' => 'integer',
                //     'label' => 'Header Cashback amount cache in seconds',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                //     'hint' => 'how long before user balanced is recached',
                //     'value' => 21600,
                // ],
                [
                    'name' => 'referral_enabled',
                    'type' => 'boolean',
                    'label' => 'Award Referral on transaction',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'value' => true,
                    'options' => [
                        '0' => 'NO',
                        '1' => 'YES',
                    ],
                ],
                [
                    'name' => 'referral_percent',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'label' => 'Cashback Referral Percent',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'amount that a user will get on referrals'
                ],
                // TODO: Make it as dropdown from currency Model/Table
                // [

                //     'type' => 'select',
                //     'name' => 'default_currency',
                //     'label' => 'Default Currency to use for system',
                //     'rules' => 'required',
                //     'options' => function () {
                //         return App\Models\CurrencyMaster::where('enabled', 1)->pluck('iso_code', 'iso_code')->toArray();
                //     },
                //     'hint' => '<a class="text-primary active" href="/manage/currency-master/create/?return=/settings">Create New Currency Here</a>'

                // ],
                [
                    'name' => 'claim_min_days',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'label' => 'Cashback Missing claim Min Days - Relative to Current day.',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'Cashback Missing claim Min Days - Relative to Current day.',
                    'value' => 1,
                ],
                [
                    'name' => 'claim_max_days',
                    'type' => 'text',
                    'data_type' => 'integer',
                    'label' => 'Cashback Missing claim Max Days - Relative to Current day.',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',

                    'hint' => 'Cashback Missing claim Max Days - Relative to Current day.',
                    'value' => 10,
                ],
                // [
                //     'name' => 'should_verify_phone',
                //     'type' => 'boolean',
                //     'label' => 'Enable OTP Verification',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',

                //     'value' => true,
                //     'hint' => 'Disabling will still require user to verify email, but they won\'t be prompted to enter phone number',
                //     'options' => [
                //         '0' => 'NO',
                //         '1' => 'YES',
                //     ],
                // ],
                // [
                //     'name' => 'otp_message',
                //     'type' => 'multilang_text',
                //     'label' => 'OTP Message',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',

                //     'data_type' => 'array',
                // ],
                // [
                //     'name' => 'otp_wait_seconds',
                //     'type' => 'text',
                //     'data_type' => 'integer',
                //     'label' => 'Seconds user has to Wait before requesting new OTP',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',

                //     'value' => 45,
                // ],
                // [
                //     'name' => 'max_phone_length',
                //     'type' => 'text',
                //     'data_type' => 'integer',
                //     'label' => 'Max Phone Length',
                //     'hint' => 'NOTE : Consider length for country code ex: +91 and a space',
                //     'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',

                //     'value' => 15,
                // ],
                [
                    'name' => 'cashback_sentence',
                    'type' => 'multilang_text',
                    'label' => 'Cashback Sentence',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',

                    'data_type' => 'array',
                ],
                [
                    'name' => 'reward_sentence',
                    'type' => 'multilang_text',
                    'label' => 'Reward Sentence',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',


                    'data_type' => 'array',
                ]

            ]
        ],

        'download' => [
            'title' => 'Promote Links',
            'descriptions' => 'Links for all of app, extensions will be here',
            'icon' => 'fa fa-window-restore ',
            // TODO : Add keys for download_ -> app_ios, app_android , extn_safari, extn_firefox, extn_chrome
            'inputs' => [
                [
                    'name' => 'app_ios',
                    'type' => 'text',
                    'label' => 'IOS App Link',
                    // 'class' => 'form-control',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'link for ios app from app store'
                ],
                [
                    'name' => 'app_android',
                    'type' => 'text',
                    'label' => 'Android App Link',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'link for android app from play store'
                ],
                // [
                //     'name' => 'extn_safari',
                //     'type' => 'text',
                //     'label' => 'Safari Browser Extension Link',
                //     'class' => 'form-control',
                //     'hint' => 'extension link for safari browser'
                // ],
                // [
                //     'name' => 'extn_edge',
                //     'type' => 'text',
                //     'label' => 'Edge Browser Extension Link',
                //     'class' => 'form-control',
                //     'hint' => 'extension link for edge browser'
                // ],
                // [
                //     'name' => 'extn_firefox',
                //     'type' => 'text',
                //     'label' => 'Firefox Browser Extension Link',
                //     'class' => 'form-control',
                //     'hint' => 'extension link for firefox browser'
                // ],
                // [
                //     'name' => 'extn_chrome',
                //     'type' => 'text',
                //     'label' => 'Chrome Browser Extension Link',
                //     'class' => 'form-control',
                //     'hint' => 'extension link for chrome browser'
                // ]
            ]
        ],

        'trust_pilot' => [
            'title' => 'Trust Pilot Settings',
            'descriptions' => 'Links for setting up trust pilot',
            'icon' => 'fa fa-window-restore ',
            'inputs' => [

                [
                    'name' => 'trust_pilot_logo',
                    'type' => 'image',
                    'label' => 'Upload logo',
                    'hint' => 'Must be an image and cropped in desired size',
                    'rules' => 'image|max:500',
                    'disk' => 'frontend', // which disk you want to upload
                    'path' => '/', // path on the disk,
                    'preview_class' => 'thumbnail',
                    'preview_style' => 'height:40px',
                ],
                [
                    'name' => 'trust_pilot_link',
                    'type' => 'text',
                    'label' => 'Trust Pilot Link',
                    // 'class' => 'form-control',
                    'class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
                    'hint' => 'Url link for trust pilot'
                ],
            ]

        ],




    ],

    // Setting page url, will be used for get and post request
    'url' => 'settings',

    // Any middleware you want to run on above route
    // TODO : Make it work with 'auth' middleware
    'middleware' => ['auth'],

    // View settings
    'setting_page_view' => 'core.settings_page',
    'flash_partial' => 'app_settings::_flash',

    // Setting section class setting
    'section_class' => 'card sidemargin',
    'section_heading_class' => 'card-header',
    'section_body_class' => 'card-body grid grid-cols-2 gap-6',

    // Input wrapper and group class setting
    'input_wrapper_class' => 'form-group grid gap-y-2',
    'input_class' => 'fi-input-wrp flex rounded-lg shadow-sm ring-1 transition duration-75 bg-white dark:bg-white/5 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-2 ring-gray-950/10 dark:ring-white/20 [&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-600 dark:[&:not(:has(.fi-ac-action:focus))]:focus-within:ring-primary-500 fi-fo-text-input overflow-hidden  sm:text-sm sm:leading-6 bg-white/0 ps-3 pe-3 placeholder:text-gray-400 w-full border-none outline-none',
    'input_error_class' => 'has-error',
    'input_invalid_class' => 'is-invalid',
    'input_hint_class' => 'form-text text-muted',
    'input_error_feedback_class' => 'text-danger',

    // Submit button
    'submit_btn_text' => 'Save Settings',
    'submit_success_message' => 'Settings has been saved.',

    // Remove any setting which declaration removed later from sections
    'remove_abandoned_settings' => false,

    // Controller to show and handle save setting
    'controller' => '\QCod\AppSettings\Controllers\AppSettingController',

    // settings group
    'setting_group' => function () {
        // return 'user_'.auth()->id();
        return 'default';
    }
];
