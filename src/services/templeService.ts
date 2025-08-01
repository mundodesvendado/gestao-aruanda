import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Temple = Database['public']['Tables']['temples']['Row'];
type TempleInsert = Database['public']['Tables']['temples']['Insert'];
type TempleUpdate = Database['public']['Tables']['temples']['Update'];

export class TempleService {
  static async getAll(): Promise<Temple[]> {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<Temple | null> {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(temple: TempleInsert): Promise<Temple> {
    const { data, error } = await supabase
      .from('temples')
      .insert(temple)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, temple: TempleUpdate): Promise<Temple> {
    const { data, error } = await supabase
      .from('temples')
      .update(temple)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('temples')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getActiveTemples(): Promise<Temple[]> {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .eq('status', 'active')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async updateSubscriptionStatus(
    id: string, 
    status: 'trial' | 'active' | 'expired' | 'cancelled'
  ): Promise<void> {
    const { error } = await supabase
      .from('temples')
      .update({ subscription_status: status })
      .eq('id', id);

    if (error) throw error;
  }
}