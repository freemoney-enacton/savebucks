# API Application Guide

This file explains the internal structure and guidelines for the Fastify API.

## Architecture Overview

The API initializes a Fastify instance in `src/app.ts` and loads feature modules via Fastify plugins. TypeScript is used throughout the codebase.

## Component Breakdown

- **modules/** – Contains route handlers grouped by feature.
- **service/** – Houses business logic and external integrations.
- **plugins/** – Custom Fastify plugins and shared functionality.

## Data Flow

Incoming requests enter through Fastify routes, pass through middleware and reach controllers. Controllers delegate to services which communicate with the database using Kysely or other query builders.

## Security Considerations

- Authentication is implemented with Fastify Passport and JWT.
- Rate limiting and helmet are enabled for basic protection.
- Secrets are loaded from environment variables.

## Performance Optimization

- Leverage Fastify's plugin architecture for lightweight routes.
- Use connection pooling for database access and enable caching where possible.

## Testing Strategy

Write unit tests for services and integration tests for routes using your preferred framework (e.g., Tap or Jest).

## Known Issues & Limitations

None at this time. Document future issues here.

