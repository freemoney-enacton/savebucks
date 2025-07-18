# Inter-Service Communication & Integration Guide

## Architecture Overview

The SaveBucks platform consists of three main applications that communicate through well-defined APIs and shared data sources. This guide covers communication patterns, data flow, authentication, and integration best practices.

### Communication Flow
```
┌─────────────┐    HTTP/REST     ┌─────────────┐    Database     ┌─────────────┐
│             │ ◄──────────────► │             │ ◄─────────────► │             │
│ Web Frontend│                  │ API Server  │                 │ Admin Panel │
│ (Next.js)   │                  │ (Fastify)   │                 │ (Laravel)   │
│             │                  │             │                 │             │
└─────────────┘                  └─────────────┘                 └─────────────┘
       │                                │                               │
       │         WebSocket/Socket.io    │                               │
       └────────────────────────────────┘                               │
                                        │                               │
                                        │         Shared Database       │
                                        └───────────────────────────────┘
```

## API Communication Patterns

### REST API Standards

**Base URL Structure**
```
API Server: http://localhost:3003/api
Admin Panel: http://localhost:8000/api (if needed)
Web Frontend: http://localhost:3000/api (internal routes)
```

**Standard Response Format**
```typescript
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}
```

### Authentication Flow

**JWT Token Exchange**
```typescript
// Web Frontend -> API Server
interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: true;
  data: {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  message: string;
}

// Token refresh flow
interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  success: true;
  data: {
    accessToken: string;
    expiresIn: number;
  };
}
```

**Implementation Example - Web Frontend**
```typescript
// lib/auth.ts
import { apiClient } from './apiClient';

export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    
    if (response.data.success) {
      // Store tokens securely
      this.setTokens(response.data.data.accessToken, response.data.data.refreshToken);
    }
    
    return response.data;
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await apiClient.post('/auth/refresh', { refreshToken });
      
      if (response.data.success) {
        this.setAccessToken(response.data.data.accessToken);
        return response.data.data.accessToken;
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    }
    
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private setAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
```

**API Client with Interceptors**
```typescript
// lib/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthService } from './auth';

class APIClient {
  private client: AxiosInstance;
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.authService.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Redirect to login
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new APIClient();
```

## Real-time Communication

### WebSocket Integration

**API Server - Socket.io Setup**
```typescript
// src/plugins/socketio.ts
import { FastifyInstance } from 'fastify';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

export async function socketPlugin(fastify: FastifyInstance) {
  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;
      
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);

    // Handle chat messages
    socket.on('chat:send', async (data) => {
      try {
        const message = await saveChatMessage({
          userId: socket.userId,
          roomId: data.roomId,
          content: data.content,
          type: data.type || 'text'
        });

        // Broadcast to room
        io.to(`room:${data.roomId}`).emit('chat:message', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle joining chat rooms
    socket.on('chat:join', (roomId) => {
      socket.join(`room:${roomId}`);
      socket.emit('chat:joined', { roomId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });

  // Add io instance to fastify
  fastify.decorate('io', io);
}

declare module 'fastify' {
  interface FastifyInstance {
    io: SocketIOServer;
  }
}
```

**Web Frontend - Socket.io Client**
```typescript
// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRecoilValue } from 'recoil';
import { authTokenState } from '@/recoil/atom';

export const useSocket = () => {
  const token = useRecoilValue(authTokenState);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (token && !socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL!, {
        auth: { token }
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return socketRef.current;
};

// hooks/useChat.ts
import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

interface ChatMessage {
  id: string;
  userId: number;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export const useChat = (roomId: string) => {
  const socket = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket && roomId) {
      // Join room
      socket.emit('chat:join', roomId);

      // Listen for new messages
      socket.on('chat:message', (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for connection status
      socket.on('chat:joined', () => {
        setIsConnected(true);
      });

      return () => {
        socket.off('chat:message');
        socket.off('chat:joined');
      };
    }
  }, [socket, roomId]);

  const sendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (socket && isConnected) {
      socket.emit('chat:send', {
        roomId,
        content,
        type
      });
    }
  };

  return {
    messages,
    sendMessage,
    isConnected
  };
};
```

## Data Synchronization

### Event-Driven Updates

**API Server - Event System**
```typescript
// src/events/userEvents.ts
import { EventBus } from './eventBus';
import { Events } from './Events';

export class UserEventHandler {
  constructor(
    private eventBus: EventBus,
    private io: any // Socket.io instance
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // User balance updated
    this.eventBus.on(Events.USER_BALANCE_UPDATED, (data) => {
      this.io.to(`user:${data.userId}`).emit('balance:updated', {
        newBalance: data.newBalance,
        change: data.change,
        reason: data.reason
      });
    });

    // New offer available
    this.eventBus.on(Events.OFFER_CREATED, (data) => {
      this.io.emit('offer:new', {
        offer: data.offer,
        category: data.category
      });
    });

    // Payment status updated
    this.eventBus.on(Events.PAYMENT_STATUS_UPDATED, (data) => {
      this.io.to(`user:${data.userId}`).emit('payment:status', {
        paymentId: data.paymentId,
        status: data.status,
        amount: data.amount
      });
    });

    // Leaderboard updated
    this.eventBus.on(Events.LEADERBOARD_UPDATED, (data) => {
      this.io.emit('leaderboard:updated', {
        leaderboard: data.leaderboard,
        period: data.period
      });
    });
  }
}
```

**Web Frontend - Real-time Updates**
```typescript
// hooks/useRealTimeUpdates.ts
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useSocket } from './useSocket';
import { userState, notificationsState } from '@/recoil/atom';
import { toast } from 'react-toastify';

export const useRealTimeUpdates = () => {
  const socket = useSocket();
  const [user, setUser] = useRecoilState(userState);
  const [notifications, setNotifications] = useRecoilState(notificationsState);

  useEffect(() => {
    if (socket) {
      // Balance updates
      socket.on('balance:updated', (data) => {
        setUser(prev => prev ? { ...prev, balance: data.newBalance } : null);
        
        toast.success(`Balance updated: ${data.change > 0 ? '+' : ''}$${data.change.toFixed(2)}`);
      });

      // Payment status updates
      socket.on('payment:status', (data) => {
        toast.info(`Payment ${data.status}: $${data.amount}`);
        
        // Add notification
        setNotifications(prev => [{
          id: Date.now(),
          type: 'payment',
          title: 'Payment Update',
          message: `Your payment of $${data.amount} is now ${data.status}`,
          timestamp: new Date().toISOString(),
          isRead: false
        }, ...prev]);
      });

      // New offers
      socket.on('offer:new', (data) => {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'offer',
          title: 'New Offer Available',
          message: `Check out: ${data.offer.title}`,
          timestamp: new Date().toISOString(),
          isRead: false
        }, ...prev]);
      });

      return () => {
        socket.off('balance:updated');
        socket.off('payment:status');
        socket.off('offer:new');
      };
    }
  }, [socket, setUser, setNotifications]);
};
```

## Admin Panel Integration

### API Endpoints for Admin Operations

**Laravel Admin - API Routes**
```php
<?php
// routes/api.php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\UserController;

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // User management
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}/status', [UserController::class, 'updateStatus']);
    Route::post('/users/{user}/adjust-balance', [UserController::class, 'adjustBalance']);

    // Offer management
    Route::apiResource('offers', OfferController::class);
    Route::post('/offers/{offer}/approve', [OfferController::class, 'approve']);
    Route::post('/offers/{offer}/reject', [OfferController::class, 'reject']);

    // Analytics
    Route::get('/analytics/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/analytics/revenue', [AdminController::class, 'revenue']);
    Route::get('/analytics/users', [AdminController::class, 'userStats']);
});
```

**Admin Controller Example**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Offer;
use App\Models\UserOfferSale;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'total_offers' => Offer::where('status', 'active')->count(),
            'total_revenue' => UserOfferSale::where('status', 'approved')
                ->sum('commission_amount'),
            'pending_payments' => UserPayment::where('status', 'pending')
                ->sum('amount'),
        ];

        $recentActivity = [
            'new_users' => User::where('created_at', '>=', Carbon::now()->subDays(7))
                ->count(),
            'recent_sales' => UserOfferSale::where('created_at', '>=', Carbon::now()->subDays(7))
                ->where('status', 'approved')
                ->count(),
            'pending_approvals' => UserOfferSale::where('status', 'pending')
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_activity' => $recentActivity,
            ]
        ]);
    }

    public function revenue(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $startDate = Carbon::now()->subDays($period);

        $revenue = UserOfferSale::where('status', 'approved')
            ->where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, SUM(commission_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $revenue
        ]);
    }
}
```

## Error Handling & Resilience

### Circuit Breaker Pattern

```typescript
// utils/circuitBreaker.ts
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage in API client
const circuitBreaker = new CircuitBreaker(5, 60000);

export const resilientApiCall = async <T>(operation: () => Promise<T>): Promise<T> => {
  return circuitBreaker.execute(operation);
};
```

### Retry Logic with Exponential Backoff

```typescript
// utils/retry.ts
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Usage
const fetchUserData = async (userId: number) => {
  return retryWithBackoff(
    () => apiClient.get(`/users/${userId}`),
    3,
    1000
  );
};
```

## Monitoring & Observability

### Health Checks

**API Server Health Check**
```typescript
// routes/health.ts
export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: await checkDatabase(),
        redis: await checkRedis(),
        external_apis: await checkExternalAPIs()
      }
    };

    const isHealthy = Object.values(health.checks).every(check => check.status === 'ok');
    
    return reply
      .status(isHealthy ? 200 : 503)
      .send(health);
  });
}

async function checkDatabase(): Promise<{ status: string; responseTime?: number }> {
  const start = Date.now();
  try {
    await fastify.db.selectFrom('users').select('id').limit(1).execute();
    return {
      status: 'ok',
      responseTime: Date.now() - start
    };
  } catch (error) {
    return { status: 'error' };
  }
}
```

### Request Tracing

```typescript
// middleware/tracing.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

export async function tracingMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const traceId = uuidv4();
  request.traceId = traceId;
  
  reply.header('X-Trace-ID', traceId);
  
  request.log.info({
    traceId,
    method: request.method,
    url: request.url,
    userAgent: request.headers['user-agent'],
    ip: request.ip
  }, 'Request started');
}

declare module 'fastify' {
  interface FastifyRequest {
    traceId: string;
  }
}
```

## Best Practices

### DO:
- Implement proper authentication and authorization
- Use consistent API response formats
- Handle errors gracefully with proper HTTP status codes
- Implement rate limiting and request validation
- Use connection pooling for database connections
- Implement proper logging and monitoring
- Use environment variables for configuration
- Implement circuit breakers for external API calls
- Use proper CORS configuration
- Implement request/response compression
- Use HTTPS in production
- Implement proper session management

### DON'T:
- Expose sensitive data in API responses
- Skip input validation and sanitization
- Use synchronous operations for I/O
- Hardcode API endpoints or credentials
- Ignore error handling
- Skip authentication for protected routes
- Use weak JWT secrets
- Ignore rate limiting
- Skip request logging
- Use plain HTTP in production
- Store sensitive data in local storage
- Skip CORS configuration

## Security Considerations

### API Security Checklist
- [ ] JWT tokens with proper expiration
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers (HSTS, CSP, etc.)
- [ ] API versioning
- [ ] Proper error messages (no sensitive data)
- [ ] Audit logging
- [ ] Regular security updates
- [ ] Penetration testing