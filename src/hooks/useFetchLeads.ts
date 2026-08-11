"use client";

import { useState, useEffect, useCallback } from "react";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string | null;
  budget: number | null;
  status: "New" | "Contacted" | "Qualified" | "Visit Scheduled" | "Won" | "Lost";
  score: number | null;
  createdAt: string;
  updatedAt: string;
  assignedUserId: string | null;
  assignedName: string | null;
}

interface UseFetchLeadsResult {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchLeads(): UseFetchLeadsResult {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, isLoading, error, refetch: fetchLeads };
}
