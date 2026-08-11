import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile with tenant info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, tenant_id, role, name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get tenant info
    let tenantInfo = null;
    if (profile.tenant_id) {
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, plan, status')
        .eq('id', profile.tenant_id)
        .single();

      if (!tenantError) {
        tenantInfo = tenant;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: profile.id,
          email: user.email,
          name: profile.name,
          role: profile.role
        },
        tenant: tenantInfo,
        tenantId: profile.tenant_id
      }
    });
  } catch (error) {
    console.error('Tenant Info Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant info' },
      { status: 500 }
    );
  }
}
