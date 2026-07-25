import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useRoles() {
  const { user } = useAuth();

  const roles = user?.roles ?? [];

  const hasRole = useCallback(
    (role) => {
      if (!Array.isArray(roles)) return false;
      return roles.includes(role);
    },
    [roles]
  );

  const hasAnyRole = useCallback(
    (...requiredRoles) => {
      if (!Array.isArray(roles)) return false;
      return requiredRoles.some((r) => roles.includes(r));
    },
    [roles]
  );

  const hasAllRoles = useCallback(
    (...requiredRoles) => {
      if (!Array.isArray(roles)) return false;
      return requiredRoles.every((r) => roles.includes(r));
    },
    [roles]
  );

  return { roles, hasRole, hasAnyRole, hasAllRoles };
}
