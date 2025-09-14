# SkateHubba

## Overview

SkateHubba is a skateboarding challenge platform that enables users to participate in "Play SKATE" competitions. The application features a challenge lobby system where users can create, join, and compete in trick-based challenges. Each challenge follows the traditional SKATE game format where participants attempt to replicate tricks, earning letters (S-K-A-T-E) for failed attempts, with the first to spell "SKATE" losing the challenge.

The platform is built as a full-stack web application with a modern React frontend and Express.js backend, featuring real-time challenge management, video upload simulation, and persistent state management through both client-side storage and server-side APIs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing with routes for lobby, challenge detail, and challenge creation
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: Zustand with persistence middleware for client-side state, storing challenges, user data, and UI state in localStorage
- **Data Fetching**: TanStack React Query for server state management with automatic caching and background updates
- **Animations**: Framer Motion for smooth UI transitions and micro-interactions
- **Form Handling**: React Hook Form with Zod schema validation for type-safe form management

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Development Server**: Custom Vite middleware integration for hot module replacement in development
- **Data Storage**: In-memory storage with mock persistence, simulating database operations with artificial network delays
- **API Design**: RESTful endpoints for challenges and trick attempts with proper HTTP status codes and error handling
- **Schema Validation**: Drizzle-Zod integration for request/response validation

### Data Storage Solutions
- **Client-Side**: Zustand persisted store using localStorage for offline-first challenge management
- **Server-Side**: MemStorage class implementing IStorage interface for mock database operations
- **Database Schema**: Drizzle ORM schema definitions with PostgreSQL dialect (ready for production database)
- **Sample Data**: Pre-populated mock users and challenges for demo purposes

### Authentication and Authorization
- **Mock Authentication**: Simple user ID-based system with hardcoded user profiles
- **Session Management**: Client-side user identification without actual authentication flows
- **User Management**: Mock user lookup system with predefined usernames and IDs

### External Dependencies
- **UI Components**: Comprehensive shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme supporting dark mode and orange/black skateboarding aesthetic
- **Icons**: Lucide React for consistent iconography throughout the application
- **Fonts**: Google Fonts integration (Inter, Permanent Marker) for typography hierarchy
- **Build Tools**: Vite with TypeScript support, PostCSS for CSS processing
- **Development**: Replit-specific plugins for error overlays and development banner integration

The architecture prioritizes developer experience with hot reloading, type safety throughout the stack, and modular component design while maintaining a skateboarding culture aesthetic with THPS-inspired visual elements.