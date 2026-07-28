export type CartLine = {
  id: string;
  variant?: string;
  qty: number;
};

/**
 * Hands the cart to our API route, which prices it server-side and opens a
 * Stripe Checkout Session. We only ever send ids/variants/quantities — never
 * prices, and never card details, which go straight to Stripe's hosted page.
 */
export async function startCheckout(
  items: CartLine[],
  shipping: "standard" | "express" = "standard"
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, shipping }),
    });

    const data = await res.json();

    if (!res.ok || !data.url) {
      return { ok: false, error: data.error ?? "Could not start checkout." };
    }

    window.location.href = data.url;
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
