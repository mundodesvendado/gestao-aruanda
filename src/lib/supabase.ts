import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para o banco de dados
export interface Database {
  public: {
    Tables: {
      temples: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          status: 'active' | 'inactive';
          subdomain: string | null;
          trial_end_date: string | null;
          subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          status?: 'active' | 'inactive';
          subdomain?: string | null;
          trial_end_date?: string | null;
          subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          status?: 'active' | 'inactive';
          subdomain?: string | null;
          trial_end_date?: string | null;
          subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          address: string | null;
          neighborhood: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          zip_code: string | null;
          role: 'master_admin' | 'temple_admin' | 'user';
          temple_id: string | null;
          active: boolean;
          is_medium: boolean;
          medium_id: string | null;
          created_at: string;
          updated_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string | null;
          address?: string | null;
          neighborhood?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          zip_code?: string | null;
          role?: 'master_admin' | 'temple_admin' | 'user';
          temple_id?: string | null;
          active?: boolean;
          is_medium?: boolean;
          medium_id?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          address?: string | null;
          neighborhood?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          zip_code?: string | null;
          role?: 'master_admin' | 'temple_admin' | 'user';
          temple_id?: string | null;
          active?: boolean;
          is_medium?: boolean;
          medium_id?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
      };
    };
  };
}