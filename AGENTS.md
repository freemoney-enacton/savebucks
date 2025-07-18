# SaveBucks Development Guide

This document provides conventions and architectural notes for working with the SaveBucks monorepo. Use it as a reference when contributing to any of the contained applications in the comprehensive cashback and affiliate marketing platform.


## Steering Documentation
For detailed technical guidance, refer to the comprehensive steering documents in `.kiro/steering/`:
- `admin-guide.md` - Laravel Filament admin panel development (includes affiliate management)
- `api-guide.md` - Fastify API server development  
- `web-guide.md` - Next.js web frontend development
- `affiliate-guide.md` - Next.js affiliate panel development
- `database-guide.md` - Database design and migration patterns (MySQL + PostgreSQL)
- `integration-guide.md` - Inter-service communication patterns


## Architectural Overview

The repository consists of four primary applications:

1. **Admin** – Laravel Filament application used for back‑office management, including comprehensive affiliate management features.
2. **API** – Fastify/TypeScript server exposing REST and socket endpoints for core platform functionality.
3. **Web** – Next.js React frontend consumed by end users for cashback rewards.
4. **Affiliate Panel** – Next.js React application providing affiliates with campaign management, link generation, commission tracking, and payout capabilities.

Applications communicate through multiple layers: the API server for core functionality, direct database connections for the affiliate panel (PostgreSQL), and shared services. Keep services decoupled and use environment variables for configuration.

## Coding Standards

- **PHP**: Follow [PSR‑12](https://www.php-fig.org/psr/psr-12/). Laravel facades should be type‑hinted and service classes injected via the container.
- **Node/TypeScript**: Use async/await, keep modules small and focused, and prefer Fastify plugins for extensibility.
- **React**: Utilize functional components and hooks. Keep styling in Tailwind CSS classes.
- **Affiliate Panel**: Use TypeScript throughout, Drizzle ORM for type-safe database operations, Formik + Yup for form validation, and Radix UI components for accessibility.

## Commit Messages

Use the conventional commit style:

```
feat: short description of a new feature
fix: short description of a bug fix
chore: routine maintenance
```

## Branching Strategy

- Work from `main` for production releases.
- Feature branches use the prefix `feature/` and bug fixes use `fix/`.
- Submit pull requests for review before merging.

## Guardrails

- Avoid raw SQL queries; rely on an ORM (Eloquent for Laravel, Drizzle for affiliate panel) or query builder.
- Never hardcode secrets—use environment variables.
- Do not use inline styles; prefer Tailwind CSS or component styling.
- Always validate affiliate permissions and approval status before allowing access to sensitive operations.
- Use database transactions for multi-step operations, especially in affiliate payouts and conversions.
- Implement proper rate limiting on affiliate panel API endpoints to prevent abuse.

## To‑Dos

- Set up comprehensive logging for all applications.
- Configure CI/CD pipelines for automated testing and deployment.
- Ensure that every API endpoint is properly authenticated.
- Implement comprehensive affiliate fraud detection and prevention measures.
- Set up automated affiliate payout processing with PayPal integration.
- Create affiliate onboarding workflow with email verification and approval process.
- Implement real-time affiliate performance analytics and reporting.
- Set up affiliate postback URL validation and testing tools.

## Best Practices

- Apply SOLID and DRY principles when structuring code.
- Write unit tests for business logic and integration tests for critical flows.
- Document new modules and keep this guide up to date.

