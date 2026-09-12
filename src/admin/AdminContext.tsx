/**
 * Admin auth context — session, role, sign-in/out. RLS is the real
 * security boundary; this context only drives UI.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, auth, NotConfiguredError } from '../lib/adminApi';
import { hasBackend } from '../lib/supabase';

interface AdminContextType {
  user: AdminUser | null;
  loading: boolean;
  configured: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  loading: true,
  configured: hasBackend,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  clearError: () => {},
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasBackend) { setLoading(false); return; }
    let unsubscribe: (() => void) | undefined;
    auth.onUser((u) => { setUser(u); setLoading(false); }).then((unsub) => { unsubscribe = unsub; });
    return () => unsubscribe?.();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const u = await auth.signIn(email, password);
      setUser(u);
    } catch (e) {
      setError(e instanceof NotConfiguredError ? e.message : (e as Error).message || 'Sign-in failed');
      throw e;
    }
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AdminContext.Provider value={{ user, loading, configured: hasBackend, error, signIn, signOut, clearError: () => setError(null) }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
