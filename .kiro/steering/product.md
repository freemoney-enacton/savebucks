# SaveBucks Product Overview

SaveBucks is a cashback and rewards platform consisting of three interconnected applications:

- **Admin Panel** - Laravel Filament-based administrative interface for managing users, offers, cashback campaigns, and platform settings
- **API Server** - Fastify-based REST API and real-time services handling user authentication, transactions, notifications, and business logic
- **Web Frontend** - Next.js React application providing the customer-facing experience for earning and redeeming cashback rewards

The platform enables users to earn cashback through various activities and offers, with real-time notifications and comprehensive admin management capabilities. The architecture follows a decoupled approach where the web frontend and admin panel communicate through the centralized API server.