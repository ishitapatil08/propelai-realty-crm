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

    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('*')
      .eq('tenant_id', profile.tenant_id)
      .order('created_at', { ascending: false });

    if (propsError) throw propsError;

    return NextResponse.json({
      success: true,
      data: properties || [],
      count: properties?.length || 0
    });
  } catch (error) {
    console.error('Properties GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
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

    if (!body.name) {
      return NextResponse.json({ error: 'Property name is required' }, { status: 400 });
    }

    const { data: newProperty, error: createError } = await supabase
      .from('properties')
      .insert([
        {
          tenant_id: profile.tenant_id,
          name: body.name,
          location: body.location || null,
          price: body.price || null
        }
      ])
      .select()
      .single();

    if (createError) throw createError;

    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error) {
    console.error('Properties POST Error:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
