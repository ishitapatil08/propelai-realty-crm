import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { assert } from 'node:console';

dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function seed() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  try {
    console.log('Seeding 3 demo users...');

    const usersToSeed = [
      { email: 'super@propelai.com', password: 'password123', role: 'super_admin' },
      { email: 'admin@tenant.com', password: 'password123', role: 'tenant_admin' },
      { email: 'staff@tenant.com', password: 'password123', role: 'staff' },
    ];

    let defaultTenantId: string;
    
    // Check if a default tenant exists
    const existingTenants = await sql`SELECT id FROM tenants LIMIT 1`;
    if (existingTenants.length === 0) {
      const newTenant = await sql`INSERT INTO tenants (name, plan, status) VALUES ('Acme Corp', 'Enterprise', 'Active') RETURNING id`;
      defaultTenantId = newTenant[0].id;
      console.log(`Created new tenant: ${defaultTenantId}`);
    } else {
      defaultTenantId = existingTenants[0].id;
      console.log(`Using existing tenant: ${defaultTenantId}`);
    }

    for (const u of usersToSeed) {
      // Create user in Auth
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
      });

      if (authError && authError.message !== 'User already registered') {
        console.error(`Error creating auth user ${u.email}:`, authError);
        continue;
      }

      let userId = authUser?.user?.id;
      
      if (!userId) {
        // Fetch existing user if already registered
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const found = existingUser.users.find((eu) => eu.email === u.email);
        if (found) userId = found.id;
      }

      if (userId) {
        // Upsert into public.profiles
        const tenantIdForRole = u.role === 'super_admin' ? null : defaultTenantId;
        
        await sql`
          INSERT INTO profiles (id, tenant_id, role, name, title) 
          VALUES (${userId}, ${tenantIdForRole}, ${u.role}, ${u.email.split('@')[0]}, 'Demo User')
          ON CONFLICT (id) DO UPDATE SET 
            role = ${u.role},
            tenant_id = ${tenantIdForRole}
        `;
        
        console.log(`✅ Seeded profile for ${u.email} as ${u.role}`);
      }
    }

    console.log('Seed completed successfully!');

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await sql.end();
  }
}

seed();
