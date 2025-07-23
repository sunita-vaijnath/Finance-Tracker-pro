# Expense Tracker Application

## Overview

This is a full-stack expense tracking application built with a modern React frontend and Express.js backend. The application allows users to manage personal finances by tracking income and expenses with categorization, visualization, and summary analytics.

## User Preferences

Preferred communication style: Simple, everyday language.
Currency preference: Indian Rupee (₹) - Updated currency formatting from USD to INR throughout application.
Documentation: Comprehensive README file created explaining all features and usage instructions.
Technical Documentation: Created doc.md with detailed code structure and architecture explanations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with CSS variables for theming support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Development**: Hot reloading with Vite integration in development mode

### Data Storage
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Database Schema
- **Transactions Table**: Core entity storing financial transactions with description, amount, type (income/expense), category, date, and timestamps
- **Users Table**: Full user profile with username, personal info (name, email, phone), occupation, monthly income, and timestamps
- **Validation**: Zod schemas for runtime type validation and data integrity

### API Endpoints
- `GET /api/transactions` - Retrieve all transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Get financial summary statistics
- `GET /api/transactions/range` - Get transactions within date range for charts
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile information

### Frontend Components
- **ExpenseForm**: Transaction input form with validation and category selection
- **TransactionList**: Display and manage existing transactions with category filtering
- **SummaryCards**: Financial overview with income, expenses, and net calculations in INR
- **TrendsChart**: Interactive line chart with 1Month/6Month/1Year period selection
- **ProfileDialog**: Editable user profile with personal and financial information

### UI System
- **Design System**: shadcn/ui components with Radix UI primitives
- **Theme**: Neutral color scheme with dark mode support
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first responsive design

## Data Flow

1. **Transaction Creation**: User fills form → Frontend validation → API call → Database insertion → UI refresh
2. **Data Retrieval**: Component mount → React Query fetch → API endpoint → Database query → UI rendering
3. **Summary Calculation**: Real-time aggregation of transaction data for dashboard metrics
4. **Chart Data**: Date-range queries processed for visualization components

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **UI Components**: Radix UI primitives for accessible components
- **Validation**: Zod for schema validation
- **Charts**: Chart.js for data visualization
- **Dates**: date-fns for date manipulation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Drizzle Kit**: Database schema management and migrations
- **Vite**: Development server and build tool
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations run via `db:push` command

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Development**: Local development with hot reloading
- **Production**: Single build artifact serving both API and static files

### File Structure
- **Shared**: Common TypeScript schemas and types in `/shared`
- **Client**: React frontend in `/client`
- **Server**: Express backend in `/server`
- **Monorepo**: Single package.json managing all dependencies

The application follows a modern full-stack architecture with strong typing, component-based UI, and serverless-ready database connectivity. The design prioritizes developer experience with hot reloading, type safety, and efficient data fetching patterns.

## Documentation Files

- **README.md**: User-facing documentation with installation guide, feature explanations, and usage instructions
- **doc.md**: Technical documentation explaining code structure, architecture decisions, and development workflow
- **replit.md**: Project overview and architectural summary for development context