web frontend is built with Next.js 14.2 using the App Router, React 18, and TypeScript. It provides the customer-facing interface for the SaveBucks cashback platform with internationalization, real-time features, and responsive design.

### Core Principles
- **Component-First**: Reusable, composable UI components
- **Type Safety**: Full TypeScript coverage with proper typing
- **Performance**: Optimized for Core Web Vitals and user experience
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: Multi-language support with i18next
- **State Management**: Recoil for global state, React hooks for local state

## Project Structure

```
web/src/
├── app/                    # Next.js App Router
│   ├── (auth-routes)/     # Authentication pages
│   ├── (main-routes)/     # Main application pages
│   ├── (without-sidebar-routes)/ # Pages without sidebar
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── Core/             # Core business components
│   ├── Generic/          # Generic UI components
│   └── Layouts/          # Layout components
├── Hook/                 # Custom React hooks
├── recoil/              # Global state management
├── i18n/                # Internationalization
├── Type/                # TypeScript type definitions
└── Helper/              # Utility functions
```

## Component Architecture

### Core Components (`components/Core/`)

**`components/Core/OfferCard/OfferCard.tsx`**
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Button, Chip } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { OfferType } from '@/Type/offerType';
import { useOfferClick } from '@/Hook/Api/useOffers';
import { formatCurrency } from '@/Helper/utils';

interface OfferCardProps {
  offer: OfferType;
  onOfferClick?: (offerId: number) => void;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onOfferClick,
  className = '',
  variant = 'default'
}) => {
  const { t } = useTranslation();
  const { mutate: trackOfferClick, isLoading } = useOfferClick();

  const handleOfferClick = () => {
    trackOfferClick(offer.id, {
      onSuccess: () => {
        onOfferClick?.(offer.id);
        // Open offer URL in new tab
        window.open(offer.clickUrl, '_blank', 'noopener,noreferrer');
      }
    });
  };

  const cardVariants = {
    default: 'p-4',
    featured: 'p-6 border-2 border-primary',
    compact: 'p-3'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        className={`cursor-pointer hover:shadow-offer-card transition-all duration-300 ${cardVariants[variant]}`}
        isPressable
        onPress={handleOfferClick}
      >
        <CardBody className="space-y-4">
          {/* Offer Image */}
          <div className="relative w-full h-32 rounded-lg overflow-hidden">
            <img
              src={offer.imageUrl}
              alt={offer.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {offer.isFeatured && (
              <Chip
                color="primary"
                size="sm"
                className="absolute top-2 right-2"
              >
                {t('offers.featured')}
              </Chip>
            )}
          </div>

          {/* Offer Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2">
              {offer.title}
            </h3>
            
            <p className="text-sm text-gray-600 line-clamp-3">
              {offer.description}
            </p>

            {/* Reward Information */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  {t('offers.reward')}
                </p>
                <p className="text-lg font-bold text-primary">
                  {offer.rewardType === 'percentage' 
                    ? `${offer.rewardValue}%`
                    : formatCurrency(offer.rewardValue)
                  }
                </p>
              </div>

              <Button
                color="primary"
                size="sm"
                isLoading={isLoading}
                className="min-w-20"
              >
                {t('offers.claim')}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{offer.network.name}</span>
              <span>{offer.category.name}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default OfferCard;
```

### Generic Components (`components/Generic/`)

**`components/Generic/LoadingSpinner/LoadingSpinner.tsx`**
```typescript
import React from 'react';
import { Spinner } from '@nextui-org/react';
import { cn } from '@/Helper/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  label
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <Spinner size={size} color={color} />
      {label && (
        <p className="text-sm text-gray-600">{label}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
```

### Layout Components (`components/Layouts/`)

**`components/Layouts/MainLayout/MainLayout.tsx`**
```typescript
import React from 'react';
import { useRecoilValue } from 'recoil';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { sidebarOpenState } from '@/recoil/atom';
import { cn } from '@/Helper/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSidebar = true,
  className
}) => {
  const isSidebarOpen = useRecoilValue(sidebarOpenState);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {showSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen}
            className="hidden lg:block"
          />
        )}
        
        <main 
          className={cn(
            'flex-1 transition-all duration-300',
            showSidebar && isSidebarOpen && 'lg:ml-64',
            className
          )}
        >
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
```

## Custom Hooks

### API Hooks (`Hook/Api/`)

**`Hook/Api/useOffers.ts`**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { authTokenState } from '@/recoil/atom';
import { OfferType } from '@/Type/offerType';
import { apiClient } from '@/Helper/apiClient';

interface OffersParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'reward' | 'popularity' | 'newest';
}

interface OffersResponse {
  offers: OfferType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useOffers = (params: OffersParams = {}) => {
  const token = useRecoilValue(authTokenState);

  return useQuery({
    queryKey: ['offers', params],
    queryFn: async (): Promise<OffersResponse> => {
      const response = await apiClient.get('/offers', {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useOfferClick = () => {
  const token = useRecoilValue(authTokenState);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: number) => {
      const response = await apiClient.post(`/offers/${offerId}/click`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user stats to refresh click count
      queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
    }
  });
};

export const useFeaturedOffers = () => {
  const token = useRecoilValue(authTokenState);

  return useQuery({
    queryKey: ['offers', 'featured'],
    queryFn: async (): Promise<OfferType[]> => {
      const response = await apiClient.get('/offers/featured', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    },
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### Utility Hooks (`Hook/Common/`)

**`Hook/Common/useLocalStorage.ts`**
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

## State Management (Recoil)

**`recoil/atom.ts`**
```typescript
import { atom, selector } from 'recoil';

// Authentication state
export const authTokenState = atom<string | null>({
  key: 'authToken',
  default: null,
});

export const userState = atom<any>({
  key: 'user',
  default: null,
});

export const isAuthenticatedState = selector({
  key: 'isAuthenticated',
  get: ({ get }) => {
    const token = get(authTokenState);
    const user = get(userState);
    return !!(token && user);
  },
});

// UI state
export const sidebarOpenState = atom<boolean>({
  key: 'sidebarOpen',
  default: false,
});

export const themeState = atom<'light' | 'dark'>({
  key: 'theme',
  default: 'light',
});

// Offer filters
export const offerFiltersState = atom({
  key: 'offerFilters',
  default: {
    category: '',
    search: '',
    sortBy: 'newest' as 'reward' | 'popularity' | 'newest',
  },
});

// Notifications
export const notificationsState = atom<any[]>({
  key: 'notifications',
  default: [],
});

export const unreadNotificationsCountState = selector({
  key: 'unreadNotificationsCount',
  get: ({ get }) => {
    const notifications = get(notificationsState);
    return notifications.filter(n => !n.isRead).length;
  },
});
```

## Pages (App Router)

**`app/(main-routes)/offers/page.tsx`**
```typescript
'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Select, SelectItem, Button } from '@nextui-org/react';
import { SearchIcon, FilterIcon } from 'lucide-react';
import { MainLayout } from '@/components/Layouts/MainLayout';
import { OfferCard } from '@/components/Core/OfferCard';
import { LoadingSpinner } from '@/components/Generic/LoadingSpinner';
import { useOffers } from '@/Hook/Api/useOffers';
import { useCategories } from '@/Hook/Api/useCategories';
import { useDebounce } from 'use-debounce';

export default function OffersPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<'reward' | 'popularity' | 'newest'>('newest');
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data: offersData, isLoading, error } = useOffers({
    page,
    search: debouncedSearch,
    category,
    sortBy,
    limit: 12
  });

  const { data: categories } = useCategories();

  const handleOfferClick = (offerId: number) => {
    // Track offer click analytics
    console.log('Offer clicked:', offerId);
  };

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-500">{t('errors.loadingOffers')}</p>
          <Button 
            color="primary" 
            className="mt-4"
            onPress={() => window.location.reload()}
          >
            {t('common.retry')}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('offers.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('offers.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder={t('offers.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<SearchIcon className="w-4 h-4 text-gray-400" />}
            className="md:max-w-xs"
          />

          <Select
            placeholder={t('offers.selectCategory')}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="md:max-w-xs"
          >
            <SelectItem key="" value="">
              {t('offers.allCategories')}
            </SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            placeholder={t('offers.sortBy')}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="md:max-w-xs"
          >
            <SelectItem key="newest" value="newest">
              {t('offers.sortNewest')}
            </SelectItem>
            <SelectItem key="reward" value="reward">
              {t('offers.sortReward')}
            </SelectItem>
            <SelectItem key="popularity" value="popularity">
              {t('offers.sortPopularity')}
            </SelectItem>
          </Select>
        </div>

        {/* Offers Grid */}
        {isLoading ? (
          <LoadingSpinner 
            size="lg" 
            label={t('offers.loading')}
            className="py-12"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offersData?.offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onOfferClick={handleOfferClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {offersData && offersData.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: offersData.pagination.totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      size="sm"
                      variant={page === i + 1 ? 'solid' : 'bordered'}
                      color="primary"
                      onPress={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
```

## Internationalization

**`i18n/settings.ts`**
```typescript
export const fallbackLng = 'en';
export const languages = ['en', 'es', 'fr', 'de'];
export const defaultNS = 'common';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
```

**`i18n/locales/en/common.json`**
```json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View",
    "close": "Close"
  },
  "offers": {
    "title": "Available Offers",
    "subtitle": "Discover amazing cashback opportunities",
    "searchPlaceholder": "Search offers...",
    "selectCategory": "Select category",
    "allCategories": "All Categories",
    "sortBy": "Sort by",
    "sortNewest": "Newest",
    "sortReward": "Highest Reward",
    "sortPopularity": "Most Popular",
    "featured": "Featured",
    "reward": "Reward",
    "claim": "Claim",
    "loading": "Loading offers...",
    "noOffers": "No offers found"
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "firstName": "First Name",
    "lastName": "Last Name",
    "forgotPassword": "Forgot Password?",
    "rememberMe": "Remember me",
    "loginSuccess": "Login successful",
    "registerSuccess": "Registration successful"
  }
}
```

## Utility Functions

**`Helper/utils.ts`**
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {},
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

## Best Practices

### DO:
- Use TypeScript for all components and functions
- Implement proper error boundaries
- Use React Query for server state management
- Implement proper loading and error states
- Use semantic HTML elements
- Implement proper accessibility features
- Use Next.js Image component for optimized images
- Implement proper SEO with metadata
- Use CSS-in-JS or Tailwind for styling
- Write comprehensive tests
- Use proper form validation
- Implement proper error handling

### DON'T:
- Use `any` type in TypeScript
- Skip error handling
- Ignore accessibility requirements
- Use inline styles
- Skip loading states
- Ignore SEO best practices
- Use unoptimized images
- Skip form validation
- Ignore performance optimization
- Use deprecated React patterns
- Skip internationalization considerations

## Testing

**`__tests__/components/OfferCard.test.tsx`**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OfferCard } from '@/components/Core/OfferCard';
import { OfferType } from '@/Type/offerType';

const mockOffer: OfferType = {
  id: 1,
  title: 'Test Offer',
  description: 'Test description',
  imageUrl: '/test-image.jpg',
  rewardType: 'percentage',
  rewardValue: 5,
  clickUrl: 'https://example.com',
  isFeatured: false,
  network: { id: 1, name: 'Test Network' },
  category: { id: 1, name: 'Test Category' }
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </QueryClientProvider>
  );
};

describe('OfferCard', () => {
  it('renders offer information correctly', () => {
    render(
      <TestWrapper>
        <OfferCard offer={mockOffer} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('5%')).toBeInTheDocument();
  });

  it('calls onOfferClick when clicked', () => {
    const mockOnClick = jest.fn();
    
    render(
      <TestWrapper>
        <OfferCard offer={mockOffer} onOfferClick={mockOnClick} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /claim/i }));
    expect(mockOnClick).toHaveBeenCalledWith(1);
  });
});
```

## Environment Configuration

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3003/api
NEXT_PUBLIC_WS_URL=ws://localhost:3003

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# External Services
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

## Common Commands

```bash
# Development
npm run dev                # Start development server
npm run build             # Build for production
npm start                 # Start production server
npm run lint              # Run ESLint
npm run type-check        # Check TypeScript types

# Testing
npm run test              # Run tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage

# Utilities
npm run analyze           # Analyze bundle size
npm run clean             # Clean build artifacts
```