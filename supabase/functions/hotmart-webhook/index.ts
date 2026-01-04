import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

serve(async (req) => {
    try {
        const body = await req.json();
        const event = body.event;
        const buyerEmail = body.data?.buyer?.email;

        console.log(`[Hotmart] Received event: ${event} for ${buyerEmail}`);

        // Hotmart standard events: PURCHASE_APPROVED, PURCHASE_CANCELED, etc.
        if (event === 'PURCHASE_APPROVED' && buyerEmail) {
            const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
            const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
            const supabase = createClient(supabaseUrl, supabaseServiceKey);

            const { error } = await supabase
                .from('profiles')
                .update({ is_premium: true })
                .eq('email', buyerEmail.toLowerCase());

            if (error) {
                console.error("[Hotmart] Error updating profile:", error);
                return new Response("Database update failed", { status: 500 });
            }
            console.log("[Hotmart] Profile updated to Premium.");
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error(`[Hotmart] Error processing webhook: ${err.message}`);
        return new Response(err.message, { status: 400 });
    }
});
