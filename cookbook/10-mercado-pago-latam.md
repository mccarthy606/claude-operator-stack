# Mercado Pago for LATAM Payments

> **Time:** ~3h (longer if you have not used the Argentine MP dashboard before)
> **Stack:** Mercado Pago Checkout Pro, Next.js (or any backend with HTTP), Argentina-specific quirks
> **Used in:** [P2P Marketplace](../case-studies/) and any product targeting Argentine / LATAM buyers

## The problem

Stripe does not operate in Argentina. Cards issued in Argentina often fail at non-LATAM payment processors. The dominant payment platform across the region is Mercado Pago, owned by MercadoLibre, with deep integration into local banking, Pix in Brazil, debit cards, and cash payment networks (Pago Fácil, Rapipago).

If you sell to LATAM buyers, you eventually need MP. The docs are usable but split between English and Spanish, the dashboard has a learning curve, and the webhook flow has Argentina-specific behaviors not documented in the global guide.

## Solution overview

Use **Checkout Pro** (the hosted payment page) for the first version. Skip Checkout Bricks and the Direct API — they exist for reasons that do not apply to a v0. Create a `Preference` server-side, redirect the buyer to the hosted page, handle the IPN/webhook on `payment.updated`, and verify status by re-fetching the payment from the API rather than trusting the webhook payload alone.

## Step-by-step

### 1. Get credentials

Create a Mercado Pago account in your target country (Argentina is `mercadopago.com.ar`, Mexico `.com.mx`, Brazil `.com.br`). Each country is a separate account; cross-border MP is a different product.

In **Your business → Configuration → Credentials**:

- **Test credentials** for development: Public Key + Access Token
- **Production credentials** issued after you complete identity verification

Argentina-specific: identity verification (CUIT/CUIL) takes a few business days. Start it the same day you start coding.

### 2. Install the SDK

```bash
pnpm add mercadopago
```

`lib/mp.ts`:

```typescript
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error('MP_ACCESS_TOKEN is not set');
}

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 },
});

export const preference = new Preference(mp);
export const payment = new Payment(mp);
```

### 3. Create a Preference

A Preference is MP's term for "a checkout intent." It contains items, success/failure URLs, and crucially, an `external_reference` you use to tie the payment back to your own order.

```typescript
import { preference } from '@/lib/mp';
import { randomUUID } from 'crypto';

export async function createCheckout(orderId: string, items: CartItem[]) {
  const idempotencyKey = randomUUID();

  const result = await preference.create({
    body: {
      items: items.map(i => ({
        id: i.sku,
        title: i.title,
        quantity: i.qty,
        unit_price: i.priceArs,
        currency_id: 'ARS',
      })),
      external_reference: orderId,
      back_urls: {
        success: `${process.env.APP_URL}/orders/${orderId}/success`,
        failure: `${process.env.APP_URL}/orders/${orderId}/failure`,
        pending: `${process.env.APP_URL}/orders/${orderId}/pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.APP_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'YOURBRAND',
    },
    requestOptions: { idempotencyKey },
  });

  return result.init_point;
}
```

Always pass an `idempotencyKey`. MP accepts it on most write endpoints and prevents the dread "user double-clicks Pay" duplicate preference.

### 4. Webhook receiver

MP's webhook (called IPN historically, now "Notifications") sends a small payload with a payment ID. You re-fetch the payment to get full state. This indirection prevents trusting a forgeable webhook body.

```typescript
// app/api/webhooks/mercadopago/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { payment } from '@/lib/mp';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type !== 'payment') {
    return NextResponse.json({ ignored: true });
  }

  const paymentId = body.data?.id;
  if (!paymentId) return NextResponse.json({ ok: true });

  const p = await payment.get({ id: paymentId });

  if (p.status === 'approved') {
    await db.order.update({
      where: { id: p.external_reference! },
      data: { status: 'paid', mpPaymentId: String(p.id) },
    });
  } else if (p.status === 'rejected' || p.status === 'cancelled') {
    await db.order.update({
      where: { id: p.external_reference! },
      data: { status: 'failed' },
    });
  }

  return NextResponse.json({ ok: true });
}
```

MP webhooks come from a fixed set of IP ranges; you can additionally add HTTP signature validation via the `x-signature` and `x-request-id` headers if you set a secret in the dashboard. For v0 the re-fetch pattern alone is sufficient.

### 5. Idempotency on your side

MP retries webhooks for the same payment ID up to several times. Make the handler idempotent:

```typescript
const existing = await db.order.findUnique({ where: { id: p.external_reference! } });
if (existing?.status === 'paid' && p.status === 'approved') {
  return NextResponse.json({ already_processed: true });
}
```

### 6. Local dev

MP also will not POST to localhost. Same fix as everywhere — Cloudflare Tunnel, see [recipe 04](04-cloudflare-argo-local-dev.md). MP's notification URL is set per-Preference so you do not need to update a global webhook setting between dev and prod; you just pass the correct `notification_url` for the environment.

### 7. Argentina-specific quirks

- **AFIP / billing**: MP automatically issues a fiscal receipt (Factura A/B/C) depending on the buyer's tax status. You do not control this directly. If you sell B2B and the buyer needs Factura A, ensure the buyer's CUIT is captured at checkout via `payer.identification`.
- **Installments (`cuotas`)**: Argentine buyers expect 3, 6, 12 installment options. These work automatically based on the issuer; you can cap with `payment_methods.installments`.
- **Cash payment methods**: Pago Fácil and Rapipago return `pending` status for up to 72 hours until the buyer pays the cash voucher. Your `pending` page must say so explicitly or you get refund requests from confused buyers.
- **Currency**: ARS only for AR accounts. To sell in USD to AR buyers, use the MX or US account, both of which have different verification requirements and different installment behaviors.

## Pitfalls

- **Trusting the webhook payload directly.** Always re-fetch via `payment.get()`. MP IPN bodies are minimal and easily forged if your endpoint is reachable from anywhere.
- **No idempotency on the order update.** MP retries the same payment ID. Without idempotency you double-credit, double-fulfill, and confuse the dashboard.
- **Preferences without `external_reference`.** Without it you cannot tie a payment back to your order and reconciliation becomes manual. Always set it.
- **Test credentials in prod by accident.** MP test credentials look exactly like production credentials. Wire env vars from day one and never copy-paste a key into code.
- **Country mismatch.** A user in Mexico cannot pay against your Argentine MP account using Mexican cards reliably. Pick the country that matches your buyer base. If you sell across countries, run separate accounts and route at checkout.
- **Skipping the `back_urls` setup.** Buyers who hit a "Continue" button after payment expect to land somewhere. With `back_urls` unset they bounce on a generic MP page and many do not return.

## References

- [Mercado Pago developer docs (EN)](https://www.mercadopago.com/developers/en)
- [Checkout Pro guide](https://www.mercadopago.com/developers/en/docs/checkout-pro/landing)
- [Notifications / IPN docs](https://www.mercadopago.com/developers/en/docs/your-integrations/notifications/webhooks)
- [recipe 04 — Cloudflare Tunnel for the local webhook](04-cloudflare-argo-local-dev.md)
- [recipe 06 — Sentry on the webhook handler](06-sentry-fullstack.md)
