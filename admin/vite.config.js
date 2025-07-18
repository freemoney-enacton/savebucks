import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/input.css",
                "resources/js/app.js",
                "resources/css/filament/admin/theme.css",
            ],
            refresh: true,
        }),
    ],
    content: [
        "./vendor/awcodes/filament-curator/resources/**/*.blade.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.vue",
        "./resources/**/*.js",
        "./resources/**/*.blade.php",
        "./vendor/filament/**/*.blade.php",
        "./vendor/danharrin/filament-blog/resources/views/**/*.blade.php",
    ],
});
