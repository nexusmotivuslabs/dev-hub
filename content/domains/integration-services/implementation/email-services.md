# Email Services

## Recommended: Resend ⭐

**Why**: Best developer experience, modern API, React Email support, TypeScript-first

### Quick Start

```bash
npm install resend
```

### Basic Usage

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'onboarding@yourdomain.com',
  to: user.email,
  subject: 'Welcome!',
  html: '<p>Welcome to our app!</p>'
})
```

### Free Tier
- **3,000 emails/month**
- 100 emails/day sending limit
- No credit card required

### Pricing
- Free: 3,000 emails/month
- Pro: $20/month for 50,000 emails
- Pay-as-you-go: $0.40 per 1,000 emails

### Features
- ✅ React Email support (component-based templates)
- ✅ TypeScript SDK
- ✅ Webhooks for delivery tracking
- ✅ Domain verification
- ✅ Email analytics
- ✅ Simple API

### Use Cases
- Email verification
- Password reset
- Welcome emails
- Transactional notifications
- Marketing emails (with Pro plan)

### Integration Example

```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.RESEND_FROM_EMAIL || 'onboarding@yourdomain.com'
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set - email not sent')
    return { success: false }
  }

  try {
    const result = await resend.emails.send({ from, to, subject, html })
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
```

---

## Alternative: SendGrid

**Why**: Widely used, reliable, good free tier

### Free Tier
- **100 emails/day**
- 40,000 emails/month (after verification)

### Pricing
- Essentials: $19.95/month for 50,000 emails
- Pro: $89.95/month for 100,000 emails

### When to Use
- Need higher free tier volume
- Already using SendGrid
- Need advanced analytics

---

## Alternative: AWS SES

**Why**: Very low cost, scalable, AWS integration

### Pricing
- **$0.10 per 1,000 emails**
- Free tier: 62,000 emails/month (if on EC2)

### When to Use
- High volume (>100k emails/month)
- Already using AWS infrastructure
- Cost is primary concern

### Complexity
- ⚠️ More setup required
- ⚠️ Need to verify domains/emails
- ⚠️ Less developer-friendly API

---

## Comparison Matrix

| Feature | Resend | SendGrid | AWS SES |
|---------|--------|----------|---------|
| Free Tier | 3,000/month | 100/day | 62k/month* |
| Developer Experience | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Setup Complexity | Low | Low | Medium |
| React Email Support | ✅ | ❌ | ❌ |
| TypeScript SDK | ✅ | ✅ | ✅ |
| Best For | Modern apps | Enterprise | High volume |

*Free tier requires EC2 instance

---

## Recommendation

**Use Resend** for:
- ✅ New projects
- ✅ Modern Next.js apps
- ✅ Developer experience priority
- ✅ React Email templates

**Use SendGrid** for:
- ✅ Higher free tier needed
- ✅ Enterprise features required
- ✅ Existing SendGrid setup

**Use AWS SES** for:
- ✅ Very high volume (>100k/month)
- ✅ Already on AWS
- ✅ Cost is primary concern

---

## Setup Checklist

1. ✅ Sign up at [resend.com](https://resend.com)
2. ✅ Get API key from dashboard
3. ✅ Verify domain (for production)
4. ✅ Add `RESEND_API_KEY` to `.env`
5. ✅ Add `RESEND_FROM_EMAIL` to `.env`
6. ✅ Install: `npm install resend`
7. ✅ Create email service wrapper
8. ✅ Test email sending

---

**Last Updated**: 2025-01-01

