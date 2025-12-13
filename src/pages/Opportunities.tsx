import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SalesOpportunity } from '@/types/database'
import { OpportunityWizard } from '@/components/wizards/OpportunityWizard'

export function Opportunities() {
  const { systemUser } = useAuth()
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_opportunities')
        .select(`
          *,
          contact:contacts(*),
          company:companies(*),
          stage:pipeline_stages(*)
        `)
        .eq('organization_id', systemUser?.organization_id!)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as SalesOpportunity[]
    },
    enabled: !!systemUser?.organization_id,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Oportunidades</h1>
          <p className="text-muted-foreground">Pipeline de vendas</p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Oportunidade
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Oportunidades</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : opportunities && opportunities.length > 0 ? (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{opp.title}</p>
                    {opp.company && (
                      <p className="text-sm text-muted-foreground">{opp.company.corporate_name}</p>
                    )}
                    {opp.stage && (
                      <p className="text-sm text-muted-foreground">Estágio: {opp.stage.name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      R$ {opp.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{opp.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhuma oportunidade encontrada.</p>
          )}
        </CardContent>
      </Card>

      <OpportunityWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  )
}
