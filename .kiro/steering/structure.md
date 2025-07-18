# Project Structure & Organization

## Monorepo Layout
```
/
├── admin/           # Laravel Filament admin panel
├── api/             # Fastify API server
├── web/             # Next.js web frontend
├── chat-client/     # Static HTML chat prototype
└── packages/        # Shared packages (referenced in composer.json)
```

## Admin Panel Structure (Laravel)
```
admin/
├── app/
│   ├── Filament/           # Filament admin resources, pages, widgets
│   ├── Models/             # Eloquent models (User, Offer, Payment, etc.)
│   ├── Http/Controllers/   # HTTP controllers
│   ├── Services/           # Business logic services
│   ├── Jobs/               # Queue jobs (email, exports, translations)
│   ├── Mail/               # Email templates
│   ├── Policies/           # Authorization policies
│   ├── Enums/              # PHP enums for status types
│   └── Observers/          # Model observers
├── database/migrations/    # Database schema migrations
├── resources/
│   ├── views/              # Blade templates
│   ├── css/                # Stylesheets (Tailwind)
│   └── js/                 # Frontend assets
└── config/                 # Laravel configuration files
```

## API Server Structure (Fastify)
```
api/
├── src/
│   ├── modules/            # Feature modules (auth, payments, chat, etc.)
│   │   ├── auth/           # Authentication routes & logic
│   │   ├── payments/       # Payment processing
│   │   ├── chat/           # Real-time chat functionality
│   │   └── [feature]/      # Other business modules
│   ├── database/
│   │   ├── migrations/     # Database migrations
│   │   └── seeds/          # Database seeders
│   ├── middleware/         # Authentication & validation middleware
│   ├── utils/              # Shared utilities
│   ├── crons/              # Scheduled tasks
│   └── plugins/            # Fastify plugins
├── server.ts               # Main server entry point
└── tsconfig.json           # TypeScript configuration
```

## Web Frontend Structure (Next.js)
```
web/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth-routes)/  # Authentication pages
│   │   ├── (main-routes)/  # Main application pages
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── Core/           # Core UI components
│   │   ├── Generic/        # Reusable components
│   │   └── Layouts/        # Layout components
│   ├── Hook/               # Custom React hooks
│   │   └── Api/            # API-related hooks
│   ├── recoil/             # State management (atoms)
│   ├── i18n/               # Internationalization
│   ├── translations/       # Translation files
│   └── Type/               # TypeScript type definitions
├── public/                 # Static assets
└── tailwind.config.ts      # Tailwind configuration
```

## Key Architectural Patterns

### Admin Panel (Laravel)
- **MVC Pattern**: Controllers, Models, Views (Blade templates)
- **Repository Pattern**: Service classes for business logic
- **Observer Pattern**: Model observers for side effects
- **Policy-based Authorization**: Filament policies for access control
- **Queue Jobs**: Background processing for heavy tasks

### API Server (Fastify)
- **Modular Architecture**: Feature-based modules
- **Plugin System**: Fastify plugins for extensibility
- **Middleware Chain**: Authentication, validation, logging
- **Event-Driven**: Event bus for decoupled communication
- **Type-Safe Queries**: Kysely for database operations

### Web Frontend (Next.js)
- **App Router**: File-based routing with layouts
- **Component Composition**: Reusable UI components
- **Custom Hooks**: Logic encapsulation and reuse
- **State Management**: Recoil for global state
- **Route Groups**: Organized by authentication/layout requirements

## Database Schema Organization
- **Users & Authentication**: User accounts, sessions, permissions
- **Offers & Campaigns**: Cashback offers, affiliate networks
- **Transactions**: Sales, earnings, payments, bonuses
- **Content Management**: Pages, banners, translations
- **Gamification**: Leaderboards, streaks, daily bonuses
- **Communication**: Chat rooms, notifications, messages

## Environment Configuration
- Each application has its own `.env` file
- Shared database and Redis connections
- API endpoints configured in web frontend
- OneSignal keys for push notifications
- Payment gateway credentials (PayPal, etc.)