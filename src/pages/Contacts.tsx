import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import { Contact } from '@/types/database'
import { ContactWizard } from '@/components/wizards/ContactWizard'
import { EmptyState } from '@/components/ui/empty-state'

export function Contacts() {
  const { systemUser } = useAuth()
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('organization_id', systemUser?.organization_id!)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as Contact[]
    },
    enabled: !!systemUser?.organization_id,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contatos</h1>
          <p className="text-muted-foreground">Gestão de contatos pessoas físicas</p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contato
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : contacts && contacts.length > 0 ? (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{contact.full_name}</p>
                    <p className="text-sm text-muted-foreground">CPF: {contact.cpf}</p>
                    {contact.address_email && (
                      <p className="text-sm text-muted-foreground">{contact.address_email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">KYC: {contact.kyc_score}%</p>
                    <p className="text-xs text-muted-foreground">{contact.kyc_classification}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Nenhum contato encontrado"
              description="Você ainda não cadastrou nenhum contato. Comece adicionando o primeiro."
              action={
                <Button onClick={() => setIsWizardOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Contato
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      <ContactWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  )
}
