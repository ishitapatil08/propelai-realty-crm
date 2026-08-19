'use client';

import { useQuery } from '@tanstack/react-query';

interface DashboardStats {
  totalLeads: number;
  activeStaff: number;
  totalProperties: number;
  scheduledVisits: number;
  conversionRate: number;
  trend: string;
}

interface StatsResponse {
  success: boolean;
  data: DashboardStats;
}

export function useDashboardStats() {
  return useQuery<StatsResponse>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats', {
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
        throw new Error('Failed to fetch dashboard stats');
      }

      return response.json();
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // Refetch every 2 minutes
    refetchOnWindowFocus: true,
  });
}

export type { DashboardStats, StatsResponse };
