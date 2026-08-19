'use client';

import { useQuery } from '@tanstack/react-query';

interface UserInfo {
  id: string;
  email?: string;
  name: string;
  role: 'super_admin' | 'tenant_admin' | 'staff';
}

interface TenantInfo {
  id: string;
  name: string;
  plan: string;
  status: string;
}

interface TenantResponse {
  success: boolean;
  data: {
    user: UserInfo;
    tenant: TenantInfo | null;
    tenantId: string | null;
  };
}

export function useTenant() {
  return useQuery<TenantResponse>({
    queryKey: ['tenant'],
    queryFn: async () => {
      const response = await fetch('/api/tenant', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized - please login');
        throw new Error('Failed to fetch tenant info');
      }

      return response.json();
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}

export type { UserInfo, TenantInfo, TenantResponse };
