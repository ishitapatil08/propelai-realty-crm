-- Custom SQL migration file, put your code below!
-- 1. Helper function to get current tenant_id from JWT
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'tenant_id', ''),
    NULLIF(current_setting('request.jwt.claims', true)::json->>'tenant_id', '')
  )::uuid;
$$;

-- 2. Enable RLS on all tenant-scoped tables
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "visits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "interactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_calls" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "campaigns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_logs" ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- leads
CREATE POLICY "Tenant isolation for leads" ON "leads"
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- properties
CREATE POLICY "Tenant isolation for properties" ON "properties"
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- visits
CREATE POLICY "Tenant isolation for visits" ON "visits"
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- interactions
CREATE POLICY "Tenant isolation for interactions" ON "interactions"
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- ai_calls
CREATE POLICY "Tenant isolation for ai_calls" ON "ai_calls"
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- campaigns
CREATE POLICY "Tenant isolation for campaigns" ON "campaigns"
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- notifications
CREATE POLICY "Tenant isolation for notifications" ON "notifications"
  FOR ALL
  USING (tenant_id = current_tenant_id());

-- activity_logs
CREATE POLICY "Tenant isolation for activity_logs" ON "activity_logs"
  FOR ALL
  USING (tenant_id = current_tenant_id());