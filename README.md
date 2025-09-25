# GPLAW Conveyancing Calculator

A full-stack TypeScript web application built for GPLAW to calculate conveyancing disbursement costs. The app enables staff (and potentially sellers/agents) to select searches, add custom disbursement items, and generate totals with GST automatically applied.

## 🚀 Features
- **Disbursement Calculation**: Auto-selects relevant searches based on property type.  
- **Custom Items**: Add or remove fee items dynamically.  
- **GST Handling**: All calculations inclusive of GST, with clear subtotals.  
- **Print to PDF**: Export calculations in a shareable format.  
- **Modern UI**: Responsive design using shadcn/ui, Tailwind, and Montserrat font.  
- **Improved UX**: Icons for “Required” and “Recommended” searches, interactive tutorial, and intuitive navigation.  

## 🏗️ System Architecture

### Frontend
- **Framework**: React 18 + TypeScript  
- **Build Tool**: Vite  
- **Routing**: Wouter  
- **State Management**: TanStack Query  
- **UI Library**: shadcn/ui (Radix UI primitives)  
- **Styling**: Tailwind CSS + firm design system  
- **Forms & Validation**: React Hook Form with Zod  

### Backend
- **Framework**: Express.js + TypeScript  
- **API**: RESTful endpoints (`/api`)  
- **Middleware**: Logging, error handling  
- **Database Driver**: @neondatabase/serverless  

### Database
- **Engine**: PostgreSQL  
- **ORM**: Drizzle ORM  
- **Entities**:  
  - `users` (authentication/management)  
  - `disbursement_items` (search costs)  
  - `calculations` (saved results)  
- **Design**: UUID PKs, decimals for financial data, JSON for complex items  

### Tooling
- ESBuild for bundling  
- TypeScript strict mode  
- Path aliases (`@/`, `@shared/`)  
- Migration system for schema updates  
