# Web Application

The Web app is built with Next.js and React to deliver a responsive user interface.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables as required in `.env.local`.
3. Start the development server:
   ```bash
   npm run dev
   ```

## Application Structure

```
src/
  app/         # Next.js App Router and pages
  components/  # Reusable React components
  lib/         # Utilities and helpers
```

## Key Features

- Server-side rendering and static generation with Next.js.
- React components styled with Tailwind CSS.
- State management using React context and hooks.

## Best Practices

- Prefer functional components and custom hooks.
- Keep styling in Tailwind classes or CSS modules.
- Ensure layouts are responsive across devices.

## Deployment

Build the application and start in production mode:

```bash
npm run build
npm start
```

