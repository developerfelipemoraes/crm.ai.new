import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { VehicleWizard } from '@/components/wizards/VehicleWizard'
import { getVehicles } from '@/services/vehicles'
import { PaginationControls } from '@/components/ui/pagination-controls'

export function Vehicles() {
  const { systemUser } = useAuth()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', systemUser?.organization_id, page, limit],
    queryFn: () =>
      getVehicles({
        page,
        limit,
        organizationId: systemUser?.organization_id!,
      }),
    enabled: !!systemUser?.organization_id,
    placeholderData: keepPreviousData,
  })

  const vehicles = data?.data || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Veículos</h1>
          <p className="text-muted-foreground">Gestão de veículos</p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Veículos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : vehicles && vehicles.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{vehicle.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.fabrication_year}/{vehicle.model_year}
                      </p>
                      {vehicle.chassis_manufacturer && (
                        <p className="text-sm text-muted-foreground">
                          {vehicle.chassis_manufacturer} - {vehicle.body_manufacturer}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium capitalize">{vehicle.status}</p>
                      {vehicle.condition && (
                        <p className="text-xs text-muted-foreground capitalize">{vehicle.condition}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                itemsPerPage={limit}
                onItemsPerPageChange={(newLimit) => {
                  setLimit(newLimit)
                  setPage(1)
                }}
                totalItems={totalCount}
              />
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum veículo encontrado.</p>
          )}
        </CardContent>
      </Card>

      <VehicleWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  )
}
