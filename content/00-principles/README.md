# 00. Principles

Core development principles and values that guide Nexus development teams.

## Ownership & Responsibility

Every developer owns their code from conception to production. This means:

- Writing clear, maintainable code
- Writing tests for your code
- Ensuring your code works in all environments
- Taking responsibility for bugs and issues
- Documenting your decisions

## Safety Over Speed

We prioritize safety and correctness over speed:

- **Code Reviews**: All code must be reviewed before merging
- **Testing**: Write tests before or alongside code
- **Documentation**: Document complex logic and decisions
- **Monitoring**: Monitor production systems actively
- **Incidents**: Learn from incidents and prevent recurrence

## Promotion, Not Deployment

We use promotion-based deployments:

- Code flows through environments: Local → CI → Staging → Production
- Each environment validates the code
- Production is the final promotion, not a deployment
- Rollbacks are promotions of previous known-good versions

## Technology Focus

This Dev Hub focuses on technologies actually used in Nexus applications:

**Backend:**
- Java (Spring Boot, Spring Framework)
- PostgreSQL (database)
- AWS (cloud infrastructure)

**Frontend:**
- React (with Vite)
- Next.js (full-stack applications)
- TypeScript

**Deployment:**
- Vercel (frontend deployment with BFF pattern)
- AWS (full-scale applications)

**Authentication:**
- Google OAuth

We document patterns and practices for these specific technologies, not every framework in existence.

## Related

- [Developer Contracts](/10-developer-contracts)
- [Workflows](/20-workflows)
- [Tooling](/30-tooling)
- [Architecture Reference](/40-reference/architecture)
