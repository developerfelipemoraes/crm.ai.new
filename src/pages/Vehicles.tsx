import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Vehicle } from '@/types/database'
import { VehicleWizard } from '@/components/wizards/VehicleWizard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Vehicles() {
  const { systemUser } = useAuth()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [groupBy, setGroupBy] = useState('model_year_desc')
  const [sortBy, setSortBy] = useState('year_newest')

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('organization_id', systemUser?.organization_id!)
        .order('model_year', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as Vehicle[]
    },
    enabled: !!systemUser?.organization_id,
  })

  const groupedVehicles = useMemo(() => {
    if (!vehicles) return {}

    if (groupBy === 'model_year_desc') {
      const groups: Record<string, Vehicle[]> = {}
      vehicles.forEach((vehicle) => {
        const year = vehicle.model_year ? `Ano Modelo ${vehicle.model_year}` : 'Sem Ano Modelo'
        if (!groups[year]) {
          groups[year] = []
        }
        groups[year].push(vehicle)
      })
      // Sort groups by year descending
      return Object.entries(groups)
        .sort((a, b) => b[0].localeCompare(a[0], undefined, { numeric: true }))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    }

    return { 'Todos os Veículos': vehicles }
  }, [vehicles, groupBy])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Veículos</h1>
          <p className="text-muted-foreground">{vehicles?.length || 0} veículos encontrados</p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium whitespace-nowrap">Agrupar por:</span>
           <Select value={groupBy} onValueChange={setGroupBy}>
             <SelectTrigger className="w-[240px] bg-white">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="model_year_desc">Por Ano Modelo (Decrescente)</SelectItem>
               <SelectItem value="none">Sem agrupamento</SelectItem>
             </SelectContent>
           </Select>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium whitespace-nowrap">Ordenar por:</span>
           <Select value={sortBy} onValueChange={setSortBy}>
             <SelectTrigger className="w-[180px] bg-white">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="year_newest">Ano: Mais novos</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </div>

      {isLoading ? (
         <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedVehicles).map(([groupTitle, groupVehicles]: [string, any[]]) => (
            <div key={groupTitle} className="space-y-4">
              {groupBy !== 'none' && (
                <div className="bg-[#003366] text-white p-3 rounded-md font-medium">
                  {groupTitle} ({groupVehicles.length} {groupVehicles.length === 1 ? 'veículo' : 'veículos'})
                </div>
              )}

              <div className="space-y-4">
                 {groupVehicles.map((vehicle) => (
                  <Card key={vehicle.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-bold text-lg">{vehicle.title}</p>
                           <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                              {vehicle.condition && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs capitalize">
                                  {vehicle.condition === 'semi-new' ? 'Semi-novo' : vehicle.condition === 'new' ? 'Novo' : 'Usado'}
                                </span>
                              )}
                              {vehicle.chassis_manufacturer && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                  {vehicle.chassis_manufacturer} {vehicle.body_manufacturer}
                                </span>
                              )}
                               <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                  {vehicle.available_quantity || 1} unidade(s)
                               </span>
                           </div>
                           <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <span>📅 {vehicle.fabrication_year}/{vehicle.model_year}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>⚡ {vehicle.mileage || 0} km</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <Button variant="default" size="sm">
                             Ver detalhes
                           </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                 ))}
              </div>
            </div>
          ))}
          {vehicles?.length === 0 && (
            <p className="text-muted-foreground">Nenhum veículo encontrado.</p>
          )}
        </div>
      )}

      <VehicleWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  )
}
