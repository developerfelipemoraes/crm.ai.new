export interface Organization {
  id: string
  name: string
  slug: string
  is_active: boolean
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SystemUser {
  id: string
  organization_id: string
  email: string
  full_name: string
  role: 'super_admin' | 'company_admin' | 'sales' | 'support'
  is_active: boolean
  avatar_url: string | null
  created_at: string
  updated_at: string
  organization?: Organization
}

export interface Contact {
  id: string
  organization_id: string
  full_name: string
  cpf: string
  birth_date: string | null
  gender: string | null
  address_email: string | null
  address_mobile: string | null
  occupation: string | null
  company_name: string | null
  kyc_score: number
  kyc_classification: 'ok' | 'atenção' | 'alto risco'
  completeness: number
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  organization_id: string
  corporate_name: string
  trade_name: string | null
  cnpj: string
  primary_email: string
  phone: string | null
  status: 'client' | 'prospect'
  kyc_score: number
  completeness: number
  vehicle_count: number
  credit: number
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  organization_id: string
  company_id: string | null
  title: string
  vehicle_type: Record<string, any>
  category: Record<string, any>
  fabrication_year: number | null
  model_year: number | null
  chassis_manufacturer: string | null
  body_manufacturer: string | null
  condition: 'new' | 'used' | 'semi-new' | null
  status: 'active' | 'pending' | 'inactive' | 'sold'
  media_files: Record<string, any>
  location: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SalesPipeline {
  id: string
  organization_id: string
  name: string
  description: string | null
  is_active: boolean
  is_default: boolean
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface PipelineStage {
  id: string
  organization_id: string
  pipeline_id: string
  name: string
  description: string | null
  order: number
  probability: number
  is_final: boolean
  is_won: boolean
  is_lost: boolean
  created_at: string
  updated_at: string
}

export interface SalesOpportunity {
  id: string
  organization_id: string
  contact_id: string | null
  company_id: string | null
  vehicle_id: string | null
  pipeline_id: string
  stage_id: string
  title: string
  description: string | null
  value: number
  expected_close_date: string | null
  probability: number
  status: 'open' | 'won' | 'lost'
  assigned_to: string | null
  won_at: string | null
  lost_at: string | null
  created_at: string
  updated_at: string
  contact?: Contact
  company?: Company
  vehicle?: Vehicle
  stage?: PipelineStage
  assigned_user?: SystemUser
}

export interface Task {
  id: string
  organization_id: string
  contact_id: string | null
  company_id: string | null
  opportunity_id: string | null
  type: 'call' | 'meeting' | 'email' | 'task' | 'follow_up' | 'other'
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  due_date: string | null
  completed_at: string | null
  assigned_to: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  contact?: Contact
  company?: Company
  opportunity?: SalesOpportunity
  assigned_user?: SystemUser
}
