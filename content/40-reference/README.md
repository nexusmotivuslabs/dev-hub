# 40. Reference

Architecture and technical reference documentation.

## Architecture

### System Overview

Our system follows a modular architecture:

- **Frontend**: Next.js application
- **Backend**: API routes and serverless functions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

### Key Components

- **API Layer**: RESTful API endpoints
- **Data Layer**: Prisma ORM for database access
- **Auth Layer**: NextAuth.js for authentication
- **UI Layer**: React components with Tailwind CSS

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

