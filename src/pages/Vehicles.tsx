import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Vehicle } from '@/types/database'
import { VehicleWizard } from '@/components/wizards/VehicleWizard'

export function Vehicles() {
  const { systemUser } = useAuth()
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('organization_id', systemUser?.organization_id!)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as Vehicle[]
    },
    enabled: !!systemUser?.organization_id,
  })

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
          ) : (
            <p className="text-muted-foreground">Nenhum veículo encontrado.</p>
          )}
        </CardContent>
      </Card>

      <VehicleWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  )
}
