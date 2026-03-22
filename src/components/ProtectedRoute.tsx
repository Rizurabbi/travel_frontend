// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireSupportAccess?: boolean; // Optional: require support access
}

export const ProtectedRoute = ({ children, requireSupportAccess = false }: ProtectedRouteProps) => {
  const { user, token, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and no user/token, redirect to auth
    if (!isLoading && (!user || !token)) {
      navigate('/auth', { 
        replace: true,
        state: { from: location.pathname } // Save where they were trying to go
      });
    }

    // If requires support access and user doesn't have it
    if (!isLoading && user && requireSupportAccess && !user.support_access.has_access) {
      navigate('/support-access', { replace: true });
    }
  }, [user, token, isLoading, requireSupportAccess, navigate]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#001540' }} />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user/token, don't render (will redirect in useEffect)
  if (!user || !token) {
    return null;
  }

  // If requires support access but user doesn't have it, don't render
  if (requireSupportAccess && !user.support_access.has_access) {
    return null;
  }

  // User is authenticated (and has support access if required), render children
  return <>{children}</>;
};
