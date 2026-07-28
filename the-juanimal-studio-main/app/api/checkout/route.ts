import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS, SHIPPING_RATES } from "@/lib/products";

export const runtime = "nodejs";

type IncomingLine = { id?: string; variant?: string; qty?: number };

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret);

  let body: { items?: IncomingLine[]; shipping?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const incoming = Array.isArray(body.items) ? body.items : [];
  if (incoming.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Resolve every line against the server catalogue. Anything unrecognised is
  // rejected outright rather than silently skipped, so a malformed cart fails
  // loudly instead of charging for a partial order.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const line of incoming) {
    const product = line.id ? PRODUCTS[line.id] : undefined;
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${line.id ?? "(missing id)"}` },
        { status: 400 }
      );
    }

    const qty = Number.isInteger(line.qty) ? Number(line.qty) : 0;
    if (qty < 1 || qty > 20) {
      return NextResponse.json(
        { error: `Invalid quantity for ${product.title}.` },
        { status: 400 }
      );
    }

    let name = product.title;
    if (line.variant && product.variants?.includes(line.variant as never)) {
      const v = line.variant;
      name = `${product.title} — ${v.charAt(0).toUpperCase()}${v.slice(1)}`;
    }

    lineItems.push({
      quantity: qty,
      price_data: {
        currency: product.currency,
        unit_amount: product.unitAmount,
        product_data: { name },
      },
    });
  }

  const rate = SHIPPING_RATES[body.shipping ?? "standard"] ?? SHIPPING_RATES.standard;

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/merch`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [
          "ES", "PT", "FR", "DE", "IT", "NL", "BE", "IE", "GB",
          "US", "CA", "MX", "AR", "BR", "CL", "UY", "CO",
          "AU", "NZ", "JP",
        ],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: rate.amount, currency: "usd" },
            display_name: rate.label,
            delivery_estimate: {
              minimum: { unit: "business_day", value: rate.minDays },
              maximum: { unit: "business_day", value: rate.maxDays },
            },
          },
        },
      ],
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Stripe.errors.StripeError
        ? err.message
        : "Could not start checkout. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
