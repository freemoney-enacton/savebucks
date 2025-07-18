# SaveBucks Monorepo

SaveBucks is a comprehensive cashback and affiliate marketing platform consisting of four interconnected applications:

- **Admin** – Laravel Filament PHP application providing the administrative interface for managing users, offers, campaigns, affiliates, and platform settings.
- **API** – Fastify Node application exposing REST endpoints and real-time services for core platform functionality.
- **Web** – Next.js React application serving the customer-facing website for cashback rewards.
- **Affiliate Panel** – Next.js React application providing affiliates with campaign management, link generation, commission tracking, and payout capabilities.

This monorepo consolidates development and deployment of all services in the SaveBucks ecosystem.

## Architecture Diagram

```text
+---------+       HTTP      +-------+       PostgreSQL    +----------------+
|  Web    | <------------> |  API  | <----------------> | Affiliate      |
+---------+                 +-------+                     | Panel          |
     ^                           ^                        +----------------+
     |                           |                               ^
     |   Admin actions via API   |                               |
     +-------->+---------+<------+                               |
               | Admin   |                                       |
               +---------+                                       |
                    |                                            |
                    |         Affiliate Management               |
                    +--------------------------------------------+
```

## Technologies Used

- **Backend**: PHP 8 / Laravel / Filament
- **API Server**: Node.js / Fastify / TypeScript
- **Frontend**: React / Next.js / Tailwind CSS
- **Databases**: MySQL (core platform), PostgreSQL (affiliate panel)
- **Additional**: Redis, Drizzle ORM, NextAuth, Radix UI

## Folder Structure Overview

```
/ (repo root)
├── admin           # Laravel Filament application
├── api             # Fastify API server
├── web             # Next.js web frontend
├── affiliate-panel # Next.js affiliate portal
└── chat-client     # Static chat prototype (HTML)
```

## Getting Started

### Prerequisites

- **PHP** >= 8.1 with Composer
- **Node.js** >= 18
- **MySQL** for core platform database
- **PostgreSQL** for affiliate panel database
- **Redis** for caching and sessions

### Installation

Clone the repository and install each application’s dependencies:

```bash
# Admin
cd admin
composer install
cp .env.example .env
php artisan key:generate

# API
cd ../api
npm install

# Web
cd ../web
npm install

# Affiliate Panel
cd ../affiliate-panel
npm install
cp .env.example .env
npm run migrate
```

### Running Locally

```bash
# Admin (port 8000)
cd admin
php artisan serve

# API (port 3003)
cd api
npm run dev

# Web (port 3000)
cd web
npm run dev

# Affiliate Panel (port 3001)
cd affiliate-panel
npm run dev
```

## Development Guidelines

- Follow PSR-12 for PHP code and ESLint/Prettier rules for JavaScript/TypeScript.
- Use clear commit messages (`feat:`, `fix:`, etc.) and create pull requests for all changes.
- Main development occurs on `main`; feature branches follow the pattern `feature/<name>`.

## Deployment Instructions

Each application can be deployed independently.

- **Admin**: run database migrations and configure the web server to point to the `public/` directory.
- **API**: build or run with `ts-node`, configure environment variables and reverse proxy (e.g., Nginx).
- **Web**: execute `npm run build` then serve with `next start` or export as static assets.
- **Affiliate Panel**: run `npm run build` and `npm start`, ensure PostgreSQL database is configured and migrations are run.

## Contributing

1. Fork the repository and create a feature branch.
2. Follow coding standards and ensure no sensitive data is committed.
3. Open a pull request describing your changes.

