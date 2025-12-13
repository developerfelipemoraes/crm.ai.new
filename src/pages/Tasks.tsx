import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Task } from '@/types/database'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function Tasks() {
  const { systemUser } = useAuth()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          contact:contacts(*),
          company:companies(*)
        `)
        .eq('organization_id', systemUser?.organization_id!)
        .order('due_date', { ascending: true, nullsFirst: false })
        .limit(50)

      if (error) throw error
      return data as Task[]
    },
    enabled: !!systemUser?.organization_id,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground">Gestão de tarefas e atividades</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    {task.company && (
                      <p className="text-sm text-muted-foreground">{task.company.corporate_name}</p>
                    )}
                    {task.due_date && (
                      <p className="text-sm text-muted-foreground">
                        Vencimento: {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{task.status}</p>
                    <p className="text-xs text-muted-foreground capitalize">{task.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
