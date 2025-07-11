# System Architecture Documentation

## Overview

This is a full-stack web application built with a modern React frontend and Express.js backend. The application features user authentication and batch job management functionality, using a PostgreSQL database with Drizzle ORM and styled with Tailwind CSS and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with bcrypt for password hashing
- **API Style**: RESTful API endpoints

### Database Architecture
- **ORM**: Drizzle with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle migrations in `/migrations` directory
- **Shared Types**: Database schemas and validation in `/shared` directory

## Key Components

### Authentication System
- JWT-based authentication with 24-hour token expiration
- Password hashing using bcryptjs
- Protected routes with authentication middleware
- Client-side token storage in localStorage

### Data Storage
- **Users Table**: Stores user credentials (id, email, password)
- **Batch Jobs Table**: Manages job configurations with status tracking
- **In-Memory Fallback**: MemStorage class for development/testing

### UI Framework
- shadcn/ui components built on Radix UI primitives
- Responsive design with mobile-first approach
- Dark/light theme support through CSS variables
- Comprehensive component library (buttons, forms, cards, etc.)

### Form Handling
- React Hook Form for performant form management
- Zod schemas for runtime validation
- Shared validation schemas between client and server

## Data Flow

1. **Authentication Flow**:
   - User submits credentials via login form
   - Server validates against database
   - JWT token returned and stored client-side
   - Token included in subsequent API requests

2. **Batch Job Management**:
   - Protected dashboard requires valid JWT
   - Form submission creates new batch jobs
   - Real-time feedback via toast notifications
   - Server-side validation using shared schemas

3. **Client-Server Communication**:
   - RESTful API endpoints under `/api` prefix
   - JSON request/response format
   - Error handling with appropriate HTTP status codes
   - Request logging middleware for debugging

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Connection**: Via `@neondatabase/serverless` driver
- **Configuration**: Environment variable `DATABASE_URL`

### UI Libraries
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Replit Integration**: Development environment optimizations
- **TypeScript**: Static type checking
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Middleware setup for API proxy during development

### Production Build
- Frontend: Vite builds optimized React bundle to `/dist/public`
- Backend: ESBuild bundles server code to `/dist/index.js`
- Static file serving from Express in production

### Environment Configuration
- Database URL required for PostgreSQL connection
- JWT secret for token signing (defaults to development key)
- Production/development environment detection

### File Structure
- **`/client`**: React frontend application
- **`/server`**: Express.js backend application  
- **`/shared`**: Common schemas and types
- **`/migrations`**: Database migration files
- Monorepo structure with shared TypeScript configuration