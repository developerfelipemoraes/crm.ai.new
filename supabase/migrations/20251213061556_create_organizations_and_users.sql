/*
  # Sistema de Organizações e Usuários Multi-Empresa
  
  1. Tabelas Criadas
    - **organizations** (Organizações que usam o CRM)
      - id (uuid, PK)
      - name (text) - Nome da organização
      - slug (text, unique) - Slug único
      - is_active (boolean) - Status ativo
      - settings (jsonb) - Configurações customizadas
      - created_at, updated_at (timestamptz)
    
    - **system_users** (Usuários do CRM)
      - id (uuid, PK, ref auth.users)
      - organization_id (uuid, FK organizations)
      - email (text, unique)
      - full_name (text)
      - role (text) - super_admin, company_admin, sales, support
      - is_active (boolean)
      - avatar_url (text)
      - created_at, updated_at (timestamptz)
    
    - **permissions** (Permissões do sistema)
      - id (uuid, PK)
      - resource (text) - contacts, companies, vehicles, sales, reports, admin
      - action (text) - create, read, update, delete, manage
      - description (text)
    
    - **role_permissions** (Permissões por role)
      - id (uuid, PK)
      - role (text)
      - permission_id (uuid, FK permissions)
  
  2. Segurança (RLS)
    - RLS habilitado em todas as tabelas
    - Usuários veem apenas dados da própria organização
    - Super admins da organização master (Aurovel) têm acesso total
    - Admins da organização gerenciam apenas sua organização
  
  3. Notas
    - Organização master Aurovel criada com ID fixo
    - Permissões básicas populadas
    - Role permissions configuradas por hierarquia
    - Função auxiliar has_permission() para verificação de permissões
*/

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela de organizações
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de usuários do sistema
CREATE TABLE IF NOT EXISTS system_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'sales', 'support')),
  is_active boolean DEFAULT true NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de permissões
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource text NOT NULL,
  action text NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'manage')),
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(resource, action)
);

-- Tabela de permissões por role
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(role, permission_id)
);

-- Inserir organização master (Aurovel)
INSERT INTO organizations (id, name, slug, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Aurovel',
  'aurovel',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Inserir permissões básicas
INSERT INTO permissions (resource, action, description) VALUES
  ('contacts', 'create', 'Criar contatos'),
  ('contacts', 'read', 'Visualizar contatos'),
  ('contacts', 'update', 'Editar contatos'),
  ('contacts', 'delete', 'Excluir contatos'),
  ('companies', 'create', 'Criar empresas'),
  ('companies', 'read', 'Visualizar empresas'),
  ('companies', 'update', 'Editar empresas'),
  ('companies', 'delete', 'Excluir empresas'),
  ('vehicles', 'create', 'Criar veículos'),
  ('vehicles', 'read', 'Visualizar veículos'),
  ('vehicles', 'update', 'Editar veículos'),
  ('vehicles', 'delete', 'Excluir veículos'),
  ('sales', 'create', 'Criar oportunidades'),
  ('sales', 'read', 'Visualizar oportunidades'),
  ('sales', 'update', 'Editar oportunidades'),
  ('sales', 'delete', 'Excluir oportunidades'),
  ('reports', 'read', 'Visualizar relatórios'),
  ('admin', 'manage', 'Gerenciar sistema')
ON CONFLICT (resource, action) DO NOTHING;

-- Permissões para super_admin (todas)
INSERT INTO role_permissions (role, permission_id)
SELECT 'super_admin', id FROM permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Permissões para company_admin (tudo exceto admin)
INSERT INTO role_permissions (role, permission_id)
SELECT 'company_admin', id FROM permissions
WHERE resource != 'admin'
ON CONFLICT (role, permission_id) DO NOTHING;

-- Permissões para sales
INSERT INTO role_permissions (role, permission_id)
SELECT 'sales', id FROM permissions
WHERE 
  (resource = 'sales' AND action IN ('create', 'read', 'update'))
  OR (resource IN ('contacts', 'companies', 'vehicles') AND action = 'read')
  OR (resource = 'reports' AND action = 'read')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Permissões para support (apenas leitura)
INSERT INTO role_permissions (role, permission_id)
SELECT 'support', id FROM permissions
WHERE action = 'read'
ON CONFLICT (role, permission_id) DO NOTHING;

-- Índices
CREATE INDEX IF NOT EXISTS idx_system_users_organization_id ON system_users(organization_id);
CREATE INDEX IF NOT EXISTS idx_system_users_email ON system_users(email);
CREATE INDEX IF NOT EXISTS idx_system_users_role ON system_users(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);

-- Habilitar RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Policies para organizations
CREATE POLICY "Super admins veem todas organizações"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM system_users
      WHERE system_users.id = auth.uid()
      AND system_users.role = 'super_admin'
      AND system_users.organization_id = '00000000-0000-0000-0000-000000000001'
    )
  );

CREATE POLICY "Usuários veem própria organização"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

-- Policies para system_users
CREATE POLICY "Usuários veem próprio perfil"
  ON system_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Usuários veem colegas da mesma organização"
  ON system_users FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins criam usuários na própria organização"
  ON system_users FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

CREATE POLICY "Admins atualizam usuários da própria organização"
  ON system_users FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

-- Policies para permissions
CREATE POLICY "Autenticados veem permissões"
  ON permissions FOR SELECT
  TO authenticated
  USING (true);

-- Policies para role_permissions
CREATE POLICY "Autenticados veem role_permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- Triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_users_updated_at
  BEFORE UPDATE ON system_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função auxiliar para verificar permissão
CREATE OR REPLACE FUNCTION has_permission(
  user_id uuid,
  resource_name text,
  action_name text
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM system_users su
    JOIN role_permissions rp ON rp.role = su.role
    JOIN permissions p ON p.id = rp.permission_id
    WHERE su.id = user_id
    AND p.resource = resource_name
    AND p.action = action_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;