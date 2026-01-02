import { supabase } from './supabase';

/**
 * Hotmart Integration Service
 * Handles the logic for premium access unlocking via Hotmart webhooks.
 */

export interface HotmartWebhookPayload {
    event: 'PURCHASE_APPROVED' | 'PURCHASE_CANCELED' | 'PURCHASE_REFUNDED';
    data: {
        purchase: {
            status: string;
            order_bump: boolean;
        };
        buyer: {
            email: string;
            name: string;
        };
        product: {
            id: number;
            name: string;
        };
    };
}

export const hotmartService = {
    /**
     * Processes a Hotmart Webhook.
     * In a real production environment, this would be an Edge Function/Backend endpoint.
     * This utility facilitates the logic for that transition.
     */
    async processPurchase(email: string, status: HotmartWebhookPayload['event']) {
        const isPremium = status === 'PURCHASE_APPROVED';

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_premium: isPremium })
                .eq('email', email.toLowerCase());

            if (error) throw error;
            console.log(`[Hotmart] Access updated for ${email}: ${isPremium ? 'PREMIUM' : 'FREE'}`);
            return { success: true };
        } catch (err) {
            console.error('[Hotmart] Error updating access:', err);
            return { success: false, error: err };
        }
    },

    /**
     * Simulation method for testing purposes ONLY.
     * This mimics what the Hotmart Webhook would do.
     */
    async simulatePurchase(email: string) {
        console.log(`[Hotmart] Simulating purchase for ${email}...`);
        return this.processPurchase(email, 'PURCHASE_APPROVED');
    },

    /**
     * Generates the Hotmart checkout URL with pre-filled email.
     */
    getCheckoutUrl(hotmartId: string, userEmail?: string) {
        const baseUrl = `https://pay.hotmart.com/${hotmartId}`;
        if (!userEmail) return baseUrl;
        return `${baseUrl}?email=${encodeURIComponent(userEmail)}`;
    }
};
