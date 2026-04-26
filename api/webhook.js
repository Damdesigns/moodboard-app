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
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "customer.subscription.created" || 
      event.type === "invoice.payment_succeeded") {
    const email = event.data.object.customer_email || 
                  event.data.object.customer_details?.email;
    if (email) {
      await supabase.from("users").update({ is_pro: true }).eq("email", email);
    }
  }

  res.status(200).json({ received: true });
}