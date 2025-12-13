import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Car, TrendingUp } from 'lucide-react'

export function Dashboard() {
  const { systemUser } = useAuth()

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', systemUser?.organization_id],
    queryFn: async () => {
      const orgId = systemUser?.organization_id
      if (!orgId) return null

      const [contacts, companies, vehicles, opportunities] = await Promise.all([
        supabase.from('contacts').select('id', { count: 'exact', head: true }).eq('organization_id', orgId),
        supabase.from('companies').select('id', { count: 'exact', head: true }).eq('organization_id', orgId),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('organization_id', orgId),
        supabase.from('sales_opportunities').select('id', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'open'),
      ])

      return {
        contacts: contacts.count || 0,
        companies: companies.count || 0,
        vehicles: vehicles.count || 0,
        opportunities: opportunities.count || 0,
      }
    },
    enabled: !!systemUser?.organization_id,
  })

  const cards = [
    {
      title: 'Contatos',
      value: stats?.contacts || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Empresas',
      value: stats?.companies || 0,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Veículos',
      value: stats?.vehicles || 0,
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Oportunidades Abertas',
      value: stats?.opportunities || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`rounded-full p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Bolt CRM!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sistema de gestão completo para contatos, empresas, veículos e oportunidades de venda.
            Use o menu lateral para navegar entre os módulos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
