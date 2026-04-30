import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const obj = event.data.object;

  // Try every possible place Stripe puts the email
  let email =
    obj.customer_email ||
    obj.customer_details?.email ||
    obj.billing_details?.email ||
    obj.receipt_email ||
    null;

  // If no email yet, fetch from Stripe customer object
  if (!email && obj.customer) {
    try {
      const customer = await stripe.customers.retrieve(obj.customer);
      email = customer.email;
    } catch (e) {
      console.error("Could not retrieve customer:", e.message);
    }
  }

  console.log("Webhook event:", event.type, "email:", email);

  if (
    event.type === "customer.subscription.created" ||
    event.type === "invoice.payment_succeeded" ||
    event.type === "checkout.session.completed"
  ) {
    if (email) {
      const { error } = await supabase
        .from("users")
        .update({ is_pro: true })
        .eq("email", email);
      if (error) console.error("Supabase update error:", error);
      else console.log("Pro status set for:", email);
    } else {
      console.error("No email found in event:", event.type);
    }
  }

  res.status(200).json({ received: true });
}