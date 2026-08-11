"use client";

import { useState, useEffect, useCallback } from "react";

export interface DashboardKPI {
  totalLeads: number;
  activeStaff: number;
  scheduledVisits: number;
  totalAiCalls: number;
  wonLeads: number;
  lostLeads: number;
  conversionRate: number;
  statusBreakdown: { status: string; count: number }[];
}

export interface LeaderboardRow {
  name: string;
  total: number;
  won: number;
  contacted: number;
}

interface UseDashboardResult {
  kpis: DashboardKPI | null;
  leaderboard: LeaderboardRow[];
  isLoading: boolean;
  error: string | null;
  fetchedAt: string | null;
  refetch: () => void;
}

const DEFAULT_KPI: DashboardKPI = {
  totalLeads: 0,
  activeStaff: 0,
  scheduledVisits: 0,
  totalAiCalls: 0,
  wonLeads: 0,
  lostLeads: 0,
  conversionRate: 0,
  statusBreakdown: [],
};

export function useDashboard(): UseDashboardResult {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/stats", {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setKpis(data.kpis ?? DEFAULT_KPI);
      setLeaderboard(data.leaderboard ?? []);
      setFetchedAt(data.fetchedAt ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
      setKpis(DEFAULT_KPI);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchDashboard, 120_000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return { kpis, leaderboard, isLoading, error, fetchedAt, refetch: fetchDashboard };
}
