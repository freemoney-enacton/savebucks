# Technology Stack & Build System

## Core Technologies

### Admin Panel (Laravel/PHP)
- **Framework**: Laravel 10.x with PHP 8.1+
- **UI**: Filament 3.2 (admin panel framework)
- **Build System**: Vite 5.0 with Laravel Vite plugin
- **Styling**: Tailwind CSS 3.4
- **Database**: MySQL with Eloquent ORM
- **Authentication**: Laravel Sanctum
- **Additional**: OneSignal notifications, Google Translate, Redis

### API Server (Node.js/TypeScript)
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Fastify 4.28 with plugins ecosystem
- **Database**: MySQL with Kysely query builder
- **Authentication**: JWT with Passport strategies (Google, Facebook, Apple)
- **Real-time**: Socket.io for chat and notifications
- **Validation**: Zod schemas
- **Caching**: Redis with ioredis
- **Additional**: Nodemailer, OneSignal, bcrypt

### Web Frontend (Next.js/React)
- **Framework**: Next.js 14.2 with React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4 with NextUI components
- **State Management**: Recoil
- **Forms**: Formik with Yup validation
- **Internationalization**: i18next with browser detection
- **Authentication**: NextAuth 5.0 beta
- **Monitoring**: Sentry integration
- **Additional**: Framer Motion, Chart.js, Socket.io client

## Common Build Commands

### Admin Panel
```bash
cd admin
composer install                    # Install PHP dependencies
npm install                        # Install Node dependencies
cp .env.example .env               # Setup environment
php artisan key:generate           # Generate app key
php artisan migrate                # Run database migrations
php artisan serve                  # Start development server
npm run dev                        # Start Vite dev server
npm run build                      # Build for production
```

### API Server
```bash
cd api
npm install                        # Install dependencies
npm run dev                        # Start development server (port 3009)
npm start                          # Start production server (port 3003)
npm run db:migration              # Run database migrations
npm run db:codegen                # Generate database types
npm run start:cron                # Start cron jobs
```

### Web Frontend
```bash
cd web
npm install                        # Install dependencies
npm run dev                        # Start development server
npm run build                      # Build for production
npm start                          # Start production server (port 3002)
npm run lint                       # Run ESLint
```

## Database & Infrastructure
- **Primary Database**: MySQL
- **Caching**: Redis
- **File Storage**: Local/cloud storage for media
- **Email**: Nodemailer with SMTP
- **Push Notifications**: OneSignal
- **Monitoring**: Sentry (web frontend)

## Development Tools
- **PHP**: Laravel Pint (code formatting), PHPUnit (testing)
- **TypeScript**: ESLint, Prettier
- **Database**: Kysely codegen for type-safe queries
- **Version Control**: Git with conventional commits (feat:, fix:, chore:)