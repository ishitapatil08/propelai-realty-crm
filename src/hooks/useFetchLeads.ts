'use client';

import { useQuery } from '@tanstack/react-query';

interface Lead {
  id: string;
  tenant_id: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  budget?: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Visit Scheduled' | 'Won' | 'Lost';
  assigned_user_id?: string;
  score?: number;
  created_at: string;
  updated_at: string;
}

interface LeadsResponse {
  success: boolean;
  data: Lead[];
  count: number;
}

export function useFetchLeads() {
  return useQuery<LeadsResponse>({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await fetch('/api/leads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please login');
        }
        throw new Error('Failed to fetch leads');
      }

      return response.json();
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}

export type { Lead, LeadsResponse };
