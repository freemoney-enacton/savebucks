# SaveBucks Development Guide

This document provides conventions and architectural notes for working with the SaveBucks monorepo. Use it as a reference when contributing to any of the contained applications.


## Steering Documentation
For detailed technical guidance, refer to the comprehensive steering documents in `.kiro/steering/`:
- `admin-guide.md` - Laravel Filament admin panel development
- `api-guide.md` - Fastify API server development  
- `web-guide.md` - Next.js web frontend development
- `database-guide.md` - Database design and migration patterns
- `integration-guide.md` - Inter-service communication patterns


## Architectural Overview

The repository consists of three primary applications:

1. **Admin** – Laravel Filament application used for back‑office management.
2. **API** – Fastify/TypeScript server exposing REST and socket endpoints.
3. **Web** – Next.js React frontend consumed by end users.

Applications communicate mainly through the API layer. Keep services decoupled and use environment variables for configuration.

## Coding Standards

- **PHP**: Follow [PSR‑12](https://www.php-fig.org/psr/psr-12/). Laravel facades should be type‑hinted and service classes injected via the container.
- **Node/TypeScript**: Use async/await, keep modules small and focused, and prefer Fastify plugins for extensibility.
- **React**: Utilize functional components and hooks. Keep styling in Tailwind CSS classes.

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

- Avoid raw SQL queries; rely on an ORM (Eloquent, Kysely) or query builder.
- Never hardcode secrets—use environment variables.
- Do not use inline styles; prefer Tailwind CSS or component styling.

## To‑Dos

- Set up comprehensive logging for all applications.
- Configure CI/CD pipelines for automated testing and deployment.
- Ensure that every API endpoint is properly authenticated.

## Best Practices

- Apply SOLID and DRY principles when structuring code.
- Write unit tests for business logic and integration tests for critical flows.
- Document new modules and keep this guide up to date.

