# Admin Application

The Admin app is a Laravel Filament project that provides an interface for managing users, offers and platform configuration.

## Setup Instructions

1. Install PHP dependencies:
   ```bash
   composer install
   ```
2. Copy the example environment file and generate an application key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
3. Run database migrations and seeders as required:
   ```bash
   php artisan migrate --seed
   ```
4. Start the local development server:
   ```bash
   php artisan serve
   ```

## Application Structure

```
app/        # Controllers, models and Filament resources
config/     # Application configuration
resources/  # Blade templates and assets
routes/     # Route definitions
```

## Key Features

- **Filament** dashboard for a consistent admin UI.
- Eloquent ORM for all database interactions.
- Policies and permissions via Filament Shield.

## Best Practices

- Follow PSR-12 coding style.
- Use Laravel validation and centralized error handling.
- Apply middleware to protect routes and filter requests.

## Deployment

1. Run `composer install --no-dev --optimize-autoloader`.
2. Execute `php artisan migrate --force`.
3. Point the web server document root to the `public/` directory.

