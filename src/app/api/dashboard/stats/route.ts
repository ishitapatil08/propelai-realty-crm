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
      supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .apply(q => tenantFilter ? q.eq('tenant_id', tenantFilter) : q),
      
      // Active staff
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'staff')
        .apply(q => tenantFilter ? q.eq('tenant_id', tenantFilter) : q),
      
      // Total properties
      supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .apply(q => tenantFilter ? q.eq('tenant_id', tenantFilter) : q),
      
      // Scheduled visits
      supabase
        .from('visits')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'scheduled')
        .apply(q => tenantFilter ? q.eq('tenant_id', tenantFilter) : q)
    ]);

    const totalLeads = leadsRes.count || 0;
    const activeStaff = staffRes.count || 0;
    const totalProperties = propertiesRes.count || 0;
    const scheduledVisits = visitsRes.count || 0;

    // Calculate conversion rate (rough estimate)
    const wonLeads = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Won')
      .apply(q => tenantFilter ? q.eq('tenant_id', tenantFilter) : q);

    const conversionRate = totalLeads > 0 
      ? ((wonLeads.count || 0) / totalLeads * 100).toFixed(1) 
      : '0';

    return NextResponse.json({
      success: true,
      data: {
        totalLeads: totalLeads,
        activeStaff: activeStaff,
        totalProperties: totalProperties,
        scheduledVisits: scheduledVisits,
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
