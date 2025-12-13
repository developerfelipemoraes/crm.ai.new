import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  type: z.string().min(1, 'Tipo é obrigatório'),
  priority: z.string().default('medium'),
  status: z.string().default('pending'),
  due_date: z.string().optional(),
  contact_id: z.string().optional(),
  company_id: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskWizard({ open, onOpenChange }: TaskWizardProps) {
  const { systemUser } = useAuth()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
      status: 'pending',
      type: 'task',
    },
  })

  const { data: contacts } = useQuery({
    queryKey: ['contacts', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, full_name')
        .eq('organization_id', systemUser?.organization_id!)
        .order('full_name', { ascending: true })
        .limit(100)

      if (error) throw error
      return data
    },
    enabled: !!systemUser?.organization_id && open,
  })

  const { data: companies } = useQuery({
    queryKey: ['companies', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, corporate_name, trade_name')
        .eq('organization_id', systemUser?.organization_id!)
        .order('corporate_name', { ascending: true })
        .limit(100)

      if (error) throw error
      return data
    },
    enabled: !!systemUser?.organization_id && open,
  })

  const createMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const taskData = {
        organization_id: systemUser?.organization_id,
        title: data.title,
        description: data.description || null,
        type: data.type,
        priority: data.priority,
        status: data.status,
        due_date: data.due_date || null,
        contact_id: data.contact_id || null,
        company_id: data.company_id || null,
        assigned_to: systemUser?.id,
        created_by: systemUser?.id,
      }

      const { data: result, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Tarefa criada com sucesso!')
      reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar tarefa')
    },
  })

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true)
    try {
      await createMutation.mutateAsync(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ligar para cliente sobre proposta"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detalhes sobre a tarefa"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                onValueChange={(value) => setValue('type', value)}
                defaultValue={watch('type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Ligação</SelectItem>
                  <SelectItem value="meeting">Reunião</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="task">Tarefa</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                onValueChange={(value) => setValue('priority', value)}
                defaultValue={watch('priority')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Data de Vencimento</Label>
            <Input
              id="due_date"
              type="datetime-local"
              {...register('due_date')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_id">Contato</Label>
              <Select
                onValueChange={(value) => setValue('contact_id', value)}
                value={watch('contact_id')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um contato" />
                </SelectTrigger>
                <SelectContent>
                  {contacts?.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_id">Empresa</Label>
              <Select
                onValueChange={(value) => setValue('company_id', value)}
                value={watch('company_id')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.trade_name || company.corporate_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
