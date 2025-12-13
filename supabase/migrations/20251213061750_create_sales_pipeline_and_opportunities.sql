/*
  # Tabelas de Pipeline de Vendas e Oportunidades
  
  1. Tabelas Criadas
    - **sales_pipelines** (Pipelines de vendas)
      - id, organization_id
      - name, description
      - is_active, is_default
      - settings (configurações customizadas)
    
    - **pipeline_stages** (Estágios do pipeline)
      - id, organization_id, pipeline_id
      - name, description
      - order (ordem de exibição)
      - probability (% de conversão)
      - is_final, is_won, is_lost
    
    - **loss_reasons** (Motivos de perda)
      - id, organization_id
      - reason, category
    
    - **sales_opportunities** (Oportunidades de venda)
      - id, organization_id
      - Vinculação com contact, company, vehicle
      - Pipeline e stage
      - Valores, datas, probabilidade
      - Status, assigned_to
    
    - **opportunity_timeline** (Timeline de eventos)
      - id, organization_id, opportunity_id
      - event_type, description
      - created_by
  
  2. Segurança (RLS)
    - Todas isoladas por organization_id
    - Verificação de permissões por resource 'sales'
  
  3. Notas
    - Pipeline padrão criado automaticamente
    - Estágios padrão criados (Prospecção, Qualificação, Proposta, Negociação, Fechamento)
    - Motivos de perda padrão populados
*/

-- Tabela de Pipelines
CREATE TABLE IF NOT EXISTS sales_pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true NOT NULL,
  is_default boolean DEFAULT false,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de Estágios do Pipeline
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  pipeline_id uuid REFERENCES sales_pipelines(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  "order" integer NOT NULL DEFAULT 0,
  probability integer DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  is_final boolean DEFAULT false,
  is_won boolean DEFAULT false,
  is_lost boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(pipeline_id, "order")
);

-- Tabela de Motivos de Perda
CREATE TABLE IF NOT EXISTS loss_reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  reason text NOT NULL,
  category text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de Oportunidades
CREATE TABLE IF NOT EXISTS sales_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  pipeline_id uuid REFERENCES sales_pipelines(id) ON DELETE SET NULL NOT NULL,
  stage_id uuid REFERENCES pipeline_stages(id) ON DELETE SET NULL NOT NULL,
  
  -- Informações básicas
  title text NOT NULL,
  description text,
  
  -- Valores
  value numeric(15,2) DEFAULT 0,
  expected_close_date date,
  probability integer DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  
  -- Status
  status text DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost')),
  loss_reason_id uuid REFERENCES loss_reasons(id) ON DELETE SET NULL,
  loss_notes text,
  
  -- Responsável
  assigned_to uuid REFERENCES system_users(id) ON DELETE SET NULL,
  
  -- Datas
  won_at timestamptz,
  lost_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de Timeline de Oportunidades
CREATE TABLE IF NOT EXISTS opportunity_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  opportunity_id uuid REFERENCES sales_opportunities(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('created', 'stage_changed', 'value_changed', 'assigned', 'note_added', 'won', 'lost', 'reopened')),
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES system_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Inserir pipeline padrão para organização Aurovel
INSERT INTO sales_pipelines (organization_id, name, description, is_default, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Pipeline Padrão',
  'Pipeline de vendas padrão do sistema',
  true,
  true
) ON CONFLICT DO NOTHING;

-- Inserir estágios padrão
DO $$
DECLARE
  v_pipeline_id uuid;
BEGIN
  SELECT id INTO v_pipeline_id 
  FROM sales_pipelines 
  WHERE organization_id = '00000000-0000-0000-0000-000000000001' 
  AND is_default = true 
  LIMIT 1;
  
  IF v_pipeline_id IS NOT NULL THEN
    INSERT INTO pipeline_stages (organization_id, pipeline_id, name, "order", probability) VALUES
      ('00000000-0000-0000-0000-000000000001', v_pipeline_id, 'Prospecção', 1, 10),
      ('00000000-0000-0000-0000-000000000001', v_pipeline_id, 'Qualificação', 2, 30),
      ('00000000-0000-0000-0000-000000000001', v_pipeline_id, 'Proposta', 3, 50),
      ('00000000-0000-0000-0000-000000000001', v_pipeline_id, 'Negociação', 4, 70),
      ('00000000-0000-0000-0000-000000000001', v_pipeline_id, 'Fechamento', 5, 90)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Inserir motivos de perda padrão
INSERT INTO loss_reasons (organization_id, reason, category) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Preço alto', 'Preço'),
  ('00000000-0000-0000-0000-000000000001', 'Escolheu concorrente', 'Concorrência'),
  ('00000000-0000-0000-0000-000000000001', 'Sem orçamento', 'Financeiro'),
  ('00000000-0000-0000-0000-000000000001', 'Timing errado', 'Timing'),
  ('00000000-0000-0000-0000-000000000001', 'Não respondeu', 'Comunicação'),
  ('00000000-0000-0000-0000-000000000001', 'Mudança de prioridade', 'Estratégia'),
  ('00000000-0000-0000-0000-000000000001', 'Outro motivo', 'Outros')
ON CONFLICT DO NOTHING;

-- Índices
CREATE INDEX IF NOT EXISTS idx_sales_pipelines_organization_id ON sales_pipelines(organization_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_pipeline_id ON pipeline_stages(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_order ON pipeline_stages(pipeline_id, "order");
CREATE INDEX IF NOT EXISTS idx_loss_reasons_organization_id ON loss_reasons(organization_id);

CREATE INDEX IF NOT EXISTS idx_sales_opportunities_organization_id ON sales_opportunities(organization_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_org_created ON sales_opportunities(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_contact ON sales_opportunities(contact_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_company ON sales_opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_vehicle ON sales_opportunities(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_pipeline ON sales_opportunities(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_stage ON sales_opportunities(stage_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_assigned ON sales_opportunities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_status ON sales_opportunities(status);

CREATE INDEX IF NOT EXISTS idx_opportunity_timeline_opportunity ON opportunity_timeline(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_timeline_created ON opportunity_timeline(opportunity_id, created_at DESC);

-- Habilitar RLS
ALTER TABLE sales_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE loss_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_timeline ENABLE ROW LEVEL SECURITY;

-- Policies para sales_pipelines
CREATE POLICY "Usuários veem pipelines da própria organização"
  ON sales_pipelines FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins gerenciam pipelines"
  ON sales_pipelines FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'company_admin')
    )
  );

-- Policies para pipeline_stages
CREATE POLICY "Usuários veem estágios da própria organização"
  ON pipeline_stages FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins gerenciam estágios"
  ON pipeline_stages FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'company_admin')
    )
  );

-- Policies para loss_reasons
CREATE POLICY "Usuários veem motivos de perda da própria organização"
  ON loss_reasons FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins gerenciam motivos de perda"
  ON loss_reasons FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'company_admin')
    )
  );

-- Policies para sales_opportunities
CREATE POLICY "Usuários veem oportunidades da própria organização"
  ON sales_opportunities FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários com permissão criam oportunidades"
  ON sales_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'sales', 'create')
  );

CREATE POLICY "Usuários com permissão atualizam oportunidades"
  ON sales_opportunities FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'sales', 'update')
  );

CREATE POLICY "Usuários com permissão excluem oportunidades"
  ON sales_opportunities FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'sales', 'delete')
  );

-- Policies para opportunity_timeline
CREATE POLICY "Usuários veem timeline da própria organização"
  ON opportunity_timeline FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários criam eventos na timeline"
  ON opportunity_timeline FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

-- Triggers
CREATE TRIGGER update_sales_pipelines_updated_at
  BEFORE UPDATE ON sales_pipelines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_stages_updated_at
  BEFORE UPDATE ON pipeline_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_opportunities_updated_at
  BEFORE UPDATE ON sales_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar evento na timeline automaticamente
CREATE OR REPLACE FUNCTION log_opportunity_event()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO opportunity_timeline (organization_id, opportunity_id, event_type, description, created_by)
    VALUES (NEW.organization_id, NEW.id, 'created', 'Oportunidade criada', NEW.assigned_to);
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.stage_id != NEW.stage_id THEN
      INSERT INTO opportunity_timeline (organization_id, opportunity_id, event_type, description, metadata, created_by)
      VALUES (
        NEW.organization_id, 
        NEW.id, 
        'stage_changed', 
        'Estágio alterado',
        jsonb_build_object('old_stage_id', OLD.stage_id, 'new_stage_id', NEW.stage_id),
        auth.uid()
      );
    END IF;
    
    IF OLD.value != NEW.value THEN
      INSERT INTO opportunity_timeline (organization_id, opportunity_id, event_type, description, metadata, created_by)
      VALUES (
        NEW.organization_id, 
        NEW.id, 
        'value_changed', 
        'Valor alterado',
        jsonb_build_object('old_value', OLD.value, 'new_value', NEW.value),
        auth.uid()
      );
    END IF;
    
    IF OLD.status != NEW.status THEN
      IF NEW.status = 'won' THEN
        INSERT INTO opportunity_timeline (organization_id, opportunity_id, event_type, description, created_by)
        VALUES (NEW.organization_id, NEW.id, 'won', 'Oportunidade ganha!', auth.uid());
      ELSIF NEW.status = 'lost' THEN
        INSERT INTO opportunity_timeline (organization_id, opportunity_id, event_type, description, created_by)
        VALUES (NEW.organization_id, NEW.id, 'lost', 'Oportunidade perdida', auth.uid());
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_sales_opportunity_events
  AFTER INSERT OR UPDATE ON sales_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION log_opportunity_event();