-- ==============================================================================
-- 0003_lock_super_admin.sql
-- SECURE SUPER ADMIN LOCK & PRIVILEGE ESCALATION PREVENTION
-- ==============================================================================

-- 1. Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop any insecure update policies on profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- 3. Create view policy (users can view profiles in their tenant, super admins view all)
CREATE POLICY "Profile view policy" ON profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR tenant_id = current_tenant_id()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- 4. Create secure update policy:
-- Users CAN update their display name and title, but CANNOT modify 'role' or 'tenant_id'
CREATE POLICY "Users can update profile details except role/tenant" ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
    AND (
      tenant_id IS NOT DISTINCT FROM (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    )
  );

-- 5. DB Function & Trigger: Enforce Max 2 Super Admins & Whitelisted Emails Only
CREATE OR REPLACE FUNCTION check_super_admin_constraints()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_email text;
  v_super_admin_count integer;
BEGIN
  -- If the role is set to super_admin
  IF NEW.role = 'super_admin' THEN
    -- Fetch the user's email from auth.users
    SELECT email INTO v_user_email FROM auth.users WHERE id = NEW.id;

    -- Strict email whitelist check
    IF v_user_email NOT IN ('ishitapatil088@gmail.com', 'rujutpatil8975@gmail.com') THEN
      RAISE EXCEPTION 'Unauthorized: Email % is not in the authorized Super Admin whitelist.', v_user_email;
    END IF;

    -- Enforce maximum of 2 super admin accounts in the database
    SELECT COUNT(*) INTO v_super_admin_count FROM profiles WHERE role = 'super_admin' AND id <> NEW.id;
    IF v_super_admin_count >= 2 THEN
      RAISE EXCEPTION 'Super Admin quota reached: A maximum of 2 Super Admin accounts are allowed.';
    END IF;

    -- Super Admin should not have a tenant_id
    NEW.tenant_id := NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_super_admin_constraints ON profiles;
CREATE TRIGGER trg_enforce_super_admin_constraints
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_super_admin_constraints();

-- 6. Trigger to automatically create profiles row when a user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role role;
  v_tenant_id uuid;
  v_name text;
BEGIN
  -- Determine role based on email whitelist
  IF NEW.email IN ('ishitapatil088@gmail.com', 'rujutpatil8975@gmail.com') THEN
    v_role := 'super_admin';
    v_tenant_id := NULL;
  ELSE
    -- Default public signups become tenant_admin
    v_role := 'tenant_admin';
    -- Create default tenant for new organization
    v_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    INSERT INTO tenants (name, plan, status)
    VALUES (v_name || '''s Realty', 'Starter', 'Active')
    RETURNING id INTO v_tenant_id;
  END IF;

  INSERT INTO public.profiles (id, name, role, tenant_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    v_role,
    v_tenant_id
  )
  ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
