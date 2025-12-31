import { supabase } from '@/lib/supabase'
import { Vehicle } from '@/types/database'
import { Paged, PaginationParams } from '@/types/pagination'

interface GetVehiclesParams extends PaginationParams {
  organizationId: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  companyId?: string
}

export async function getVehicles({
  page,
  limit,
  organizationId,
  sortBy = 'created_at',
  sortOrder = 'desc',
  companyId
}: GetVehiclesParams): Promise<Paged<Vehicle>> {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('vehicles')
    .select('*', { count: 'exact' })
    .eq('organization_id', organizationId)
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to)

  if (companyId) {
    query = query.eq('company_id', companyId)
  }

  const { data, count, error } = await query

  if (error) {
    throw error
  }

  return {
    data: (data as Vehicle[]) || [],
    count: count || 0,
  }
}
