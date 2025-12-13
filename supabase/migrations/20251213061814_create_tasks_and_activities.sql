/*
  # Tabelas de Tarefas e Atividades
  
  1. Tabelas Criadas
    - **tasks** (Tarefas e Atividades)
      - id, organization_id
      - Vinculação com contact, company, opportunity
      - Tipo (call, meeting, email, task, follow_up)
      - Título, descrição, prioridade
      - Data de vencimento, status
      - Responsável e criador
    
    - **task_comments** (Comentários nas tarefas)
      - id, task_id
      - Comentário, autor
  
  2. Segurança (RLS)
    - Isolamento por organization_id
    - Usuários veem tarefas da própria organização
  
  3. Notas
    - Suporte a diferentes tipos de atividades
    - Sistema de prioridades
    - Comentários para colaboração
*/

-- Tabela de Tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Vinculações
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  opportunity_id uuid REFERENCES sales_opportunities(id) ON DELETE SET NULL,
  
  -- Informações básicas
  type text NOT NULL CHECK (type IN ('call', 'meeting', 'email', 'task', 'follow_up', 'other')),
  title text NOT NULL,
  description text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Status e datas
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date timestamptz,
  completed_at timestamptz,
  
  -- Responsável e criador
  assigned_to uuid REFERENCES system_users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES system_users(id) ON DELETE SET NULL,
  
  -- Metadados
  metadata jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de Comentários em Tarefas
CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  comment text NOT NULL,
  created_by uuid REFERENCES system_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tasks_organization_id ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_org_created ON tasks(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_contact ON tasks(contact_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_opportunity ON tasks(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

CREATE INDEX IF NOT EXISTS idx_task_comments_task ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_created ON task_comments(task_id, created_at DESC);

-- Habilitar RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Policies para tasks
CREATE POLICY "Usuários veem tarefas da própria organização"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários criam tarefas"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários atualizam tarefas"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários excluem tarefas"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

-- Policies para task_comments
CREATE POLICY "Usuários veem comentários de tarefas da própria org"
  ON task_comments FOR SELECT
  TO authenticated
  USING (
    task_id IN (
      SELECT id FROM tasks 
      WHERE organization_id IN (
        SELECT organization_id FROM system_users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Usuários criam comentários"
  ON task_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    task_id IN (
      SELECT id FROM tasks 
      WHERE organization_id IN (
        SELECT organization_id FROM system_users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Usuários excluem próprios comentários"
  ON task_comments FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Triggers
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para marcar tarefa como completada automaticamente
CREATE OR REPLACE FUNCTION auto_complete_task()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status != 'completed' AND OLD.status = 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_complete_task_trigger
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION auto_complete_task();