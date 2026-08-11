import postgres from 'postgres';
import * as dotenv from 'dotenv';
import assert from 'node:assert';

dotenv.config({ path: '.env.local' });

async function run() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  try {
    // 1. Create 2 tenants
    const tenantA = await sql`INSERT INTO tenants (name, plan, status) VALUES ('Tenant A', 'Starter', 'Active') RETURNING id;`;
    const tenantA_id = tenantA[0].id;
    
    const tenantB = await sql`INSERT INTO tenants (name, plan, status) VALUES ('Tenant B', 'Starter', 'Active') RETURNING id;`;
    const tenantB_id = tenantB[0].id;

    // 2. Create leads for both
    await sql`INSERT INTO leads (tenant_id, name, phone, status) VALUES (${tenantA_id}, 'Lead A', '123', 'New');`;
    await sql`INSERT INTO leads (tenant_id, name, phone, status) VALUES (${tenantB_id}, 'Lead B', '456', 'New');`;

    // 3. Test queries as Tenant A
    await sql.begin(async (tx) => {
      // Set local config for this transaction
      await tx`set local role authenticated`;
      await tx`select set_config('request.jwt.claims', ${JSON.stringify({ tenant_id: tenantA_id })}, true)`;
      const leads = await tx`SELECT name FROM leads`;
      
      assert.strictEqual(leads.length, 1, `Expected 1 lead, got ${leads.length}`);
      assert.strictEqual(leads[0].name, 'Lead A', 'Tenant A should only see Lead A');
    });

    // 4. Test queries as Tenant B
    await sql.begin(async (tx) => {
      await tx`set local role authenticated`;
      await tx`select set_config('request.jwt.claims', ${JSON.stringify({ tenant_id: tenantB_id })}, true)`;
      const leads = await tx`SELECT name FROM leads`;
      
      assert.strictEqual(leads.length, 1, `Expected 1 lead, got ${leads.length}`);
      assert.strictEqual(leads[0].name, 'Lead B', 'Tenant B should only see Lead B');
    });
    
    // 5. Test properties isolation
    await sql`INSERT INTO properties (tenant_id, name) VALUES (${tenantA_id}, 'Property A');`;
    await sql`INSERT INTO properties (tenant_id, name) VALUES (${tenantB_id}, 'Property B');`;
    
    await sql.begin(async (tx) => {
      await tx`set local role authenticated`;
      await tx`select set_config('request.jwt.claims', ${JSON.stringify({ tenant_id: tenantA_id })}, true)`;
      const properties = await tx`SELECT name FROM properties`;
      assert.strictEqual(properties.length, 1, `Expected 1 property, got ${properties.length}`);
      assert.strictEqual(properties[0].name, 'Property A', 'Tenant A should only see Property A');
    });
    
    // 6. Test ai_calls isolation
    const leadA_id = (await sql`SELECT id FROM leads WHERE tenant_id = ${tenantA_id}`)[0].id;
    const leadB_id = (await sql`SELECT id FROM leads WHERE tenant_id = ${tenantB_id}`)[0].id;
    
    await sql`INSERT INTO ai_calls (tenant_id, lead_id, duration) VALUES (${tenantA_id}, ${leadA_id}, 60);`;
    await sql`INSERT INTO ai_calls (tenant_id, lead_id, duration) VALUES (${tenantB_id}, ${leadB_id}, 120);`;
    
    await sql.begin(async (tx) => {
      await tx`set local role authenticated`;
      await tx`select set_config('request.jwt.claims', ${JSON.stringify({ tenant_id: tenantB_id })}, true)`;
      const calls = await tx`SELECT duration FROM ai_calls`;
      assert.strictEqual(calls.length, 1, `Expected 1 ai_call, got ${calls.length}`);
      assert.strictEqual(calls[0].duration, 120, 'Tenant B should only see ai_calls for Tenant B');
    });

    console.log('✅ RLS isolation tests passed!');
    
    // Cleanup
    await sql`DELETE FROM ai_calls WHERE tenant_id IN (${tenantA_id}, ${tenantB_id})`;
    await sql`DELETE FROM properties WHERE tenant_id IN (${tenantA_id}, ${tenantB_id})`;
    await sql`DELETE FROM leads WHERE tenant_id IN (${tenantA_id}, ${tenantB_id})`;
    await sql`DELETE FROM tenants WHERE id IN (${tenantA_id}, ${tenantB_id})`;

  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await sql.end();
  }
}

run();
