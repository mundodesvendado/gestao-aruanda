/*
  # Sistema Gestão Aruanda - Schema Completo

  1. Tabelas Principais
    - `temples` - Templos cadastrados
    - `users` - Usuários do sistema (admins e médiuns)
    - `mediums` - Dados específicos dos médiuns
    - `suppliers` - Fornecedores
    - `financial_records` - Registros financeiros
    - `events` - Eventos e giras
    - `notifications` - Notificações do sistema
    - `subscriptions` - Controle de assinaturas

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas específicas por tipo de usuário
    - Controle de acesso por templo

  3. Funcionalidades
    - Período de teste de 14 dias
    - Controle de assinaturas
    - Multi-tenant por templo
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de templos
CREATE TABLE IF NOT EXISTS temples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  email text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  subdomain text UNIQUE,
  trial_end_date timestamptz DEFAULT (now() + interval '14 days'),
  subscription_status text DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  address text,
  neighborhood text,
  city text,
  state text,
  country text DEFAULT 'Brasil',
  zip_code text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('master_admin', 'temple_admin', 'user')),
  temple_id uuid REFERENCES temples(id) ON DELETE CASCADE,
  active boolean DEFAULT true,
  is_medium boolean DEFAULT false,
  medium_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Tabela de médiuns
CREATE TABLE IF NOT EXISTS mediums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  birth_date date,
  address text NOT NULL,
  neighborhood text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  country text DEFAULT 'Brasil',
  zip_code text NOT NULL,
  phone text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  category text DEFAULT 'passista' CHECK (category IN ('passista', 'development', 'cambone', 'priest', 'oga', 'consulente')),
  join_date date DEFAULT CURRENT_DATE,
  exit_date date,
  can_administer boolean DEFAULT false,
  has_system_access boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  category text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de registros financeiros
CREATE TABLE IF NOT EXISTS financial_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  category text NOT NULL,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  type text NOT NULL CHECK (type IN ('gira', 'meeting', 'ceremony', 'event', 'lecture', 'festivity', 'external')),
  participants uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  target_users uuid[] DEFAULT '{}',
  read_by uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de assinaturas
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  status text DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'expired', 'cancelled')),
  trial_start_date timestamptz DEFAULT now(),
  trial_end_date timestamptz DEFAULT (now() + interval '14 days'),
  subscription_start_date timestamptz,
  next_billing_date timestamptz,
  amount decimal(10,2) DEFAULT 47.00,
  payment_method text,
  external_subscription_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_temples_updated_at BEFORE UPDATE ON temples FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mediums_updated_at BEFORE UPDATE ON mediums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_records_updated_at BEFORE UPDATE ON financial_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS em todas as tabelas
ALTER TABLE temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mediums ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para temples
CREATE POLICY "Master admin can manage all temples"
  ON temples
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'master_admin'
    )
  );

CREATE POLICY "Temple admins can view their temple"
  ON temples
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('temple_admin', 'user')
    )
  );

CREATE POLICY "Temple admins can update their temple"
  ON temples
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'temple_admin'
    )
  );

-- Políticas para users
CREATE POLICY "Master admin can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() 
      AND u.role = 'master_admin'
    )
  );

CREATE POLICY "Temple admins can manage temple users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    temple_id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'temple_admin'
    )
  );

CREATE POLICY "Users can view and update their own data"
  ON users
  FOR ALL
  TO authenticated
  USING (id = auth.uid());

-- Políticas para mediums
CREATE POLICY "Temple users can manage mediums"
  ON mediums
  FOR ALL
  TO authenticated
  USING (
    temple_id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Políticas para suppliers
CREATE POLICY "Temple users can manage suppliers"
  ON suppliers
  FOR ALL
  TO authenticated
  USING (
    temple_id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Políticas para financial_records
CREATE POLICY "Temple admins can manage financial records"
  ON financial_records
  FOR ALL
  TO authenticated
  USING (
    temple_id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('temple_admin', 'master_admin')
    )
  );

CREATE POLICY "Temple users can view financial records"
  ON financial_records
  FOR SELECT
  TO authenticated
  USING (
    temple_id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Políticas para events
CREATE POLICY "Temple users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (
    temple_id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Políticas para notifications
CREATE POLICY "Temple users can manage notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (
    temple_id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Políticas para subscriptions
CREATE POLICY "Temple admins can manage subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (
    temple_id IN (
      SELECT temple_id FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('temple_admin', 'master_admin')
    )
  );

-- Inserir dados iniciais
INSERT INTO temples (id, name, address, phone, email, status, subdomain) VALUES
('00000000-0000-0000-0000-000000000001', 'Templo Aruanda Demo', 'Rua dos Orixás, 123', '(11) 99999-9999', 'contato@temploareuanda.com.br', 'active', 'demo')
ON CONFLICT (id) DO NOTHING;

-- Inserir usuário master admin
INSERT INTO users (id, email, name, role, active) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@gestaoaruanda.com.br', 'Administrador Master', 'master_admin', true)
ON CONFLICT (email) DO NOTHING;

-- Inserir assinatura para o templo demo
INSERT INTO subscriptions (temple_id, status) VALUES
('00000000-0000-0000-0000-000000000001', 'trial')
ON CONFLICT DO NOTHING;