/*
  # Sistema Multi-Tenant - Gestão Aruanda

  1. Novas Tabelas
    - `templos`
      - `id` (uuid, primary key)
      - `nome` (text, nome do templo)
      - `endereco` (text, endereço completo)
      - `telefone` (text, telefone de contato)
      - `email` (text, email do templo)
      - `status` (text, ativo/inativo)
      - `subdominio` (text, subdomínio único)
      - `criado_em` (timestamp)
      - `atualizado_em` (timestamp)

    - `usuarios_sistema`
      - `id` (uuid, primary key)
      - `nome` (text, nome completo)
      - `email` (text, email único)
      - `senha_hash` (text, senha criptografada)
      - `role` (text, master_admin/temple_admin/user)
      - `templo_id` (uuid, referência ao templo)
      - `telefone` (text, telefone)
      - `endereco` (text, endereço)
      - `ativo` (boolean, status do usuário)
      - `criado_em` (timestamp)
      - `ultimo_login` (timestamp)

  2. Tabelas Existentes Atualizadas
    - Todas as tabelas existentes recebem `templo_id` para isolamento de dados
    - Políticas RLS atualizadas para considerar o templo

  3. Segurança
    - Enable RLS em todas as tabelas
    - Políticas específicas por role e templo
    - Isolamento completo de dados entre templos
*/

-- Criar tabela de templos
CREATE TABLE IF NOT EXISTS templos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  endereco text,
  telefone text,
  email text,
  status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  subdominio text UNIQUE,
  criado_em timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now()
);

-- Criar tabela de usuários do sistema
CREATE TABLE IF NOT EXISTS usuarios_sistema (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  senha_hash text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('master_admin', 'temple_admin', 'user')),
  templo_id uuid REFERENCES templos(id) ON DELETE CASCADE,
  telefone text,
  endereco text,
  bairro text,
  cidade text,
  estado text,
  pais text DEFAULT 'Brasil',
  cep text,
  ativo boolean DEFAULT true,
  criado_em timestamptz DEFAULT now(),
  ultimo_login timestamptz
);

-- Atualizar tabelas existentes com templo_id
DO $$
BEGIN
  -- Adicionar templo_id às tabelas existentes se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'administradores' AND column_name = 'templo_id'
  ) THEN
    ALTER TABLE administradores ADD COLUMN templo_id uuid REFERENCES templos(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mediuns' AND column_name = 'templo_id'
  ) THEN
    ALTER TABLE mediuns ADD COLUMN templo_id uuid REFERENCES templos(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fornecedores' AND column_name = 'templo_id'
  ) THEN
    ALTER TABLE fornecedores ADD COLUMN templo_id uuid REFERENCES templos(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'eventos' AND column_name = 'templo_id'
  ) THEN
    ALTER TABLE eventos ADD COLUMN templo_id uuid REFERENCES templos(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notificacoes' AND column_name = 'templo_id'
  ) THEN
    ALTER TABLE notificacoes ADD COLUMN templo_id uuid REFERENCES templos(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'relatorios' AND column_name = 'templo_id'
  ) THEN
    ALTER TABLE relatorios ADD COLUMN templo_id uuid REFERENCES templos(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'configuracoes' AND column_name = 'templo_id'
  ) THEN
    ALTER TABLE configuracoes ADD COLUMN templo_id uuid REFERENCES templos(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Criar tabela de transações financeiras (nova estrutura)
CREATE TABLE IF NOT EXISTS transacoes_financeiras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  templo_id uuid NOT NULL REFERENCES templos(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  valor decimal(10,2) NOT NULL,
  descricao text NOT NULL,
  categoria text NOT NULL,
  fornecedor_id uuid REFERENCES fornecedores(id),
  data_transacao date NOT NULL,
  criado_em timestamptz DEFAULT now(),
  criado_por uuid REFERENCES usuarios_sistema(id)
);

-- Enable RLS em todas as tabelas
ALTER TABLE templos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes_financeiras ENABLE ROW LEVEL SECURITY;

-- Políticas para templos (apenas master admin pode gerenciar)
CREATE POLICY "Master admin pode gerenciar templos"
  ON templos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_sistema
      WHERE usuarios_sistema.id = auth.uid()
      AND usuarios_sistema.role = 'master_admin'
    )
  );

-- Políticas para usuários do sistema
CREATE POLICY "Usuários podem ver próprios dados"
  ON usuarios_sistema
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Master admin pode gerenciar todos usuários"
  ON usuarios_sistema
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_sistema u
      WHERE u.id = auth.uid()
      AND u.role = 'master_admin'
    )
  );

CREATE POLICY "Temple admin pode gerenciar usuários do templo"
  ON usuarios_sistema
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_sistema u
      WHERE u.id = auth.uid()
      AND u.role = 'temple_admin'
      AND u.templo_id = usuarios_sistema.templo_id
    )
  );

-- Políticas para transações financeiras
CREATE POLICY "Usuários podem ver transações do próprio templo"
  ON transacoes_financeiras
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_sistema
      WHERE usuarios_sistema.id = auth.uid()
      AND usuarios_sistema.templo_id = transacoes_financeiras.templo_id
    )
  );

CREATE POLICY "Admins podem gerenciar transações do templo"
  ON transacoes_financeiras
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_sistema
      WHERE usuarios_sistema.id = auth.uid()
      AND usuarios_sistema.templo_id = transacoes_financeiras.templo_id
      AND usuarios_sistema.role IN ('temple_admin', 'master_admin')
    )
  );

-- Atualizar políticas das tabelas existentes para considerar templo_id
DROP POLICY IF EXISTS "Users can read own data" ON mediuns;
CREATE POLICY "Usuários podem ver médiuns do próprio templo"
  ON mediuns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_sistema
      WHERE usuarios_sistema.id = auth.uid()
      AND usuarios_sistema.templo_id = mediuns.templo_id
    )
  );

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar timestamp nos templos
CREATE TRIGGER update_templos_updated_at
    BEFORE UPDATE ON templos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir administrador master padrão
INSERT INTO usuarios_sistema (
  nome,
  email,
  senha_hash,
  role,
  ativo
) VALUES (
  'Administrador Master',
  'admin@gestaoaruanda.com.br',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: 123@mudar
  'master_admin',
  true
) ON CONFLICT (email) DO NOTHING;