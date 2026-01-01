# Integration Services Domain

**Lead**: Platform Engineering Team  
**Focus**: External service integration, tool evaluation, build vs buy decisions

---

## Overview

This domain documents recommended external services and our capabilities - what we use vs what we build. Following the Pareto principle (80/20), we focus on the essential tools that solve most problems.

---

## Quick Links

- [Email Services](./implementation/email-services.md) - Email integration options
- [Payment Services](./implementation/payment-services.md) - Payment gateway options  
- [CI/CD Tools](./implementation/ci-cd-tools.md) - CI/CD pipeline tools
- [Capabilities Matrix](./implementation/capabilities-matrix.md) - Build vs Buy decisions

---

## Recommended Tools (Pareto 80/20)

### Email: Resend ⭐
- **Why**: Best developer experience, React Email support, modern API
- **Setup**: `npm install resend`
- **Free Tier**: 3,000 emails/month
- **Use Cases**: Verification, password reset, notifications, welcome emails
- **Documentation**: [Email Services Guide](./implementation/email-services.md)

### Payments: Stripe ⭐
- **Why**: Best developer experience, most flexible, industry standard
- **Setup**: `npm install stripe @stripe/stripe-js`
- **Features**: Subscriptions, one-time payments, webhooks, customer portal
- **Pricing**: 2.9% + $0.30 per transaction
- **Documentation**: [Payment Services Guide](./implementation/payment-services.md)

### CI/CD: Vercel + GitHub Actions ⭐
- **Why**: Zero configuration for Next.js, automatic deployments
- **Setup**: Connect GitHub repo to Vercel
- **Features**: Auto-deploy, preview deployments, zero config
- **Documentation**: [CI/CD Tools Guide](./implementation/ci-cd-tools.md)

---

## Key Principles

1. **Use Existing Tools** - Don't reinvent the wheel. Leverage proven solutions.
2. **Developer Experience First** - Choose tools with great DX and documentation.
3. **Simple Integration** - Prefer plug-and-play solutions over complex setups.
4. **Cost-Effective** - Consider free tiers and transparent pricing.
5. **Pareto Principle** - 20% of tools solve 80% of problems.

---

## Decision Framework

### When to Use Existing Tools
- ✅ Industry-standard functionality (email, payments, auth)
- ✅ Complex compliance requirements (PCI-DSS, GDPR)
- ✅ High maintenance overhead if built in-house
- ✅ Better tested and more reliable than custom solutions

### When to Build Custom
- ✅ Unique business logic specific to our domain
- ✅ Competitive advantage through custom features
- ✅ Integration with proprietary systems
- ✅ Cost savings at scale (after evaluation)

---

## Integration Patterns

### Standard Integration Flow
1. **Research** - Evaluate options using capabilities matrix
2. **Spike** - Quick proof of concept
3. **Document** - Add to this domain documentation
4. **Implement** - Simple wrapper/service layer
5. **Test** - Verify integration works
6. **Deploy** - Add to template/active projects

---

## Related Domains

- [Platform Engineering](../platform-engineering/README.md) - Infrastructure and deployment
- [Security](../security/README.md) - Security considerations for integrations

---

**Last Updated**: 2025-01-01  
**Maintained By**: Platform Engineering Team

