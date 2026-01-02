/**
 * Stripe Webhook Handler (Reference Implementation)
 * 
 * Deploy this code to a Supabase Edge Function (or any Node.js backend).
 * 
 * Prerequisites:
 * 1. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in your environment variables.
 * 2. Configure a Stripe Webhook to point to this function's URL.
 *    Select event: 'checkout.session.completed'
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import Stripe from "https://esm.sh/stripe@11.1.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
    apiVersion: "2022-11-15",
    httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
    const signature = req.headers.get("Stripe-Signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
        return new Response("Missing signature or secret", { status: 400 });
    }

    let event;
    try {
        const body = await req.text();
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret, undefined, cryptoProvider);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return new Response(err.message, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userEmail = session.customer_details?.email;
        // const userId = session.client_reference_id; // If you passed it in the checkout

        console.log(`Processing subscription for: ${userEmail}`);

        if (userEmail) {
            // Initialize Supabase Client
            const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
            const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
            const supabase = createClient(supabaseUrl, supabaseServiceKey);

            // Update Profile to Premium
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_premium: true,
                    // You might want to store stripe_customer_id here too
                })
                .eq('email', userEmail.toLowerCase());

            if (error) {
                console.error("Error updating profile:", error);
                return new Response("Database update failed", { status: 500 });
            }
            console.log("Profile updated successfully.");
        }
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
    });
});
