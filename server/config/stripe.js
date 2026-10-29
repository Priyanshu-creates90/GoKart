import stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

// Fallback to a placeholder secret key if STRIPE_SECRET_KEY is not yet added to Vercel
// This prevents the Vercel serverless function from crashing during initialization.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_until_configured";
const Stripe = stripe(stripeSecretKey);

export default Stripe;
