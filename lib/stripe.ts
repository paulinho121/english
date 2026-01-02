/**
 * Stripe Integration Service
 * Handles the logic for redirecting users to the Stripe Checkout page.
 */

export const stripeService = {
    /**
     * Redirects the user to the Stripe Checkout page.
     * 
     * @param priceId The Stripe Price ID for the subscription (optional if using a direct payment link).
     * @param userEmail The user's email to pre-fill in the checkout.
     */
    async redirectToCheckout(userEmail?: string) {
        // 1. PREFERRED METHOD: Use a Stripe Payment Link from the Dashboard
        // Replace this URL with your actual Stripe Payment Link (e.g., https://buy.stripe.com/...)
        // You can also append `?prefilled_email=` to these links.
        const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK;

        if (STRIPE_PAYMENT_LINK) {
            const url = new URL(STRIPE_PAYMENT_LINK);
            if (userEmail) {
                url.searchParams.set('prefilled_email', userEmail);
                // Pass the client_reference_id to track who bought it (if your webhook uses it)
                // url.searchParams.set('client_reference_id', userId); 
            }
            window.location.href = url.toString();
            return;
        }

        // 2. FALLBACK/ADVANCED: detailed error if no link provided
        console.error("Stripe Payment Link not configured. Please set VITE_STRIPE_PAYMENT_LINK in .env");
        alert("Erro de configuração: Link de pagamento não encontrado.");
    }
};
