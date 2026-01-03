/*
  # Tabela de Modelos de Chassi

  1. Nova Tabela
    - **chassis_models**
      - id (uuid, pk)
      - organization_id (uuid, fk)
      - name (text) - Nome do modelo
      - manufacturer (text) - Nome do fabricante
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Segurança (RLS)
    - Habilitar RLS
    - Policies para CRUD restrito por organization_id

  3. Triggers
    - Atualização automática de updated_at
*/

CREATE TABLE IF NOT EXISTS chassis_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  manufacturer text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_chassis_models_organization_id ON chassis_models(organization_id);
CREATE INDEX IF NOT EXISTS idx_chassis_models_manufacturer ON chassis_models(manufacturer);

-- Habilitar RLS
ALTER TABLE chassis_models ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Usuários veem modelos de chassi da própria organização"
  ON chassis_models FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários com permissão criam modelos de chassi"
  ON chassis_models FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    -- Assumindo permissão 'vehicles' ou criando uma nova. Usarei 'vehicles' por enquanto para simplificar.
    AND has_permission(auth.uid(), 'vehicles', 'create')
  );

CREATE POLICY "Usuários com permissão atualizam modelos de chassi"
  ON chassis_models FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'vehicles', 'update')
  );

CREATE POLICY "Usuários com permissão excluem modelos de chassi"
  ON chassis_models FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
    AND has_permission(auth.uid(), 'vehicles', 'delete')
  );

-- Trigger para updated_at
CREATE TRIGGER update_chassis_models_updated_at
  BEFORE UPDATE ON chassis_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
