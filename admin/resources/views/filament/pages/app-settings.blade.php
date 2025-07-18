<x-filament-panels::page>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    @include('app_settings::_settings')

    <!-- jQuery and Popper.js -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous">
    </script>

    <!-- Dark mode styles for CKEditor -->
    <style>
        /* Dark mode customization for CKEditor in Filament */
        .dark {
            /* Text color for the editor content in dark mode */
            --ck-color-text: hsl(0, 0%, 98%);
            
            /* Background colors */
            --ck-custom-background: hsl(270, 1%, 29%);
            --ck-custom-foreground: hsl(255, 3%, 18%);
            --ck-custom-border: hsl(300, 1%, 22%);
            
            /* Editor base colors */
            --ck-color-base-foreground: var(--ck-custom-background);
            --ck-color-base-background: var(--ck-custom-foreground);
            --ck-color-base-border: var(--ck-custom-border);
            
            /* Editor UI elements */
            --ck-color-panel-background: var(--ck-custom-background);
            --ck-color-panel-border: var(--ck-custom-border);
            --ck-color-toolbar-background: var(--ck-custom-background);
            --ck-color-toolbar-border: var(--ck-custom-border);
            
            /* Input fields */
            --ck-color-input-background: var(--ck-custom-background);
            --ck-color-input-border: hsl(257, 3%, 43%);
            --ck-color-input-text: hsl(0, 0%, 98%);
            
            /* Content editable area */
            --ck-color-widget-editable-focus-background: hsl(255, 3%, 18%);
        }

        /* Ensure editor content has proper color in dark mode */
        .dark .ck-content,
        .dark .ck-editor__editable {
            color: var(--ck-color-text) !important;
            background-color: var(--ck-color-base-background) !important;
        }

        /* Fix for placeholder text in dark mode */
        .dark .ck.ck-editor__editable > .ck-placeholder::before {
            color: hsl(0, 0%, 70%);
        }
    </style>

    <script>
        // Prevent multiple script execution
        if (typeof window.multilingualSystemInitialized === 'undefined') {
            window.multilingualSystemInitialized = true;

            // Load CKEditor only if not already loaded
            if (typeof ClassicEditor === 'undefined') {
                const ckEditorScript = document.createElement('script');
                ckEditorScript.src = 'https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js';
                ckEditorScript.onload = function() {
                    initializeMultilingualSystem();
                };
                document.head.appendChild(ckEditorScript);
            } else {
                // CKEditor already loaded, initialize directly
                initializeMultilingualSystem();
            }

            // Global variables - use window object to prevent redeclaration
            window.APP_LOCALE = window.APP_LOCALE || "{{ app()->getLocale() }}";
            window.editorInstances = window.editorInstances || {};
            window.initializationComplete = window.initializationComplete || false;
            window.reinitializationTimer = null;
            window.isReinitializing = false; // Add flag to prevent multiple reinitializations

            // Utility function to get siblings
            function getSibilings(elem) {
                let siblings = [];
                let sibling = elem.parentNode.firstChild;
                
                while (sibling) {
                    if (sibling.nodeType === 1 && sibling !== elem) {
                        siblings.push(sibling);
                    }
                    sibling = sibling.nextSibling;
                }
                return siblings;
            }

            // Find the tab group containing a button
            function findTabGroup(button) {
                return button.closest('.fi-tabs') || 
                       button.closest('[role="tablist"]') || 
                       button.closest('.tabs-container') || 
                       button.parentNode;
            }

            // Activate language tabs based on current app locale
            function activateLanguageTabs() {
                const activeLanguageTabs = {};
                
                // First, find and mark language tabs for the current locale as active
                document.querySelectorAll('.lang-switch-btn').forEach(button => {
                    const btnLang = button.getAttribute('data-lang');
                    const fieldName = button.getAttribute('data-field-target');
                    
                    // Skip if we already found an active tab for this field
                    if (activeLanguageTabs[fieldName]) return;
                    
                    // If this button is for the current language, activate it
                    if (btnLang === window.APP_LOCALE) {
                        const tabGroup = findTabGroup(button);
                        
                        if (tabGroup) {
                            // Remove active class from all tabs in this group
                            tabGroup.querySelectorAll('.lang-switch-btn').forEach(tab => {
                                tab.classList.remove('active', 'fi-active', 'text-primary-600', 
                                    'fi-tabs-item-active', 'bg-gray-50', 'dark:bg-white/5', 
                                    'bg-white', 'label-translation-tab');
                            });
                            
                            // Add active class to this button
                            button.classList.add('active', 'fi-active', 'text-primary-600', 
                                'fi-tabs-item-active', 'bg-gray-50', 'dark:bg-white/5', 
                                'bg-white', 'label-translation-tab');
                            
                            activeLanguageTabs[fieldName] = {
                                lang: btnLang,
                                button: button
                            };
                        }
                    }
                });
                
                // For any fields without an active tab, activate the first tab
                document.querySelectorAll('.lang-switch-btn').forEach(button => {
                    const fieldName = button.getAttribute('data-field-target');
                    
                    if (activeLanguageTabs[fieldName]) return;
                    
                    const tabGroup = findTabGroup(button);
                    
                    if (tabGroup && button === tabGroup.querySelector('.lang-switch-btn')) {
                        tabGroup.querySelectorAll('.lang-switch-btn').forEach(tab => {
                            tab.classList.remove('active', 'fi-active', 'text-primary-600', 
                                'fi-tabs-item-active', 'bg-gray-50', 'dark:bg-white/5', 
                                'bg-white', 'label-translation-tab');
                        });
                        
                        button.classList.add('active', 'fi-active', 'text-primary-600', 
                            'fi-tabs-item-active', 'bg-gray-50', 'dark:bg-white/5', 
                            'bg-white', 'label-translation-tab');
                        
                        activeLanguageTabs[fieldName] = {
                            lang: button.getAttribute('data-lang'),
                            button: button
                        };
                    }
                });
                
                return activeLanguageTabs;
            }

            // Clean up existing editors
            function cleanupEditors() {
                // console.log('Cleaning up editors...');
                Object.keys(window.editorInstances).forEach(editorName => {
                    const editorData = window.editorInstances[editorName];
                    if (editorData && editorData.instance) {
                        try {
                            if (!editorData.instance.isDestroyed) {
                                editorData.instance.destroy();
                            }
                        } catch (error) {
                            console.warn('Error destroying editor:', editorName, error);
                        }
                    }
                });
                window.editorInstances = {};
                window.initializationComplete = false;
                // console.log('Editor cleanup complete');
            }

            // Initialize CKEditor instances
            function initializeEditors() {
                if (window.initializationComplete && !window.isReinitializing) {
                    // console.log('Editors already initialized, skipping...');
                    return;
                }
                
                // Check if CKEditor is available
                if (typeof ClassicEditor === 'undefined') {
                    console.warn('CKEditor not loaded yet, retrying...');
                    setTimeout(initializeEditors, 500);
                    return;
                }
                
                // console.log('Initializing CKEditor instances...');
                
                // Get active tabs to determine which editors should be visible
                const activeLanguageTabs = {};
                
                document.querySelectorAll('.lang-switch-btn.active').forEach(btn => {
                    const fieldName = btn.getAttribute('data-field-target');
                    const tabLang = btn.getAttribute('data-lang');
                    
                    if (!activeLanguageTabs[fieldName]) {
                        activeLanguageTabs[fieldName] = tabLang;
                    }
                });
                
                // Initialize each editor
                const editorPromises = [];
                
                document.querySelectorAll('.editor').forEach((textarea) => {
                    // Skip if already initialized
                    const editorName = textarea.getAttribute('name');
                    if (window.editorInstances[editorName] && !window.isReinitializing) {
                        // console.log('Skipping already initialized editor:', editorName);
                        return;
                    }
                    
                    // Extract field information
                    const fieldParts = editorName.split('[');
                    const fieldName = fieldParts[0];
                    const editorLang = fieldParts[1] ? fieldParts[1].replace(']', '') : window.APP_LOCALE;
                    
                    // Determine if this editor should be visible
                    const isActiveTab = (activeLanguageTabs[fieldName] === editorLang) || 
                                       (editorLang === window.APP_LOCALE && !activeLanguageTabs[fieldName]);
                    
                    // console.log('Creating editor for:', editorName, 'Active:', isActiveTab);
                    
                    // Initialize CKEditor
                    const promise = ClassicEditor
                        .create(textarea)
                        .then(editor => {
                            const editorElement = editor.ui.view.editable.element;
                            const editorContainer = editorElement.closest('.ck-editor');
                            
                            // Add overflow handling
                            editorContainer.classList.add('overflow-x-auto');
                            
                            // Store editor instance
                            window.editorInstances[editorName] = {
                                instance: editor,
                                container: editorContainer
                            };
                            
                            // Set initial visibility
                            editorContainer.style.display = isActiveTab ? 'block' : 'none';
                            
                            // console.log('Editor created successfully:', editorName);
                            return editor;
                        })
                        .catch(error => {
                            console.error('CKEditor creation error for', editorName, ':', error);
                        });
                    
                    editorPromises.push(promise);
                });
                
                // Wait for all editors to be initialized
                Promise.all(editorPromises).then(() => {
                    window.initializationComplete = true;
                    window.isReinitializing = false;
                    // console.log('All CKEditor instances initialized');
                });
            }

            // Set up language switcher event listeners
            function initializeLanguageSwitchers() {
                // Remove existing event listeners first
                document.querySelectorAll('.lang-switch-btn').forEach(btn => {
                    // Clone node to remove all event listeners
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                });
                
                // Text input language switchers
                document.querySelectorAll('.lang-switch-btn.lang-text').forEach(button => {
                    button.addEventListener('click', handleTextSwitch);
                });
                
                // Textarea language switchers
                document.querySelectorAll('.lang-switch-btn.lang-textarea').forEach(button => {
                    button.addEventListener('click', handleTextareaSwitch);
                });
                
                // Editor language switchers
                document.querySelectorAll('.lang-switch-btn.lang-editor').forEach(button => {
                    button.addEventListener('click', handleEditorSwitch);
                });
                
                // console.log('Language switchers initialized');
            }

            // Event handlers
            function handleTextSwitch(e) {
                const currentBtn = e.target;
                const siblings = getSibilings(currentBtn);
                const fieldName = currentBtn.getAttribute('data-field-target');
                const activeLang = currentBtn.getAttribute('data-lang');
                const parent = currentBtn.parentNode.parentNode;
                
                // Update tab styling
                siblings.forEach(btn => btn.classList.remove('active', 'fi-active',
                    'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50',
                    'dark:bg-white/5', 'bg-white', 'label-translation-tab'));
                    
                currentBtn.classList.add('active', 'fi-active',
                    'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50',
                    'dark:bg-white/5', 'bg-white', 'label-translation-tab');
                
                // Update input visibility
                parent.querySelectorAll('input.multilang').forEach(input => {
                    input.style.display = 'none';
                });
                
                const activeInput = parent.querySelector(`input[name="${fieldName}[${activeLang}]"]`);
                if (activeInput) {
                    activeInput.style.display = 'block';
                }
            }

            function handleTextareaSwitch(e) {
                const currentBtn = e.target;
                const siblings = getSibilings(currentBtn);
                const fieldName = currentBtn.getAttribute('data-field-target');
                const activeLang = currentBtn.getAttribute('data-lang');
                const parent = currentBtn.parentNode.parentNode;
                
                // Update tab styling
                siblings.forEach(btn => btn.classList.remove('active', 'fi-active',
                    'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50',
                    'dark:bg-white/5', 'bg-white', 'label-translation-tab'));
                    
                currentBtn.classList.add('active', 'fi-active',
                    'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50',
                    'dark:bg-white/5', 'bg-white', 'label-translation-tab');
                
                // Update textarea visibility
                parent.querySelectorAll('textarea.multilang').forEach(textarea => {
                    textarea.style.display = 'none';
                });
                
                const activeTextarea = parent.querySelector(`textarea[name="${fieldName}[${activeLang}]"]`);
                if (activeTextarea) {
                    activeTextarea.style.display = 'block';
                }
            }

            function handleEditorSwitch(e) {
                const currentBtn = e.target;
                const siblings = getSibilings(currentBtn);
                const fieldName = currentBtn.getAttribute('data-field-target');
                const activeLang = currentBtn.getAttribute('data-lang');
                const parent = currentBtn.parentNode.parentNode;
                
                // Update tab styling
                siblings.forEach(btn => btn.classList.remove('active', 'fi-active',
                    'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50',
                    'dark:bg-white/5', 'bg-white', 'label-translation-tab'));
                    
                currentBtn.classList.add('active', 'fi-active',
                    'text-primary-600', 'fi-tabs-item-active', 'bg-gray-50',
                    'dark:bg-white/5', 'bg-white', 'label-translation-tab');
                
                // Update editor visibility
                parent.querySelectorAll('textarea.multilang ~ .ck-editor').forEach(editor => {
                    editor.style.display = 'none';
                });
                
                const activeEditor = parent.querySelector(`textarea[name="${fieldName}[${activeLang}]"] ~ .ck-editor`);
                if (activeEditor) {
                    activeEditor.style.display = 'block';
                }
            }

            // Improved function to check if reinitialization is needed
            function needsReinitialization() {
                const editorTextareas = document.querySelectorAll('.editor');
                const existingInstances = Object.keys(window.editorInstances);
                
                // console.log('Checking reinitialization need...', {
                //     textareaCount: editorTextareas.length,
                //     instanceCount: existingInstances.length,
                //     initComplete: window.initializationComplete,
                //     isReinitializing: window.isReinitializing
                // });
                
                // Don't reinitialize if already in progress
                if (window.isReinitializing) {
                    // console.log('Already reinitializing, skipping check');
                    return false;
                }
                
                // If no editors exist, no need to initialize
                if (editorTextareas.length === 0) {
                    // console.log('No editor textareas found');
                    return false;
                }
                
                // Check if number of editors changed
                if (editorTextareas.length !== existingInstances.length) {
                    // console.log('Editor count mismatch:', editorTextareas.length, 'vs', existingInstances.length);
                    return true;
                }
                
                // Check if any editor textarea exists but doesn't have a corresponding CKEditor instance
                for (let textarea of editorTextareas) {
                    const editorName = textarea.getAttribute('name');
                    const editorData = window.editorInstances[editorName];
                    
                    if (!editorData || !editorData.instance) {
                        // console.log('Missing editor instance for:', editorName);
                        return true;
                    }
                    
                    // Check if the editor instance is destroyed or invalid
                    if (editorData.instance.isDestroyed) {
                        // console.log('Editor instance destroyed for:', editorName);
                        return true;
                    }
                    
                    // Check if the CKEditor DOM is still present and properly connected
                    const editorContainer = textarea.nextElementSibling;
                    if (!editorContainer || !editorContainer.classList.contains('ck-editor')) {
                        // console.log('CKEditor DOM missing for:', editorName);
                        return true;
                    }
                    
                    // Additional check: ensure the editor container is properly attached to DOM
                    if (!document.body.contains(editorContainer)) {
                        // console.log('CKEditor container not in DOM for:', editorName);
                        return true;
                    }
                }
                
                // Check if any language switcher buttons exist but don't have event listeners
                const langButtons = document.querySelectorAll('.lang-switch-btn');
                if (langButtons.length > 0) {
                    const activeButtons = document.querySelectorAll('.lang-switch-btn.active');
                    if (activeButtons.length === 0) {
                        // console.log('No active language tabs found');
                        return true;
                    }
                }
                
                // console.log('No reinitialization needed');
                return false;
            }

            // Debounced reinitialization function
            function debouncedReinitialize(reason = 'unknown') {
                if (window.isReinitializing) {
                    // console.log('Already reinitializing, ignoring request for:', reason);
                    return;
                }
                
                if (window.reinitializationTimer) {
                    clearTimeout(window.reinitializationTimer);
                }
                
                window.reinitializationTimer = setTimeout(() => {
                    // Check if reinitialization is actually needed
                    if (!needsReinitialization()) {
                        // console.log('Skipping reinitialization - not needed. Reason was:', reason);
                        return;
                    }
                    
                    // console.log('Starting reinitialization due to:', reason);
                    window.isReinitializing = true;
                    cleanupEditors();
                    initializeMultilingualSystem();
                }, 500);
            }

            // Force reinitialization (for cache clearing and similar operations)
            function forceReinitialize(reason = 'forced') {
                // console.log('Force reinitializing due to:', reason);
                
                if (window.reinitializationTimer) {
                    clearTimeout(window.reinitializationTimer);
                }
                
                window.isReinitializing = true;
                cleanupEditors();
                
                // Wait a bit longer for DOM to settle after cache operations
                setTimeout(() => {
                    initializeMultilingualSystem();
                }, 200);
            }

            // Main initialization function
            function initializeMultilingualSystem() {
                try {
                    // console.log('Initializing multilingual system...');
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        activateLanguageTabs();
                        initializeEditors();
                        initializeLanguageSwitchers();
                    }, 100);
                } catch (error) {
                    console.error('Error initializing multilingual system:', error);
                    window.isReinitializing = false;
                }
            }

            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeMultilingualSystem);
            } else {
                initializeMultilingualSystem();
            }

            // Initialize when Livewire is ready (if using Livewire)
            document.addEventListener('livewire:initialized', function() {
                // console.log('Livewire initialized');
                setTimeout(() => {
                    if (!window.initializationComplete) {
                        initializeMultilingualSystem();
                    }
                }, 200);
            });

            // Handle Livewire navigation
            document.addEventListener('livewire:navigated', function() {
                // console.log('Livewire navigated - forcing reinitialization');
                // Reset initialization flag for new page
                forceReinitialize('livewire:navigated');
            });

            // Handle Livewire updates (this catches partial page updates)
            document.addEventListener('livewire:updated', function() {
                // console.log('Livewire updated - checking for reinitialization');
                debouncedReinitialize('livewire:updated');
            });

            // Handle Alpine.js updates (if you're using Alpine)
            document.addEventListener('alpine:updated', function() {
                // console.log('Alpine updated - checking for reinitialization');
                debouncedReinitialize('alpine:updated');
            });

            // Listen for Filament notification events (these often indicate action completion like cache clear)
            document.addEventListener('filament-notification', function() {
                // console.log('Filament notification - forcing reinitialization');
                forceReinitialize('filament-notification');
            });

            // More specific listener for when notifications are actually sent
            window.addEventListener('filament-notification-sent', function() {
                // console.log('Filament notification sent - forcing reinitialization');
                forceReinitialize('filament-notification-sent');
            });

            // Listen for when the page content is updated (more specific than generic mutations)
            let observerActive = false;
            
            function startObserver() {
                if (observerActive) return;
                observerActive = true;
                
                const observer = new MutationObserver(function(mutations) {
                    let shouldReinitialize = false;
                    let editorElementsChanged = false;
                    
                    mutations.forEach(function(mutation) {
                        // Only check for specific changes that matter
                        if (mutation.type === 'childList') {
                            const addedNodes = Array.from(mutation.addedNodes);
                            const removedNodes = Array.from(mutation.removedNodes);
                            
                            // Check if textarea.editor elements were added/removed (not CKEditor generated elements)
                            const hasTextareaChanges = [...addedNodes, ...removedNodes].some(node => {
                                if (node.nodeType !== 1) return false;
                                
                                // Look for textarea.editor elements specifically
                                return (
                                    (node.tagName === 'TEXTAREA' && node.classList.contains('editor')) ||
                                    (node.querySelector && node.querySelector('textarea.editor')) ||
                                    (node.classList && node.classList.contains('lang-switch-btn'))
                                );
                            });
                            
                            // Ignore CKEditor generated elements
                            const hasCKEditorChanges = [...addedNodes, ...removedNodes].some(node => {
                                if (node.nodeType !== 1) return false;
                                return (
                                    node.classList && (
                                        node.classList.contains('ck-editor') ||
                                        node.classList.contains('ck-toolbar') ||
                                        node.classList.contains('ck-content') ||
                                        node.classList.contains('ck-editor__editable')
                                    )
                                );
                            });
                            
                            if (hasTextareaChanges && !hasCKEditorChanges) {
                                editorElementsChanged = true;
                                shouldReinitialize = true;
                            }
                        }
                    });
                    
                    if (shouldReinitialize && editorElementsChanged) {
                        // console.log('Relevant DOM changes detected - reinitializing');
                        // Temporarily stop observer to prevent loop
                        observer.disconnect();
                        observerActive = false;
                        
                        debouncedReinitialize('dom-mutation');
                        
                        // Restart observer after initialization
                        setTimeout(() => {
                            startObserver();
                        }, 2000);
                    }
                });

                // Start observing with more specific config
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributeFilter: ['class', 'style'] // Only watch for class/style changes
                });
            }
            
            // Start the observer
            setTimeout(startObserver, 1000);

            // Final check on window load
            window.addEventListener('load', function() {
                // console.log('Window loaded - final editor visibility check');
                // Ensure editors match tab state
                setTimeout(() => {
                    document.querySelectorAll('.lang-switch-btn.lang-editor.active').forEach(button => {
                        const fieldName = button.getAttribute('data-field-target');
                        const activeLang = button.getAttribute('data-lang');
                        const parent = button.closest('.fi-field-wrapper') || button.parentNode.parentNode;
                        
                        // Hide all editors in this group
                        parent.querySelectorAll('textarea.multilang ~ .ck-editor').forEach(editor => {
                            editor.style.display = 'none';
                        });
                        
                        // Show active editor
                        const activeEditor = parent.querySelector(`textarea[name="${fieldName}[${activeLang}]"] ~ .ck-editor`);
                        if (activeEditor) {
                            activeEditor.style.display = 'block';
                        }
                    });
                }, 500);
            });
        }
    </script>
</x-filament-panels::page>