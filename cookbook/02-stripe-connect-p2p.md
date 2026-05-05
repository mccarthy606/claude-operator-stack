# Stripe Connect for a P2P Marketplace

> **Time:** ~3h (clean run; double if it is your first Connect integration)
> **Stack:** Next.js 16, Stripe Connect (Express accounts), Stripe webhooks
> **Used in:** [case-studies/...](../case-studies/) (P2P Marketplace)

## The problem

You are building a peer-to-peer marketplace in Next.js. Sellers need to receive payouts to their own bank accounts. You need Stripe to handle KYB, identity verification, and payout scheduling. You do not want to write any of that yourself, and you do not want to hold seller funds on your platform balance any longer than the API requires.

Stripe Connect handles all of this, but the docs cover four account types and three onboarding flows. The recipe below picks one shape — Express accounts with hosted onboarding — and walks the wiring end to end.

## Solution overview

Express accounts plus hosted onboarding plus a single `account.updated` webhook. Stripe owns the onboarding UI, the KYB flow, and the dashboard. Your job is to create the account, generate an account link, redirect, and listen for status changes.

Hold off on direct charges, destination charges, and the Connect dashboard until you have the basic onboarding round-trip working. Most P2P marketplaces only ever need separate charges with `transfer_data[destination]`.

## Step-by-step

### 1. Install the SDK

```bash
pnpm add stripe
pnpm add -D @types/stripe
```

In `lib/stripe.ts`:

```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});
```

Pin the API version. The default `apiVersion` follows your account default which can change without warning.

### 2. Create the connected account

In a server action or API route:

```typescript
import { stripe } from '@/lib/stripe';

export async function createSellerAccount(userId: string, email: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: { userId },
  });

  await db.user.update({
    where: { id: userId },
    data: { stripeAccountId: account.id },
  });

  return account;
}
```

Store the `account.id` on the user row. You will need it for every payout-related operation.

### 3. Generate the onboarding link

```typescript
export async function createOnboardingLink(stripeAccountId: string) {
  const link = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${process.env.APP_URL}/seller/onboarding/refresh`,
    return_url: `${process.env.APP_URL}/seller/onboarding/complete`,
    type: 'account_onboarding',
  });

  return link.url;
}
```

Account links are short-lived (a few minutes). Generate fresh per request, do not cache.

### 4. Webhook receiver for `account.updated`

In `app/api/webhooks/stripe/route.ts`:

```typescript
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  if (event.type === 'account.updated') {
    const account = event.data.object;
    const chargesEnabled = account.charges_enabled;
    const payoutsEnabled = account.payouts_enabled;
    const detailsSubmitted = account.details_submitted;

    await db.user.update({
      where: { stripeAccountId: account.id },
      data: { chargesEnabled, payoutsEnabled, detailsSubmitted },
    });
  }

  return NextResponse.json({ received: true });
}
```

Use `request.text()`, not `request.json()`. Stripe's signature check needs the raw body byte-for-byte.

### 5. Local dev — the webhook problem

Stripe will not POST to `localhost`. Two options:

- Stripe CLI: `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`
- Cloudflare Tunnel for a persistent hostname (see [recipe 04](04-cloudflare-argo-local-dev.md))

For most flows the Stripe CLI is enough. For multi-day Connect debugging, Cloudflare Tunnel wins because the Connect dashboard URL stays the same across restarts.

### 6. Charge with destination transfer

When a buyer pays, send the seller's cut directly:

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{ price_data: {/* ... */}, quantity: 1 }],
  payment_intent_data: {
    application_fee_amount: platformFeeInCents,
    transfer_data: { destination: seller.stripeAccountId },
  },
  success_url: `${process.env.APP_URL}/orders/success`,
  cancel_url: `${process.env.APP_URL}/orders/cancel`,
});
```

Stripe handles the split. Your platform balance only ever sees the `application_fee_amount`.

## Pitfalls

- **KYB requirements vary by country.** A seller in the US can complete onboarding in 5 minutes. A seller in Argentina or Brazil may hit `requirements.currently_due` items that block charges for days. Always check `requirements.currently_due` and `requirements.eventually_due` after `account.updated`, not just `details_submitted`.
- **Account link expiry surprises in production.** Users who walk away mid-onboarding return to a dead link. Always provide a "resume onboarding" button that calls `accountLinks.create` again, do not store the link URL.
- **Webhook signature failures from body parsing middleware.** Frameworks like Express transform the body before it reaches the handler. In Next.js app router `request.text()` works because the framework does not pre-parse, but in pages router or any custom middleware setup you must disable body parsing for the webhook route.
- **Test mode accounts behave differently from live.** Test mode skips most KYB. Always test the live flow with a real beta seller before opening signups.
- **Application fee minus Stripe fee — who pays?** By default Stripe's processing fee is deducted from the connected account, not your platform fee. If you want the platform to absorb the Stripe fee, set `on_behalf_of` and pass `application_fee_amount` accordingly. Read the [fees doc](https://stripe.com/docs/connect/destination-charges#fees) twice.

## References

- [Stripe Connect Express docs](https://stripe.com/docs/connect/express-accounts)
- [Account links API](https://stripe.com/docs/api/account_links)
- [Webhook signature verification](https://stripe.com/docs/webhooks/signatures)
- [recipe 04 — Cloudflare Tunnel for local webhook dev](04-cloudflare-argo-local-dev.md)
- [recipe 06 — Sentry for the webhook handler](06-sentry-fullstack.md)
