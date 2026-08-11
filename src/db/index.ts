import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

// Connection string should be provided via environment variables
const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

/**
 * Wraps Drizzle queries in a transaction that sets the Postgres RLS context 
 * so that `current_tenant_id()` correctly filters rows.
 */
export async function withTenant<T>(tenantId: string, callback: (tx: typeof db) => Promise<T>) {
  return await db.transaction(async (tx) => {
    await tx.execute(sql`set local role authenticated`);
    // Pass tenant_id as a claim in the JWT claims config which our Postgres function reads
    await tx.execute(sql`select set_config('request.jwt.claims', ${JSON.stringify({ tenant_id: tenantId })}, true)`);
    return await callback(tx as any);
  });
}
