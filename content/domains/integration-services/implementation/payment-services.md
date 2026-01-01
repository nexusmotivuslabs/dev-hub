# Payment Services

## Recommended: Stripe ⭐

**Why**: Best developer experience, most flexible, industry standard, excellent documentation

### Quick Start

```bash
npm install stripe @stripe/stripe-js
```

### Basic Usage

```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  mode: 'subscription',
  success_url: `${url}/success`,
  cancel_url: `${url}/cancel`,
})
```

### Pricing
- **2.9% + $0.30 per transaction**
- No monthly fees
- No setup fees
- Free for first $1M in revenue (Stripe Atlas)

### Features
- ✅ Subscriptions (recurring billing)
- ✅ One-time payments
- ✅ Payment intents (secure payments)
- ✅ Webhooks (event handling)
- ✅ Customer portal (self-service)
- ✅ Tax calculation
- ✅ Multi-currency
- ✅ Multiple payment methods
- ✅ PCI compliance handled

### Use Cases
- SaaS subscriptions
- One-time purchases
- Marketplace payments
- Donations
- Invoicing

### Integration Example

```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// Create checkout session
export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
  customerId,
}: {
  priceId: string
  successUrl: string
  cancelUrl: string
  customerId?: string
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}
```

### Webhook Handler

```typescript
// app/api/stripe/webhook/route.ts
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful checkout
      break
    case 'customer.subscription.updated':
      // Handle subscription updates
      break
  }

  return Response.json({ received: true })
}
```

---

## Alternative: Paddle

**Why**: Handles tax/VAT automatically, merchant of record

### Pricing
- 5% + $0.50 per transaction
- Handles all tax/VAT compliance

### When to Use
- ✅ SaaS apps wanting tax compliance handled
- ✅ International sales (tax complexity)
- ✅ Want to offload compliance burden

### Trade-offs
- ❌ Higher fees than Stripe
- ❌ Less flexible than Stripe
- ❌ Smaller ecosystem

---

## Alternative: PayPal

**Why**: Widely recognized, consumer trust, multiple payment methods

### Pricing
- 2.9% + $0.30 per transaction (similar to Stripe)

### When to Use
- ✅ Consumer-focused apps
- ✅ Need PayPal acceptance
- ✅ International markets (where PayPal is preferred)

### Trade-offs
- ❌ Less developer-friendly than Stripe
- ❌ More complex integration
- ❌ Limited subscription features

---

## Comparison Matrix

| Feature | Stripe | Paddle | PayPal |
|---------|--------|--------|--------|
| Developer Experience | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Subscription Support | ✅ Excellent | ✅ Good | ⚠️ Limited |
| Tax Handling | Manual | ✅ Automatic | Manual |
| Pricing | 2.9% + $0.30 | 5% + $0.50 | 2.9% + $0.30 |
| Webhooks | ✅ Excellent | ✅ Good | ⚠️ Basic |
| Customer Portal | ✅ Built-in | ✅ Built-in | ❌ |
| Best For | Most apps | SaaS (tax) | Consumer apps |

---

## Recommendation

**Use Stripe** for:
- ✅ Most applications (default choice)
- ✅ Best developer experience
- ✅ Most flexible and feature-rich
- ✅ Industry standard

**Use Paddle** for:
- ✅ SaaS apps wanting tax/VAT handled
- ✅ International sales complexity
- ✅ Want to offload compliance

**Use PayPal** for:
- ✅ Consumer-focused apps
- ✅ Need PayPal acceptance
- ✅ Markets where PayPal is preferred

---

## Setup Checklist

1. ✅ Sign up at [stripe.com](https://stripe.com)
2. ✅ Get API keys (test and live)
3. ✅ Add `STRIPE_SECRET_KEY` to `.env`
4. ✅ Add `STRIPE_PUBLISHABLE_KEY` to `.env`
5. ✅ Add `STRIPE_WEBHOOK_SECRET` to `.env`
6. ✅ Install: `npm install stripe @stripe/stripe-js`
7. ✅ Create products/prices in Stripe dashboard
8. ✅ Set up webhook endpoint
9. ✅ Test with Stripe test cards
10. ✅ Handle webhook events

---

## Security Considerations

- ✅ Never expose secret keys to client
- ✅ Always verify webhook signatures
- ✅ Use HTTPS for webhooks
- ✅ Store customer IDs securely
- ✅ Follow PCI compliance guidelines

---

**Last Updated**: 2025-01-01

