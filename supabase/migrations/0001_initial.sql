-- Enable Row Level Security (RLS) on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Base RLS Policy: Users can only see data belonging to their tenant
-- This uses the user's JWT claim to identify their tenant_id safely

-- 1. Profiles
CREATE POLICY "Users can view profiles in their tenant" 
ON profiles FOR SELECT 
USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (id = auth.uid());

-- 2. Leads (Tenant Isolation Example)
CREATE POLICY "Tenant users can view their leads"
ON leads FOR SELECT
USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Tenant admin/staff can insert leads"
ON leads FOR INSERT
WITH CHECK (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Tenant admin/staff can update their leads"
ON leads FOR UPDATE
USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Apply similar policies to all other tenant-scoped tables
-- (Staff, Properties, Visits, Interactions, etc.)

-- 3. Super Admin Override
-- (Assuming we set a custom claim or use a secure postgres function to identify super_admins)
CREATE POLICY "Super admins bypass RLS"
ON leads FOR ALL
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin');
