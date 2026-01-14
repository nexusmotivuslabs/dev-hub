# 40. Reference

Architecture and technical reference documentation for Nexus technology stack.

## Architecture

### System Overview

Our system follows a modular architecture using Nexus technologies:

- **Frontend**: React (Vite) or Next.js applications
- **Backend**: Java (Spring Boot) or Next.js API routes
- **Database**: PostgreSQL
- **Authentication**: Google OAuth
- **Deployment**: 
  - Vercel (frontend with BFF pattern)
  - AWS (full-scale applications)

### Key Components

- **API Layer**: RESTful API endpoints
- **Data Layer**: 
  - Prisma ORM (for Node.js/TypeScript projects)
  - JPA/Hibernate (for Java/Spring Boot projects)
- **Auth Layer**: Google OAuth + JWT tokens
- **UI Layer**: React components with Tailwind CSS

### Technology Stack

**Backend Options:**
1. **Java/Spring Boot** - For enterprise applications
2. **Next.js API Routes** - For full-stack Next.js apps (BFF pattern)

**Frontend Options:**
1. **React + Vite** - For client-side applications
2. **Next.js** - For full-stack applications with SSR/SSG

**Database:**
- **PostgreSQL** - Primary database for all projects

**Cloud & Deployment:**
- **Vercel** - Frontend deployment (with BFF pattern)
- **AWS** - Full-scale application deployment

**Authentication:**
- **Google OAuth** - Primary authentication method

## Architecture Patterns

See [Architecture Patterns](/40-reference/architecture) for detailed diagrams and reusable patterns:

1. Frontend-Backend Communication
2. Authentication Flow
3. Protected Routes Pattern
4. API Request/Response Flow
5. Database Connection Pattern
6. Environment Configuration

## ADRs (Architecture Decision Records)

We document important architectural decisions:

1. **Technology Choices**: Why we chose specific technologies
2. **Pattern Decisions**: Design patterns we use and why
3. **Trade-offs**: What we considered and what we chose
4. **Alternatives**: What we didn't choose and why

### Creating an ADR

1. Create a new file in `docs/adr/`
2. Use the template: `ADR-XXX-title.md`
3. Document the decision, context, and consequences

## Runbooks

Runbooks provide step-by-step procedures for common operations:

- **Deployment**: How to deploy to production
- **Rollback**: How to rollback a deployment
- **Monitoring**: How to monitor system health
- **Incident Response**: How to respond to incidents
- **Database Migrations**: How to run migrations safely

### Runbook Structure

Each runbook includes:

1. **Prerequisites**: What you need before starting
2. **Steps**: Detailed step-by-step instructions
3. **Verification**: How to verify success
4. **Rollback**: How to undo if something goes wrong
5. **Troubleshooting**: Common issues and solutions

## Related

- [Tooling](/30-tooling)
- [Domains](/domains)
- [Platform Engineering](/domains/platform-engineering)
- [Architecture Patterns](/40-reference/architecture)
