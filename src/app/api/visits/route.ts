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
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.tenant_id) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 400 });
    }

    const { data: visits, error: visitsError } = await supabase
      .from('visits')
      .select('*, leads(name, phone), properties(name, location)')
      .eq('tenant_id', profile.tenant_id)
      .order('scheduled_at', { ascending: false });

    if (visitsError) throw visitsError;

    return NextResponse.json({
      success: true,
      data: visits || [],
      count: visits?.length || 0
    });
  } catch (error) {
    console.error('Visits GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.tenant_id) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 400 });
    }

    const body = await request.json();

    if (!body.lead_id || !body.scheduled_at) {
      return NextResponse.json({ error: 'Lead ID and scheduled time are required' }, { status: 400 });
    }

    const { data: newVisit, error: createError } = await supabase
      .from('visits')
      .insert([
        {
          tenant_id: profile.tenant_id,
          lead_id: body.lead_id,
          property_id: body.property_id || null,
          scheduled_at: body.scheduled_at,
          status: body.status || 'scheduled'
        }
      ])
      .select()
      .single();

    if (createError) throw createError;

    return NextResponse.json({ success: true, data: newVisit }, { status: 201 });
  } catch (error) {
    console.error('Visits POST Error:', error);
    return NextResponse.json({ error: 'Failed to create visit' }, { status: 500 });
  }
}
