import "server-only";
import Stripe from "stripe";

export type { Stripe as StripeType } from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey)
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");

export const stripe = new Stripe(secretKey, {
  apiVersion: "2025-09-30.clover",
});
