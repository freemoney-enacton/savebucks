# SaveBucks Affiliate Panel

The Affiliate Panel is a Next.js application that provides affiliates with comprehensive tools for campaign management, link generation, commission tracking, and payout management within the SaveBucks affiliate marketing platform.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the example environment file and configure variables:
   ```bash
   cp .env.example .env
   ```

3. Set up the PostgreSQL database and run migrations:
   ```bash
   npm run migrate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. (Optional) Open Drizzle Studio for database management:
   ```bash
   npm run studio
   ```

## Application Structure

```
affiliate-panel/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected affiliate pages
│   ├── (public)/          # Public pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layouts/           # Layout components
│   ├── links/             # Link management components
│   ├── payouts/           # Payout management components
│   ├── settings/          # Settings components
│   ├── transactions/      # Transaction components
│   └── ui/                # Generic UI components (Radix UI)
├── db/                    # Database layer
│   ├── schema.ts          # Drizzle schema definitions
│   ├── index.ts           # Database connection
│   └── migration.ts       # Migration runner
├── hooks/                 # Custom React hooks
├── i18n/                  # Internationalization
├── models/                # Data models and API functions
├── services/              # Business logic services
├── utils/                 # Utility functions
└── crons/                 # Scheduled tasks
```

## Key Features

- **Campaign Management** – Browse and join available affiliate campaigns
- **Link Generation** – Create and manage custom affiliate tracking links
- **Performance Analytics** – Real-time dashboard with earnings, clicks, and conversion metrics
- **Commission Tracking** – Detailed transaction history and conversion reporting
- **Payout Management** – Request and track affiliate payouts via PayPal
- **Multi-language Support** – Internationalization with next-intl
- **Responsive Design** – Mobile-first design with Tailwind CSS and Radix UI
- **Type Safety** – Full TypeScript coverage with Drizzle ORM

## Technology Stack

- **Framework**: Next.js 14.2 with App Router
- **Language**: TypeScript 5.2
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 3.3 with Radix UI components
- **Forms**: Formik with Yup validation
- **Authentication**: NextAuth 5.0 beta
- **Charts**: Recharts for analytics visualization
- **Internationalization**: next-intl with i18next
- **Icons**: Lucide React
- **Additional**: bcrypt, crypto-js, date-fns, moment

## Environment Configuration

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/affiliate_panel

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
AUTH_SECRET=your-auth-secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# PayPal (for payouts)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Available Scripts

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm start                      # Start production server
npm run lint                   # Run ESLint

# Database
npm run migrate                # Run database migrations
npm run studio                 # Open Drizzle Studio
npm run db:push                # Push schema changes to database

# Utilities
npm run crons                  # Start cron jobs
npm run type-check             # Check TypeScript types
```

## Best Practices

- Use TypeScript for all components and functions
- Implement proper error boundaries and loading states
- Use Drizzle ORM for type-safe database operations
- Implement proper form validation with Formik and Yup
- Use NextAuth for secure authentication
- Implement proper authorization checks
- Use Radix UI components for accessibility
- Write comprehensive API error handling
- Use environment variables for configuration

## Security Considerations

- All affiliate data is validated and sanitized
- Authentication required for all protected routes
- Rate limiting implemented on API endpoints
- Secure password hashing with bcrypt
- CSRF protection enabled
- Proper session management with NextAuth

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Ensure PostgreSQL database is configured and accessible

3. Run database migrations:
   ```bash
   npm run migrate
   ```

4. Start the production server:
   ```bash
   npm start
   ```

5. Configure reverse proxy (nginx) and SSL certificates for production

## Integration

The Affiliate Panel integrates with:

- **Admin Panel** – Managed through Laravel Filament for affiliate approvals and campaign management
- **Core Platform** – Shares user authentication and campaign data
- **PayPal API** – For automated payout processing
- **Email Service** – For notifications and communications

## Support

For technical support or questions about the affiliate panel, refer to the comprehensive documentation in `.kiro/steering/affiliate-guide.md` or contact the development team.