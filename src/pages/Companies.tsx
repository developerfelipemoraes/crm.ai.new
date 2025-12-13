import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Company } from '@/types/database'
import { CompanyWizard } from '@/components/wizards/CompanyWizard'

export function Companies() {
  const { systemUser } = useAuth()
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('organization_id', systemUser?.organization_id!)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as Company[]
    },
    enabled: !!systemUser?.organization_id,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empresas</h1>
          <p className="text-muted-foreground">Gestão de empresas pessoas jurídicas</p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : companies && companies.length > 0 ? (
            <div className="space-y-4">
              {companies.map((company) => (
                <div key={company.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{company.corporate_name}</p>
                    {company.trade_name && (
                      <p className="text-sm text-muted-foreground">{company.trade_name}</p>
                    )}
                    <p className="text-sm text-muted-foreground">CNPJ: {company.cnpj}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{company.status}</p>
                    <p className="text-xs text-muted-foreground">KYC: {company.kyc_score}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhuma empresa encontrada.</p>
          )}
        </CardContent>
      </Card>

      <CompanyWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  )
}
