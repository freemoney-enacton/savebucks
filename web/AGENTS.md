# Web Application Guide

This guide outlines architecture and conventions for the Next.js frontend.

## Architecture Overview

The project uses the Next.js App Router with React components organized under `src/`. Styling relies on Tailwind CSS and components from NextUI.

## Component Breakdown

- **app/** – Route definitions and page layouts.
- **components/** – Shared UI components.
- **lib/** – Helpers for API access and utilities.

## Data Flow

Pages and components fetch data from the Fastify API using fetch or specialized client libraries. State is managed with React hooks and context.

## Security Considerations

- Environment variables are loaded from `.env.local`.
- Avoid exposing secrets to the client; only safe variables prefixed with `NEXT_PUBLIC_` should be used.

## Performance Optimization

- Use Next.js dynamic imports and caching strategies.
- Optimize images with the built-in `next/image` component.

## Testing Strategy

Unit test components with Jest and React Testing Library. End-to-end tests can be written with Playwright or Cypress.

## Known Issues & Limitations

No major issues recorded.

