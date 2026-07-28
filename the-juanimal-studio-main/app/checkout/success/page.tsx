import Link from "next/link";
import Stripe from "stripe";
import { Nav } from "@/components/Nav";
import { PageShell } from "@/components/PageShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order confirmed — The Juanimal Studio",
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  // Verify the session with Stripe rather than trusting the redirect — anyone
  // can navigate to this URL directly, so a bare "thanks!" page would happily
  // confirm orders that were never paid for.
  let paid = false;
  let email: string | null = null;
  let total: string | null = null;

  const secret = process.env.STRIPE_SECRET_KEY;
  if (secret && sessionId) {
    try {
      const stripe = new Stripe(secret);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      email = session.customer_details?.email ?? null;
      if (session.amount_total != null) {
        total = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: (session.currency ?? "usd").toUpperCase(),
        }).format(session.amount_total / 100);
      }
    } catch {
      paid = false;
    }
  }

  return (
    <PageShell page="merch">
      <Nav active="merch" />
      <header className="merch-hero" id="top">
        <span className="eyebrow">Studio Merch</span>
        <h1>{paid ? "Order confirmed" : "Order not found"}</h1>
        <p>
          {paid
            ? "The spell is cast. Your parcel is being pressed, packed and posted."
            : "We couldn't confirm this order. If you were charged, get in touch and we'll sort it out."}
        </p>
      </header>

      <section className="sec-pad" style={{ maxWidth: 620, margin: "0 auto" }}>
        <div
          style={{
            background: "var(--cream)",
            border: "4px solid var(--ink)",
            borderRadius: 14,
            boxShadow: "7px 7px 0 var(--ink)",
            padding: "clamp(20px,3vw,32px)",
            textAlign: "center",
          }}
        >
          {paid ? (
            <>
              {total && (
                <p
                  style={{
                    fontFamily: "var(--disp)",
                    fontSize: "clamp(30px,5vw,44px)",
                    margin: "0 0 10px",
                  }}
                >
                  {total}
                </p>
              )}
              {email && (
                <p style={{ fontSize: 14, color: "var(--rust)", marginBottom: 22 }}>
                  A receipt is on its way to {email}.
                </p>
              )}
              <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                Tracking details follow once it ships. Standard international
                delivery runs 7&ndash;14 business days, express 3&ndash;5.
              </p>
            </>
          ) : (
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Head back to the shop, or reach the studio at{" "}
              <a href="mailto:colombojuanb@gmail.com">colombojuanb@gmail.com</a>.
            </p>
          )}

          <Link className="cta-btn" href="/merch">
            Back to the shop
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
