/** @type {import('tailwindcss').Config} */
import defaultPreset from "./vendor/filament/filament/tailwind.config.preset";

export default {
    presets: [defaultPreset],
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
        "./resources/**/*.blade.php",
        "./vendor/filament/**/*.blade.php",
        "./vendor/danharrin/filament-blog/resources/views/**/*.blade.php",
        "./vendor/kenepa/translation-manager/resources/**/*.blade.php",
    ],
    theme: {
        extend: {
            colors: {
                // amber: {
                //     DEFAULT: '"#d97706"',
                // },
            },
        },
    },
    plugins: [],
};
