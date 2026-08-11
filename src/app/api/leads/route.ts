import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's profile and tenant
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tenant_id, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.tenant_id) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      );
    }

    // Fetch leads for the user's tenant (RLS enforced)
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('tenant_id', profile.tenant_id)
      .order('created_at', { ascending: false });

    if (leadsError) throw leadsError;

    return NextResponse.json({
      success: true,
      data: leads || [],
      count: leads?.length || 0
    });
  } catch (error) {
    console.error('Leads GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's tenant
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.tenant_id) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Create lead with tenant_id
    const { data: newLead, error: createError } = await supabase
      .from('leads')
      .insert([
        {
          tenant_id: profile.tenant_id,
          name: body.name,
          phone: body.phone,
          email: body.email || null,
          source: body.source || null,
          budget: body.budget || null,
          status: body.status || 'New',
          score: body.score || 0
        }
      ])
      .select()
      .single();

    if (createError) throw createError;

    return NextResponse.json(
      { success: true, data: newLead },
      { status: 201 }
    );
  } catch (error) {
    console.error('Leads POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    // Update lead (RLS prevents cross-tenant updates)
    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', profile.tenant_id)
      .select()
      .single();

    if (updateError) throw updateError;
    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error('Leads PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    // Delete lead (RLS prevents cross-tenant deletions)
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
      .eq('tenant_id', profile.tenant_id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    console.error('Leads DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
