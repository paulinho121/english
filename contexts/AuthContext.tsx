
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    sessionError: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    sessionError: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sessionError, setSessionError] = useState<string | null>(null);

    // Unique ID for this browser tab/instance
    const [localInstanceId] = useState(() => Math.random().toString(36).substring(7));

    useEffect(() => {
        // 1. Initial Session Check
        // 1. Initial Session Check
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
                if (session?.user) {
                    registerSession(session.user.id);
                }
            } catch (error) {
                console.error('Session check failed:', error);
            } finally {
                setLoading(false);
            }
        };
        checkSession();

        // 2. Auth State Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                registerSession(session.user.id);
            } else {
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // 3. Single Session Enforcement
    // We subscribe to the 'profiles' table. If the 'current_session_id' changes 
    // and doesn't match OUR localInstanceId, it means someone logged in elsewhere.
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    const newSessionId = payload.new.current_session_id;
                    if (newSessionId && newSessionId !== localInstanceId) {
                        // Someone else logged in!
                        setSessionError('Você conectou em outro dispositivo. Esta sessão foi desconectada.');
                        supabase.auth.signOut();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, localInstanceId]);

    const registerSession = async (userId: string) => {
        // Upsert profile with current session ID
        // Note: The 'profiles' table must exist in Supabase
        try {
            console.log('📝 Registering session for user:', userId);
            const { error } = await supabase.from('profiles').upsert({
                id: userId,
                current_session_id: localInstanceId,
                last_seen: new Date().toISOString()
            });
            if (error) console.error('❌ Error registering session (profile upsert):', error);
            else console.log('✅ Session registered successfully (profile updated)');
        } catch (err) {
            console.error('❌ Unexpected error registering session:', err);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSessionError(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, sessionError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
