/*
  # Tabelas principais do CRM: Contacts, Companies e Vehicles
  
  1. Tabelas Criadas
    - **contacts** (Contatos - Pessoas Físicas)
      - Dados pessoais, documentos, endereço
      - Dados profissionais, financeiros, bancários
      - Compliance e KYC
      - Vinculação com organization_id
    
    - **companies** (Empresas - Pessoas Jurídicas)
      - Identificação, endereços, contatos
      - Estrutura corporativa, dados financeiros
      - Dados bancários, operacionais
      - Compliance, LGPD, documentos
      - Vinculação com organization_id
    
    - **vehicles** (Veículos)
      - Tipo, categoria, subcategoria
      - Dados do chassi e carroceria
      - Informações do veículo, mídia
      - Opcionais, localização
      - Vinculação com organization_id e company_id
    
    - **contact_company_links** (Vínculos entre contatos e empresas)
      - Relacionamento N:N
      - Papel do contato na empresa
      - Indicação de contato principal
  
  2. Segurança (RLS)
    - Todas as tabelas isoladas por organization_id
    - Usuários veem apenas dados da própria organização
    - Verificação de permissões por resource e action
  
  3. Índices
    - Índices compostos (organization_id, created_at) para performance
    - Índices em foreign keys
    - Índices em campos de busca (email, cpf, cnpj)
*/

-- Tabela de Contatos (PF)
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados Pessoais
  full_name text NOT NULL,
  cpf text UNIQUE NOT NULL,
  birth_date date,
  gender text CHECK (gender IN ('Masculino', 'Feminino', 'Outro', '')),
  nationality text,
  birth_place text,
  birth_state text,
  mother_name text,
  father_name text,
  marital_status text CHECK (marital_status IN ('Solteiro(a)', 'Casado(a)', 'União estável', 'Separado(a)', 'Divorciado(a)', 'Viúvo(a)', '')),
  spouse_name text,
  spouse_cpf text,
  guardian_name text,
  guardian_cpf text,
  
  -- Documentos
  document_type text CHECK (document_type IN ('RG', 'CNH', 'RNE', 'Outro', '')),
  document_number text,
  document_issuer text,
  document_issuer_state text,
  document_issue_date date,
  document_expiration_date date,
  document_attachment_url text,
  
  -- Endereço
  address_street text,
  address_number text,
  address_complement text,
  address_neighborhood text,
  address_city text,
  address_state text,
  address_zip_code text,
  address_phone text,
  address_mobile text,
  address_fax text,
  address_email text,
  address_proof_url text,
  
  -- Dados Profissionais
  education text,
  occupation text,
  company_name text,
  company_street text,
  company_number text,
  company_neighborhood text,
  company_city text,
  company_state text,
  company_zip_code text,
  company_phone text,
  company_mobile text,
  income_proof_url text,
  
  -- Preferência de Correspondência
  correspondence_type text CHECK (correspondence_type IN ('Residencial', 'Comercial', 'E-mail', '')),
  
  -- Dados Financeiros
  salary numeric(15,2) DEFAULT 0,
  other_income numeric(15,2) DEFAULT 0,
  total_income numeric(15,2) DEFAULT 0,
  assets jsonb DEFAULT '[]'::jsonb,
  
  -- Dados Bancários
  primary_bank text,
  primary_agency text,
  primary_account text,
  secondary_bank text,
  secondary_agency text,
  secondary_account text,
  is_joint_account boolean DEFAULT false,
  joint_account_holder_name text,
  joint_account_holder_cpf text,
  pix_key text,
  
  -- Compliance
  is_pep boolean DEFAULT false,
  has_pep_relationship boolean DEFAULT false,
  pep_name text,
  pep_cpf text,
  relationship_purpose text,
  authorize_consultations boolean DEFAULT false,
  declare_accuracy boolean DEFAULT false,
  commit_to_update boolean DEFAULT false,
  coaf_awareness boolean DEFAULT false,
  
  -- KYC e Status
  completeness integer DEFAULT 0 CHECK (completeness >= 0 AND completeness <= 100),
  kyc_score integer DEFAULT 0 CHECK (kyc_score >= 0 AND kyc_score <= 100),
  kyc_classification text DEFAULT 'ok' CHECK (kyc_classification IN ('ok', 'atenção', 'alto risco')),
  next_review date,
  pendencies jsonb DEFAULT '[]'::jsonb,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de Empresas (PJ)
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Identificação
  corporate_name text NOT NULL,
  trade_name text,
  cnpj text UNIQUE NOT NULL,
  nire text,
  state_registration text,
  municipal_registration text,
  primary_cnae text,
  secondary_cnaes jsonb DEFAULT '[]'::jsonb,
  legal_nature text,
  company_size text CHECK (company_size IN ('MEI', 'ME', 'EPP', 'Others')),
  tax_regime text CHECK (tax_regime IN ('Simples', 'Lucro Presumido', 'Lucro Real')),
  incorporation_date date,
  
  -- Endereços
  commercial_address jsonb NOT NULL,
  billing_address jsonb,
  delivery_address jsonb,
  
  -- Contatos
  primary_email text NOT NULL,
  phone text,
  whatsapp text,
  website text,
  social_media text,
  key_contacts jsonb DEFAULT '[]'::jsonb,
  accounting_office jsonb,
  
  -- Estrutura Corporativa
  control text CHECK (control IN ('national', 'foreign')),
  country text,
  final_beneficiaries jsonb DEFAULT '[]'::jsonb,
  administrators jsonb DEFAULT '[]'::jsonb,
  attorneys jsonb DEFAULT '[]'::jsonb,
  related_companies jsonb DEFAULT '[]'::jsonb,
  
  -- Financeiro
  social_capital numeric(15,2) DEFAULT 0,
  net_worth numeric(15,2) DEFAULT 0,
  revenue_12m numeric(15,2) DEFAULT 0,
  relevant_assets text,
  payment_terms text,
  credit_limit numeric(15,2) DEFAULT 0,
  
  -- Bancário
  primary_bank_account jsonb,
  secondary_bank_account jsonb,
  pix_key text,
  beneficiary text,
  
  -- Operações
  business_line text,
  current_fleet text,
  intended_use text,
  preferred_brands text,
  interest_categories jsonb DEFAULT '[]'::jsonb,
  
  -- Licenças e Seguros
  rntrc text,
  rntrc_validity date,
  operating_license text,
  environmental_licenses text,
  insurances jsonb DEFAULT '[]'::jsonb,
  
  -- Compliance e LGPD
  is_pep boolean DEFAULT false,
  pep_relationship boolean DEFAULT false,
  pep_name text,
  pep_cpf text,
  dpo_name text,
  dpo_email text,
  legal_basis text,
  communication_consent boolean DEFAULT false,
  sharing_consent boolean DEFAULT false,
  
  -- Documentos
  documents jsonb DEFAULT '{}'::jsonb,
  
  -- Status e Métricas
  status text DEFAULT 'prospect' CHECK (status IN ('client', 'prospect')),
  tags jsonb DEFAULT '[]'::jsonb,
  kyc_score integer DEFAULT 0 CHECK (kyc_score >= 0 AND kyc_score <= 100),
  next_review date,
  completeness integer DEFAULT 0 CHECK (completeness >= 0 AND completeness <= 100),
  monthly_ticket numeric(15,2) DEFAULT 0,
  vehicle_count integer DEFAULT 0,
  credit numeric(15,2) DEFAULT 0,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de Veículos
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  
  -- Tipo e Categoria
  vehicle_type jsonb NOT NULL,
  category jsonb NOT NULL,
  subcategory jsonb,
  
  -- Chassi e Carroceria
  chassis_manufacturer text,
  body_manufacturer text,
  chassis_model text,
  body_model text,
  
  -- Dados do Veículo
  fabrication_year integer,
  model_year integer,
  mileage integer DEFAULT 0,
  license_plate text,
  renavam text,
  chassis text,
  bus_prefix text,
  available_quantity integer DEFAULT 1,
  internal_notes text,
  
  -- Identificação do Produto
  title text NOT NULL,
  
  -- Mídia
  media_files jsonb DEFAULT '{}'::jsonb,
  
  -- Informações Secundárias
  capacity integer,
  condition text CHECK (condition IN ('new', 'used', 'semi-new')),
  fuel_type text,
  steering text CHECK (steering IN ('assisted', 'hydraulic', 'mechanical')),
  single_owner boolean DEFAULT false,
  description text,
  
  -- Configuração de Assentos
  seat_configuration jsonb,
  seat_composition jsonb,
  
  -- Opcionais
  optionals jsonb DEFAULT '{}'::jsonb,
  
  -- Localização
  location jsonb NOT NULL,
  
  -- Fornecedor e Comissão
  supplier jsonb,
  commission jsonb,
  
  -- Status
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive', 'sold')),
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de vínculos entre contatos e empresas
CREATE TABLE IF NOT EXISTS contact_company_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('Financeiro', 'Fiscal', 'Compras', 'Comercial', 'Responsável legal', 'Procurador', 'Sócio')),
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(contact_id, company_id, role)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_contacts_organization_id ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_org_created ON contacts(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_cpf ON contacts(cpf);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(address_email);

CREATE INDEX IF NOT EXISTS idx_companies_organization_id ON companies(organization_id);
CREATE INDEX IF NOT EXISTS idx_companies_org_created ON companies(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_companies_cnpj ON companies(cnpj);
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(primary_email);

CREATE INDEX IF NOT EXISTS idx_vehicles_organization_id ON vehicles(organization_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_org_created ON vehicles(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);

CREATE INDEX IF NOT EXISTS idx_contact_company_links_contact ON contact_company_links(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_company_links_company ON contact_company_links(company_id);

-- Habilitar RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_company_links ENABLE ROW LEVEL SECURITY;

-- Policies para contacts
CREATE POLICY "Usuários veem contatos da própria organização"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários com permissão criam contatos"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'contacts', 'create')
  );

CREATE POLICY "Usuários com permissão atualizam contatos"
  ON contacts FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'contacts', 'update')
  );

CREATE POLICY "Usuários com permissão excluem contatos"
  ON contacts FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'contacts', 'delete')
  );

-- Policies para companies
CREATE POLICY "Usuários veem empresas da própria organização"
  ON companies FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários com permissão criam empresas"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'companies', 'create')
  );

CREATE POLICY "Usuários com permissão atualizam empresas"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'companies', 'update')
  );

CREATE POLICY "Usuários com permissão excluem empresas"
  ON companies FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'companies', 'delete')
  );

-- Policies para vehicles
CREATE POLICY "Usuários veem veículos da própria organização"
  ON vehicles FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários com permissão criam veículos"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'vehicles', 'create')
  );

CREATE POLICY "Usuários com permissão atualizam veículos"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'vehicles', 'update')
  );

CREATE POLICY "Usuários com permissão excluem veículos"
  ON vehicles FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'vehicles', 'delete')
  );

-- Policies para contact_company_links
CREATE POLICY "Usuários veem links da própria organização"
  ON contact_company_links FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários com permissão criam links"
  ON contact_company_links FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários com permissão excluem links"
  ON contact_company_links FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

-- Triggers
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();