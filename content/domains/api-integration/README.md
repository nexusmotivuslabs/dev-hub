# API Integration

API integration patterns, best practices, and examples for Nexus technology stack.

## Overview

This domain covers API integration fundamentals, patterns, and best practices used across Nexus applications.

## Nexus Technology Stack

### Backend
- **Java/Spring Boot** - Primary backend framework
- **PostgreSQL** - Database
- **REST APIs** - Standard API style

### Frontend
- **React/Vite** - Client-side applications
- **Next.js** - Full-stack applications (with BFF pattern)
- **TypeScript** - Type-safe development

### Authentication
- **Google OAuth** - Primary authentication method
- **JWT Tokens** - Session management

## Core Concepts

### API Categories

**REST APIs** (Primary - 90% of use cases)
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON data format
- Stateless communication
- Used for CRUD operations

**GraphQL** (Optional - for complex queries)
- Single endpoint for all queries
- Client specifies exact data needed
- Reduces over-fetching
- Best for complex nested queries

### Universal Technologies

**HTTP/HTTPS**
- Foundation of all web APIs
- Request/Response model
- Status codes (200, 201, 400, 404, 500)
- Works across all languages and platforms

**JSON**
- De facto standard for data exchange
- Human-readable
- Language-agnostic
- Supported everywhere

**OpenAPI/Swagger**
- API contract documentation
- Code generation support
- API testing tools
- Standard format

## The Contract

Java (Spring Boot) and React communicate through **HTTP + JSON** - a universal contract that works regardless of language.

**Key Principle**: The frontend doesn't need to know Java, and the backend doesn't need to know React. They only need to agree on:
- HTTP methods (GET, POST, PUT, DELETE)
- Endpoint URLs
- JSON data format
- Status codes

## Navigation

### Backend
- [Backend Overview](/domains/api-integration/backend)
- [Java Backend](/domains/api-integration/backend/java)

### Frontend
- [Frontend Overview](/domains/api-integration/frontend)
- [React Frontend](/domains/api-integration/frontend/react)

## Related

- [Integration Services](/domains/integration-services)
- [Security](/domains/security)
- [Platform Engineering](/domains/platform-engineering)
- [Architecture Patterns](/40-reference/architecture)