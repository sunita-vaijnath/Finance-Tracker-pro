# Technical Documentation - Expense Tracker

## Code Structure Overview

This is a full-stack TypeScript application following modern web development practices with clear separation of concerns between frontend, backend, and shared components.

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Route-based page components
│   │   ├── App.tsx         # Main application component with routing
│   │   ├── main.tsx        # React application entry point
│   │   └── index.css       # Global styles and CSS variables
│   └── index.html          # HTML template
├── server/                 # Express.js backend application
│   ├── db.ts              # Database connection and configuration
│   ├── index.ts           # Server entry point and middleware setup
│   ├── routes.ts          # API route definitions and handlers
│   ├── storage.ts         # Data access layer and business logic
│   └── vite.ts            # Vite integration for development
├── shared/                 # Shared TypeScript schemas and types
│   └── schema.ts          # Database schema and validation types
└── Configuration Files     # Build tools and project configuration
```

## Application Architecture

### 1. Database Layer (PostgreSQL + Drizzle ORM)

**File: `shared/schema.ts`**
- Defines database schema using Drizzle ORM
- Creates TypeScript types for compile-time safety
- Provides Zod schemas for runtime validation

```typescript
// Database tables with relationships
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  description: varchar('description', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  // User profile fields...
});
```

**File: `server/db.ts`**
- Establishes PostgreSQL connection using Neon serverless
- Configures Drizzle ORM with WebSocket support
- Exports database client for use in storage layer

### 2. Data Access Layer

**File: `server/storage.ts`**
- Implements `IStorage` interface for data operations
- `DatabaseStorage` class handles all database interactions
- Type-safe CRUD operations using Drizzle ORM

```typescript
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }
}
```

### 3. API Layer

**File: `server/routes.ts`**
- RESTful API endpoints using Express.js
- Request validation using Zod schemas
- Error handling and response formatting

**Key Endpoints:**
```typescript
// Transaction management
GET    /api/transactions        # List all transactions
POST   /api/transactions        # Create new transaction
DELETE /api/transactions/:id    # Delete transaction

// Analytics and reporting
GET    /api/transactions/summary # Financial summary statistics
GET    /api/transactions/range  # Date-filtered transactions

// User management
GET    /api/user/profile        # Get user profile
PUT    /api/user/profile        # Update user profile
```

**File: `server/index.ts`**
- Express server configuration
- Middleware setup (CORS, JSON parsing, static files)
- Integration with Vite development server

### 4. Frontend Architecture

**File: `client/src/App.tsx`**
- Main application component with routing using Wouter
- Provides React Query context for data fetching
- Theme and toast notification providers

**File: `client/src/pages/home.tsx`**
- Primary dashboard page component
- Composes all major UI components
- Manages overall page layout and state

### 5. UI Components

**Core Components:**
- `ExpenseForm`: Transaction input with validation
- `TransactionList`: Data table with filtering and actions
- `SummaryCards`: Financial metrics display
- `TrendsChart`: Interactive Chart.js visualization
- `ProfileDialog`: User profile management modal

**Component Architecture:**
```typescript
// Example component structure
export function TrendsChart() {
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '6M' | '1Y'>('1M');
  
  // Data fetching with React Query
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions/range", startDate, endDate, selectedPeriod],
    queryFn: async () => { /* API call */ }
  });

  // Data processing
  const chartData = processTransactionsForChart(transactions, selectedPeriod);

  // UI rendering
  return (
    <Card>
      <CardContent>
        {/* Chart and controls */}
      </CardContent>
    </Card>
  );
}
```

## Data Flow

### 1. Transaction Creation Flow
```
User Input → Form Validation → API Request → Database Insert → Cache Invalidation → UI Update
```

1. **User fills form** in `ExpenseForm` component
2. **Form validation** using Zod schemas and react-hook-form
3. **API request** via React Query mutation to POST `/api/transactions`
4. **Database insert** through `DatabaseStorage.createTransaction()`
5. **Cache invalidation** triggers UI refresh across all components
6. **UI updates** reflect new transaction in list and charts

### 2. Data Visualization Flow
```
Component Mount → Query Key → API Fetch → Data Processing → Chart Rendering
```

1. **Component renders** and React Query triggers data fetch
2. **API endpoint** returns filtered transaction data
3. **Data processing** aggregates transactions by date/period
4. **Chart.js rendering** displays interactive line chart
5. **User interaction** (period selection) triggers new query cycle

### 3. Profile Management Flow
```
Dialog Open → Data Fetch → Edit Mode → Validation → API Update → UI Refresh
```

## State Management

### Client-Side State
- **React Query**: Server state management and caching
- **React hooks**: Local component state (useState, useEffect)
- **Form state**: react-hook-form for complex forms

### Server-Side State
- **PostgreSQL**: Persistent data storage
- **Database transactions**: ACID compliance for data integrity
- **Connection pooling**: Efficient database connections

## Build Process

### Development Mode
1. **Vite dev server** serves frontend with hot reload
2. **Express server** handles API requests and static files
3. **TypeScript compilation** provides type checking
4. **Database connection** to development PostgreSQL instance

### Production Build
1. **Frontend build**: Vite bundles React app to `dist/public`
2. **Backend build**: ESBuild compiles server to `dist/index.js`
3. **Single deployment**: Express serves both API and static files
4. **Database migrations**: Drizzle pushes schema changes

## Key Technical Decisions

### 1. TypeScript Throughout
- **Shared types** between frontend and backend
- **Compile-time safety** prevents runtime errors
- **Developer experience** with autocomplete and IntelliSense

### 2. Drizzle ORM
- **Type-safe queries** with full TypeScript integration
- **Migration-free development** with schema push
- **Performance optimized** with prepared statements

### 3. React Query for State Management
- **Server state synchronization** with automatic caching
- **Optimistic updates** for better user experience
- **Background refetching** keeps data fresh

### 4. Component-Based Architecture
- **shadcn/ui components** for consistent design system
- **Composition over inheritance** for flexibility
- **Single responsibility** principle for maintainability

### 5. API Design
- **RESTful conventions** for predictable endpoints
- **Consistent error handling** across all routes
- **Input validation** at API boundary with Zod

## Error Handling

### Frontend Error Handling
- **React Query error states** for network failures
- **Form validation errors** displayed inline
- **Toast notifications** for user feedback
- **Fallback UI states** for loading and errors

### Backend Error Handling
- **Input validation** using Zod schemas
- **Database error catching** with meaningful messages
- **HTTP status codes** following REST conventions
- **Structured error responses** for frontend consumption

## Security Considerations

### Input Validation
- **Zod schemas** validate all incoming data
- **SQL injection prevention** through parameterized queries
- **Type coercion** prevents unexpected data types

### Database Security
- **Connection string** stored in environment variables
- **Prepared statements** prevent SQL injection attacks
- **Input sanitization** at multiple layers

## Performance Optimizations

### Frontend Performance
- **React Query caching** reduces unnecessary API calls
- **Lazy loading** for route-based code splitting
- **Optimized re-renders** through proper React patterns

### Backend Performance
- **Database indexing** on frequently queried columns
- **Connection pooling** for efficient database access
- **Response caching** for read-heavy operations

### Database Performance
- **Efficient queries** using Drizzle's query builder
- **Pagination support** for large datasets
- **Aggregated queries** for summary statistics

## Development Workflow

### Local Development
1. **Start development server**: `npm run dev`
2. **Database schema updates**: `npm run db:push`
3. **Type checking**: Automatic with TypeScript
4. **Hot reload**: Instant feedback on code changes

### Code Organization Principles
- **Feature-based folders** for related components
- **Shared utilities** in lib directories
- **Type definitions** centralized in shared schema
- **Configuration files** at project root

This architecture provides a scalable, maintainable foundation for the expense tracker application with clear separation of concerns, type safety, and modern development practices.