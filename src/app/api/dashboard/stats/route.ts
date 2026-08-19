import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tenant_id, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.tenant_id) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 400 });
    }

    const tenantFilter = profile.role === 'super_admin' ? null : profile.tenant_id;

    // Fetch all stats in parallel
    const [leadsRes, staffRes, propertiesRes, visitsRes] = await Promise.all([
      // Total leads
      tenantFilter
        ? supabase.from('leads').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantFilter)
        : supabase.from('leads').select('id', { count: 'exact', head: true }),
      
      // Active staff
      tenantFilter
        ? supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'staff').eq('tenant_id', tenantFilter)
        : supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'staff'),
      
      // Total properties
      tenantFilter
        ? supabase.from('properties').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantFilter)
        : supabase.from('properties').select('id', { count: 'exact', head: true }),
      
      // Scheduled visits
      tenantFilter
        ? supabase.from('visits').select('id', { count: 'exact', head: true }).eq('status', 'scheduled').eq('tenant_id', tenantFilter)
        : supabase.from('visits').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
    ]);

    const totalLeads = leadsRes.count || 0;
    const activeStaff = staffRes.count || 0;
    const totalProperties = propertiesRes.count || 0;
    const scheduledVisits = visitsRes.count || 0;

    // Calculate conversion rate
    const wonLeadsRes = tenantFilter
      ? await supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'Won').eq('tenant_id', tenantFilter)
      : await supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'Won');

    const conversionRate = totalLeads > 0 
      ? ((wonLeadsRes.count || 0) / totalLeads * 100).toFixed(1) 
      : '0';

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        activeStaff,
        totalProperties,
        scheduledVisits,
        conversionRate: parseFloat(conversionRate),
        trend: '+12% from last month'
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
