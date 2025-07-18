# Affiliate Panel Development Guide

This guide outlines architecture, conventions, and best practices for the SaveBucks Affiliate Panel built with Next.js, TypeScript, and PostgreSQL.

## Architecture Overview

The affiliate panel follows a modern Next.js App Router architecture with server-side rendering, type-safe database operations using Drizzle ORM, and component-based UI design with Radix UI. The application is designed for high performance, security, and scalability.

### Core Principles

- **Database-First**: PostgreSQL with Drizzle ORM for type-safe operations
- **Component-First**: Reusable, accessible UI components with Radix UI
- **Type Safety**: Full TypeScript coverage throughout the application
- **Security**: Secure authentication, authorization, and data protection
- **Performance**: Optimized for affiliate dashboard analytics and reporting
- **Accessibility**: WCAG 2.1 AA compliance with Radix UI components

## Component Breakdown

### Application Structure

- **app/** – Next.js App Router with route groups for organization
  - **(auth)/** – Authentication pages (signin, signup, forgot password)
  - **(protected)/** – Protected affiliate dashboard pages
  - **(public)/** – Public pages (terms, privacy policy)
  - **api/** – API routes for server-side operations

- **components/** – Organized by feature and reusability
  - **dashboard/** – Dashboard-specific components (stats, charts)
  - **layouts/** – Layout components (header, sidebar, footer)
  - **links/** – Link management components (generator, list, analytics)
  - **payouts/** – Payout management components (request, history)
  - **settings/** – Settings components (profile, payment methods)
  - **transactions/** – Transaction components (history, details)
  - **ui/** – Generic UI components based on Radix UI

- **db/** – Database layer with Drizzle ORM
  - **schema.ts** – Complete PostgreSQL schema definitions
  - **index.ts** – Database connection and configuration
  - **migration.ts** – Migration runner and utilities

- **models/** – Data access layer organized by entity
  - **affiliates-model/** – Affiliate CRUD operations
  - **campaigns-model/** – Campaign data access
  - **conversions-model/** – Conversion tracking
  - **payouts-model/** – Payout management

## Data Flow

### Authentication Flow
1. User submits credentials via NextAuth
2. Credentials validated against PostgreSQL affiliates table
3. JWT token generated and stored in secure HTTP-only cookies
4. Middleware validates tokens on protected routes
5. Session data available throughout the application

### Dashboard Data Flow
1. Protected pages fetch data via API routes
2. API routes use Drizzle ORM for type-safe database queries
3. Data aggregated and formatted for dashboard components
4. Real-time updates via periodic polling or WebSocket connections
5. Charts and analytics rendered with Recharts

### Link Generation Flow
1. Affiliate selects campaign and configures link parameters
2. Form validation with Formik and Yup schemas
3. Unique slug generated and stored in database
4. Tracking link created with affiliate and campaign identifiers
5. Link analytics tracked via click events and conversions

## Security Considerations

### Authentication & Authorization
- NextAuth 5.0 with secure JWT tokens
- HTTP-only cookies for session management
- Middleware-based route protection
- Role-based access control for affiliate features
- Email verification required for account activation
- Admin approval required for affiliate access

### Data Protection
- All user inputs validated and sanitized
- SQL injection prevention with Drizzle ORM
- XSS protection with proper output encoding
- CSRF protection enabled by default
- Rate limiting on API endpoints with Upstash Redis
- Secure password hashing with bcrypt

### API Security
- Authentication required for all protected endpoints
- Input validation with Zod schemas
- Error handling without sensitive data exposure
- Proper HTTP status codes and error messages
- Request logging for audit trails

## Performance Optimization

### Database Performance
- Proper indexing on frequently queried columns
- Connection pooling with PostgreSQL
- Query optimization with Drizzle ORM
- Database transactions for data consistency
- Pagination for large result sets

### Frontend Performance
- Next.js App Router with server-side rendering
- Dynamic imports for code splitting
- Image optimization with next/image
- Caching strategies for API responses
- Lazy loading for dashboard components

### Monitoring & Analytics
- Performance monitoring with Core Web Vitals
- Error tracking and logging
- Database query performance monitoring
- API response time tracking
- User interaction analytics

## Testing Strategy

### Unit Testing
- Component testing with Jest and React Testing Library
- Model testing for database operations
- Utility function testing
- API route testing with mocked dependencies

### Integration Testing
- Authentication flow testing
- Database integration testing
- API endpoint testing
- Form submission testing

### End-to-End Testing
- Critical user journeys (signup, login, link generation)
- Payment flow testing
- Dashboard functionality testing
- Cross-browser compatibility testing

## Development Workflow

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Conventional commits for version control
- Code reviews required for all changes

### Database Management
- Drizzle migrations for schema changes
- Database seeding for development data
- Backup and recovery procedures
- Performance monitoring and optimization

### Deployment Pipeline
- Automated testing on pull requests
- Staging environment for testing
- Production deployment with zero downtime
- Database migration automation
- Environment-specific configuration

## Known Issues & Limitations

### Current Limitations
- PayPal integration limited to sandbox mode in development
- Real-time notifications require polling (WebSocket implementation planned)
- Bulk operations limited to prevent performance issues
- File uploads limited to specific formats and sizes

### Planned Improvements
- Real-time dashboard updates with WebSocket connections
- Advanced analytics with custom date ranges
- Bulk link management operations
- Mobile app for affiliate management
- Advanced fraud detection and prevention

## Integration Points

### Admin Panel Integration
- Affiliate approval workflow managed in Laravel admin
- Campaign management and configuration
- Payout processing and approval
- Performance monitoring and reporting

### Core Platform Integration
- Shared authentication with main platform
- Campaign data synchronization
- User profile integration
- Cross-platform analytics

### External Services
- PayPal API for payout processing
- Email service for notifications
- Redis for caching and rate limiting
- Analytics services for tracking

## Troubleshooting

### Common Issues
- Database connection errors: Check DATABASE_URL configuration
- Authentication failures: Verify NextAuth configuration and secrets
- Migration errors: Ensure database permissions and connectivity
- Build errors: Check TypeScript types and dependencies

### Debug Tools
- Drizzle Studio for database inspection
- Next.js development tools
- Browser developer tools for frontend debugging
- Database query logging for performance analysis

## Best Practices Summary

### DO:
- Use TypeScript for all code
- Implement proper error handling
- Validate all inputs
- Use transactions for multi-step operations
- Log important operations
- Test critical functionality
- Follow security best practices
- Document complex logic

### DON'T:
- Skip input validation
- Store sensitive data in client-side storage
- Use `any` type in TypeScript
- Skip error handling
- Hardcode configuration values
- Skip authentication checks
- Ignore accessibility requirements
- Skip database transactions

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [NextAuth Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

For detailed implementation examples and advanced patterns, refer to the comprehensive steering documentation in `.kiro/steering/affiliate-guide.md`.