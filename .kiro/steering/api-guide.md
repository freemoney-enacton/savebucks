rver is built with Fastify 4.28 and TypeScript, following a modular architecture with feature-based organization. It serves as the central communication hub between the admin panel and web frontend.

### Core Principles

- **Modular Design**: Feature-based modules with clear boundaries
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Plugin Architecture**: Extensible through Fastify plugins
- **Event-Driven**: Decoupled communication via event bus
- **Performance First**: Optimized for high throughput and low latency

## Project Structure

```
api/src/
├── modules/              # Feature modules
│   ├── auth/            # Authentication & authorization
│   ├── users/           # User management
│   ├── offers/          # Offer management
│   ├── payments/        # Payment processing
│   └── chat/            # Real-time chat
├── database/            # Database layer
├── middleware/          # Request middleware
├── utils/               # Shared utilities
├── plugins/             # Fastify plugins
├── events/              # Event system
└── config/              # Configuration
```

## Module Structure

Each module follows a consistent structure:

```
modules/auth/
├── routes.ts            # Route definitions
├── handlers.ts          # Route handlers
├── schemas.ts           # Zod validation schemas
├── services.ts          # Business logic
├── types.ts             # TypeScript types
└── tests/               # Module tests
```

### Example Module Implementation

**`modules/auth/schemas.ts`**

```typescript
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional().default(false),
});

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number"
    ),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenSchema>;
```

**`modules/auth/services.ts`**

```typescript
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Database } from "../database/database";
import { LoginRequest, RegisterRequest } from "./schemas";
import { EventBus } from "../events/eventBus";
import { Events } from "../events/Events";

export class AuthService {
  constructor(private db: Database, private eventBus: EventBus) {}

  async login(data: LoginRequest): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
  }> {
    // Find user by email
    const user = await this.db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", data.email)
      .where("status", "=", "active")
      .executeTakeFirst();

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Update last login
    await this.db
      .updateTable("users")
      .set({
        lastLoginAt: new Date(),
        lastLoginIp: this.getClientIp(),
      })
      .where("id", "=", user.id)
      .execute();

    // Emit login event
    this.eventBus.emit(Events.USER_LOGGED_IN, {
      userId: user.id,
      email: user.email,
      timestamp: new Date(),
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async register(data: RegisterRequest): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
  }> {
    // Check if user already exists
    const existingUser = await this.db
      .selectFrom("users")
      .select("id")
      .where("email", "=", data.email)
      .executeTakeFirst();

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const userId = await this.db
      .insertInto("users")
      .values({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        referralCode: data.referralCode,
        status: "active",
        createdAt: new Date(),
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    const user = await this.db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", userId.id)
      .executeTakeFirstOrThrow();

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Emit registration event
    this.eventBus.emit(Events.USER_REGISTERED, {
      userId: user.id,
      email: user.email,
      referralCode: data.referralCode,
      timestamp: new Date(),
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: "access",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
  }

  private generateRefreshToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        type: "refresh",
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  private getClientIp(): string {
    // Implementation to get client IP
    return "127.0.0.1";
  }
}
```

**`modules/auth/handlers.ts`**

```typescript
import { FastifyRequest, FastifyReply } from "fastify";
import { LoginRequest, RegisterRequest, RefreshTokenRequest } from "./schemas";
import { AuthService } from "./services";
import { sendResponse } from "../../utils/sendResponse";

export class AuthHandlers {
  constructor(private authService: AuthService) {}

  async login(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
  ) {
    try {
      const result = await this.authService.login(request.body);

      return sendResponse(reply, {
        success: true,
        data: result,
        message: "Login successful",
      });
    } catch (error) {
      request.log.error("Login failed", {
        email: request.body.email,
        error: error.message,
      });

      return sendResponse(reply, {
        success: false,
        message: error.message,
        statusCode: 401,
      });
    }
  }

  async register(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply
  ) {
    try {
      const result = await this.authService.register(request.body);

      return sendResponse(reply, {
        success: true,
        data: result,
        message: "Registration successful",
        statusCode: 201,
      });
    } catch (error) {
      request.log.error("Registration failed", {
        email: request.body.email,
        error: error.message,
      });

      return sendResponse(reply, {
        success: false,
        message: error.message,
        statusCode: 400,
      });
    }
  }

  async refreshToken(
    request: FastifyRequest<{ Body: RefreshTokenRequest }>,
    reply: FastifyReply
  ) {
    try {
      const result = await this.authService.refreshToken(
        request.body.refreshToken
      );

      return sendResponse(reply, {
        success: true,
        data: result,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      return sendResponse(reply, {
        success: false,
        message: "Invalid refresh token",
        statusCode: 401,
      });
    }
  }
}
```

**`modules/auth/routes.ts`**

```typescript
import { FastifyInstance } from "fastify";
import { LoginSchema, RegisterSchema, RefreshTokenSchema } from "./schemas";
import { AuthHandlers } from "./handlers";
import { AuthService } from "./services";

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify.db, fastify.eventBus);
  const authHandlers = new AuthHandlers(authService);

  // Login endpoint
  fastify.post(
    "/login",
    {
      schema: {
        body: LoginSchema,
        tags: ["Authentication"],
        summary: "User login",
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  user: { type: "object" },
                  accessToken: { type: "string" },
                  refreshToken: { type: "string" },
                },
              },
              message: { type: "string" },
            },
          },
        },
      },
    },
    authHandlers.login.bind(authHandlers)
  );

  // Register endpoint
  fastify.post(
    "/register",
    {
      schema: {
        body: RegisterSchema,
        tags: ["Authentication"],
        summary: "User registration",
      },
    },
    authHandlers.register.bind(authHandlers)
  );

  // Refresh token endpoint
  fastify.post(
    "/refresh",
    {
      schema: {
        body: RefreshTokenSchema,
        tags: ["Authentication"],
        summary: "Refresh access token",
      },
    },
    authHandlers.refreshToken.bind(authHandlers)
  );

  // Logout endpoint
  fastify.post(
    "/logout",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Authentication"],
        summary: "User logout",
      },
    },
    async (request, reply) => {
      // Implement logout logic (blacklist token, etc.)
      return { success: true, message: "Logged out successfully" };
    }
  );
}
```

## Database Layer

**`database/database.ts`**

```typescript
import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { DB } from "./db"; // Generated types

export class Database {
  private static instance: Kysely<DB>;

  static getInstance(): Kysely<DB> {
    if (!Database.instance) {
      const dialect = new MysqlDialect({
        pool: createPool({
          database: process.env.DB_DATABASE,
          host: process.env.DB_HOST,
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          port: parseInt(process.env.DB_PORT || "3306"),
          connectionLimit: 10,
        }),
      });

      Database.instance = new Kysely<DB>({
        dialect,
        log: (event) => {
          if (event.level === "query") {
            console.log("Query:", event.query.sql);
            console.log("Parameters:", event.query.parameters);
          }
        },
      });
    }

    return Database.instance;
  }
}
```

## Middleware

**`middleware/authMiddleware.ts`**

```typescript
import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      userId: number;
      email: string;
    };
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({
        success: false,
        message: "Authorization token required",
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.type !== "access") {
      return reply.status(401).send({
        success: false,
        message: "Invalid token type",
      });
    }

    request.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
```

## Event System

**`events/eventBus.ts`**

```typescript
import { EventEmitter } from "events";

export class EventBus extends EventEmitter {
  private static instance: EventBus;

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  emit(event: string, data: any): boolean {
    console.log(`Event emitted: ${event}`, data);
    return super.emit(event, data);
  }
}
```

**`events/listeners/userEventListeners.ts`**

```typescript
import { EventBus } from "../eventBus";
import { Events } from "../Events";
import { Database } from "../../database/database";

export function setupUserEventListeners(eventBus: EventBus, db: Database) {
  eventBus.on(Events.USER_REGISTERED, async (data) => {
    // Send welcome email
    // Create user bonus
    // Track analytics
    console.log("User registered:", data);
  });

  eventBus.on(Events.USER_LOGGED_IN, async (data) => {
    // Update login statistics
    // Check for daily bonuses
    console.log("User logged in:", data);
  });
}
```

## Utilities

**`utils/sendResponse.ts`**

```typescript
import { FastifyReply } from "fastify";

interface ResponseOptions {
  success: boolean;
  data?: any;
  message?: string;
  statusCode?: number;
  errors?: any[];
}

export function sendResponse(reply: FastifyReply, options: ResponseOptions) {
  const {
    success,
    data,
    message,
    statusCode = success ? 200 : 400,
    errors,
  } = options;

  return reply.status(statusCode).send({
    success,
    data,
    message,
    errors,
    timestamp: new Date(),
  });
}
```

## Server Setup

**`server.ts`**

```typescript
import Fastify from "fastify";
import { Database } from "./src/database/database";
import { EventBus } from "./src/events/eventBus";
import { authMiddleware } from "./src/middleware/authMiddleware";
import { authRoutes } from "./src/modules/auth/routes";

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
});

// Register plugins
fastify.register(require("@fastify/cors"), {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
});

fastify.register(require("@fastify/helmet"));
fastify.register(require("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});

// Add database and event bus to fastify instance
fastify.decorate("db", Database.getInstance());
fastify.decorate("eventBus", EventBus.getInstance());

// Add authentication decorator
fastify.decorate("authenticate", authMiddleware);

// Register routes
fastify.register(authRoutes, { prefix: "/api/auth" });

// Health check
fastify.get("/health", async () => {
  return { status: "ok", timestamp: new Date() };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: parseInt(process.env.PORT || "3003"),
      host: "0.0.0.0",
    });
    console.log("Server started successfully");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

## Best Practices

### DO:

- Use TypeScript for all code
- Validate all inputs with Zod schemas
- Implement proper error handling
- Use dependency injection
- Log important operations
- Use database transactions for multi-step operations
- Implement rate limiting
- Use proper HTTP status codes
- Write comprehensive tests
- Use environment variables for configuration

### DON'T:

- Skip input validation
- Put business logic in route handlers
- Use synchronous operations for I/O
- Hardcode configuration values
- Ignore error handling
- Skip authentication/authorization
- Use `any` type in TypeScript
- Perform heavy operations in request handlers
- Skip logging for important events

## Testing

**`modules/auth/tests/auth.test.ts`**

```typescript
import { test } from "tap";
import { build } from "../../../test/helper";

test("POST /api/auth/login", async (t) => {
  const app = await build(t);

  const response = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: "test@example.com",
      password: "password123",
    },
  });

  t.equal(response.statusCode, 200);

  const body = JSON.parse(response.body);
  t.equal(body.success, true);
  t.ok(body.data.accessToken);
  t.ok(body.data.refreshToken);
});
```

## Environment Configuration

```env
# Server
PORT=3003
NODE_ENV=development
LOG_LEVEL=info

# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=savebucks_api
DB_USERNAME=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# External APIs
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_REST_API_KEY=your_onesignal_api_key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Common Commands

```bash
# Development
npm run dev                    # Start development server
npm run start                  # Start production server
npm run test                   # Run tests

# Database
npm run db:migration          # Run migrations
npm run db:codegen           # Generate database types
npm run db:seed              # Run seeders

# Utilities
npm run lint                 # Run ESLint
npm run type-check          # Check TypeScript types
```
