"use client";

import { useState, useEffect, useCallback } from "react";

export interface Property {
  id: string;
  tenantId: string;
  name: string;
  location: string | null;
  price: number | null;
  type?: string;
  bhk?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseFetchPropertiesResult {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  totalValue: number;
}

export function useFetchProperties(): UseFetchPropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/properties", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setProperties(data.properties ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const totalValue = properties.reduce((sum, p) => sum + (p.price ?? 0), 0);

  return { properties, isLoading, error, refetch: fetchProperties, totalValue };
}
