import { request } from './api'
import { Vehicle } from '@/types/database'
import { Paged, PaginationParams } from '@/types/pagination'
import { SystemUser } from '@/types/database'

interface GetVehiclesParams extends PaginationParams {
  user: SystemUser | null
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  companyId?: string
}

interface ApiResponse<T> {
  Data: T[] | { items: T[], total?: number, count?: number }
  count?: number
  total?: number
}

export async function getVehicles({
  page,
  limit,
  user,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: GetVehiclesParams): Promise<Paged<Vehicle>> {

  if (user) {
      console.log('Usuário para autenticação de veículos:', user.email);
      console.log('Usuário para autenticação de veículos:', user.organization_id);
  }

  const endpoint = '/vehicles'
  const params: Record<string, string | number> = {
    page,
    limit,
    sortBy,
    sortOrder
  }

  // Add company filter logic if needed, similar to original service
  // user.role !== 'super_admin' check based on snippet
  if (user && user.role !== 'super_admin' && user.organization_id) {
    params.companyId = user.organization_id
  }

  const response = await request<ApiResponse<Vehicle>>(endpoint, {
    params
  })

  const data = response.Data

  // Handle various response structures
  let items: Vehicle[] = []
  let count = 0

  if (Array.isArray(data)) {
    items = data
    count = data.length // If array, we might not have total count unless in headers or separate field
    if (response.count !== undefined) count = response.count
    if (response.total !== undefined) count = response.total
  } else {
    items = (data as any)?.items ?? []
    count = (data as any)?.total ?? (data as any)?.count ?? items.length
    if (response.count !== undefined) count = response.count
    if (response.total !== undefined) count = response.total
  }

  console.log('Veiculos carregadas:', items);

  return {
    data: items,
    count: count
  }
}
