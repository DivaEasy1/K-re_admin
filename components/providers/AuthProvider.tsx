"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { getCurrentAdmin, loginAdmin, logoutAdmin, type AuthUser } from "@/lib/auth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

const AUTH_QUERY_KEY = ["auth", "current-admin"] as const;

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthGate({
  children,
  isLoading,
  isAuthenticated,
  errorMessage
}: {
  children: React.ReactNode;
  isLoading: boolean;
  isAuthenticated: boolean;
  errorMessage: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.replace("/login");
    }

    if (!isLoading && isAuthenticated && isLoginPage) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  if (isLoading && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner className="h-8 w-8" />
            <div className="space-y-1">
              <p className="font-display text-lg font-semibold">Verification de la session</p>
              <p className="text-sm text-muted-foreground">Connexion a l&apos;espace d&apos;administration...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (errorMessage && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg p-6">
          <div className="space-y-2 text-center">
            <p className="font-display text-lg font-semibold">Serveur indisponible</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isLoginPage && !isAuthenticated) {
    return null;
  }

  if (isLoginPage && isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getCurrentAdmin,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: sessionQuery.data ?? null,
      isAuthenticated: Boolean(sessionQuery.data),
      isLoading: sessionQuery.isPending,
      signIn: async (email, password) => {
        const user = await loginAdmin(email, password);
        queryClient.setQueryData(AUTH_QUERY_KEY, user);
        return user;
      },
      signOut: async () => {
        await logoutAdmin();
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
      }
    }),
    [queryClient, sessionQuery.data, sessionQuery.isPending]
  );

  const errorMessage = sessionQuery.error instanceof Error ? sessionQuery.error.message : null;

  return (
    <AuthContext.Provider value={value}>
      <AuthGate
        isLoading={sessionQuery.isPending}
        isAuthenticated={Boolean(sessionQuery.data)}
        errorMessage={errorMessage}
      >
        {children}
      </AuthGate>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit etre utilise dans AuthProvider.");
  }

  return context;
}
