"use client";

import { Inter } from "next/font/google";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const supabase = createClient();

  // Check session on mount and on auth state changes
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session && pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  // Force dark theme for admin
  useEffect(() => {
    setMounted(true);
    setTheme("dark");
    document.documentElement.classList.add("dark");
  }, [setTheme]);

  if (!mounted || loading) {
    return (
      <div className={`${inter.variable} min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] antialiased flex items-center justify-center`}>
        <div className="animate-pulse flex space-x-2">
          <div className="w-2 h-2 bg-[var(--admin-accent)] rounded-full" />
          <div className="w-2 h-2 bg-[var(--admin-accent)] rounded-full" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-[var(--admin-accent)] rounded-full" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    );
  }

  // Session is checked by middleware, but we also guard here for defense in depth
  if (!session && pathname !== "/admin/login") {
    return null; // Middleware will redirect
  }

  return (
    <div className={`${inter.variable} min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] antialiased`}>
      <AdminProviders>{children}</AdminProviders>
    </div>
  );
}
