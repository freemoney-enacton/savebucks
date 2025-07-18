# SaveBucks Monorepo

SaveBucks is a multi-application repository containing three core projects:

- **Admin** – Laravel Filament PHP application providing the administrative interface.
- **API** – Fastify Node application exposing REST endpoints and real-time services.
- **Web** – Next.js React application serving the customer-facing website.

This monorepo aims to consolidate development and deployment of all services.

## Architecture Diagram

```text
+---------+       HTTP      +-------+
|  Web    | <------------> |  API  |
+---------+                 +-------+
     ^                           ^
     |                           |
     |   Admin actions via API   |
     +-------->+---------+<------+
               | Admin   |
               +---------+
```

## Technologies Used

- PHP 8 / Laravel / Filament
- Node.js / Fastify / TypeScript
- React / Next.js / Tailwind CSS
- MySQL, Redis and other supporting services

## Folder Structure Overview

```
/ (repo root)
├── admin        # Laravel Filament application
├── api          # Fastify API server
├── web          # Next.js web frontend
└── chat-client  # Static chat prototype (HTML)
```

## Getting Started

### Prerequisites

- **PHP** >= 8.1 with Composer
- **Node.js** >= 18
- MySQL or compatible database server

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
```

### Running Locally

```
# Admin
php artisan serve

# API
npm run dev

# Web
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

## Contributing

1. Fork the repository and create a feature branch.
2. Follow coding standards and ensure no sensitive data is committed.
3. Open a pull request describing your changes.

