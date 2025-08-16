# Overview

This is a legal disbursement calculator application built with a full-stack TypeScript architecture. The application allows users to calculate legal disbursement costs by selecting various items, entering quantities, and automatically computing totals including GST. It features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration via Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the main UI framework
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and API caching
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with a custom design system
- **React Hook Form** with Zod resolvers for form validation

## Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** structure with `/api` prefix for all endpoints
- **Middleware-based** request logging and error handling
- **Storage abstraction layer** with in-memory implementation (easily swappable for database)
- **Session-based** architecture ready for authentication

## Database Design
- **PostgreSQL** database with Drizzle ORM for type-safe queries
- **Three main entities**:
  - `users` - User authentication and management
  - `disbursement_items` - Predefined legal disbursement items with costs
  - `calculations` - Saved calculation results with selected items and totals
- **UUID primary keys** for all entities
- **Decimal precision** for financial calculations
- **JSON storage** for complex data like selected items in calculations

## Data Layer
- **Drizzle ORM** for database schema definition and migrations
- **Zod schemas** for runtime validation derived from database schema
- **Type-safe** database operations with full TypeScript integration
- **Migration system** for database version control

## Development Tooling
- **ESBuild** for production server bundling
- **TypeScript** with strict configuration across all layers
- **Path aliases** for clean imports (`@/`, `@shared/`)
- **Replit integration** with development banner and cartographer plugin

## External Dependencies

- **@neondatabase/serverless** - Serverless PostgreSQL driver for database connectivity
- **@radix-ui/** components - Accessible, unstyled UI primitives for building the design system
- **@tanstack/react-query** - Server state management and data fetching
- **drizzle-orm** and **drizzle-kit** - Type-safe ORM and migration toolkit
- **class-variance-authority** - Utility for creating component variants
- **date-fns** - Date manipulation and formatting utilities
- **wouter** - Lightweight routing library for React
- **tailwindcss** - Utility-first CSS framework
- **zod** - Schema validation library for TypeScript