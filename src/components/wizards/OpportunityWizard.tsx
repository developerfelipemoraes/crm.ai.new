import { useState, useEffect } from 'react'
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

const opportunitySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  pipeline_id: z.string().min(1, 'Pipeline é obrigatório'),
  stage_id: z.string().min(1, 'Estágio é obrigatório'),
  contact_id: z.string().optional(),
  company_id: z.string().optional(),
  value: z.string().optional(),
  expected_close_date: z.string().optional(),
})

type OpportunityFormData = z.infer<typeof opportunitySchema>

interface OpportunityWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OpportunityWizard({ open, onOpenChange }: OpportunityWizardProps) {
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
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
  })

  const selectedPipelineId = watch('pipeline_id')

  const { data: pipelines } = useQuery({
    queryKey: ['pipelines', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_pipelines')
        .select('*')
        .eq('organization_id', systemUser?.organization_id!)
        .eq('is_active', true)
        .order('is_default', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!systemUser?.organization_id && open,
  })

  const { data: stages } = useQuery({
    queryKey: ['stages', selectedPipelineId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('*')
        .eq('pipeline_id', selectedPipelineId)
        .order('order', { ascending: true })

      if (error) throw error
      return data
    },
    enabled: !!selectedPipelineId,
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

  useEffect(() => {
    if (pipelines && pipelines.length > 0 && !selectedPipelineId) {
      const defaultPipeline = pipelines.find(p => p.is_default) || pipelines[0]
      setValue('pipeline_id', defaultPipeline.id)
    }
  }, [pipelines, selectedPipelineId, setValue])

  useEffect(() => {
    if (stages && stages.length > 0 && !watch('stage_id')) {
      setValue('stage_id', stages[0].id)
    }
  }, [stages, setValue, watch])

  const createMutation = useMutation({
    mutationFn: async (data: OpportunityFormData) => {
      const opportunityData = {
        organization_id: systemUser?.organization_id,
        title: data.title,
        description: data.description || null,
        pipeline_id: data.pipeline_id,
        stage_id: data.stage_id,
        contact_id: data.contact_id || null,
        company_id: data.company_id || null,
        value: data.value ? parseFloat(data.value) : 0,
        expected_close_date: data.expected_close_date || null,
        status: 'open',
        assigned_to: systemUser?.id,
      }

      const { data: result, error } = await supabase
        .from('sales_opportunities')
        .insert(opportunityData)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
      toast.success('Oportunidade criada com sucesso!')
      reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar oportunidade')
    },
  })

  const onSubmit = async (data: OpportunityFormData) => {
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
          <DialogTitle>Nova Oportunidade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Venda de ônibus para Transportadora XYZ"
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
              placeholder="Detalhes sobre a oportunidade"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pipeline_id">Pipeline *</Label>
              <Select
                onValueChange={(value) => {
                  setValue('pipeline_id', value)
                  setValue('stage_id', '')
                }}
                value={watch('pipeline_id')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {pipelines?.map((pipeline) => (
                    <SelectItem key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pipeline_id && (
                <p className="text-sm text-red-500">{errors.pipeline_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage_id">Estágio *</Label>
              <Select
                onValueChange={(value) => setValue('stage_id', value)}
                value={watch('stage_id')}
                disabled={!selectedPipelineId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estágio" />
                </SelectTrigger>
                <SelectContent>
                  {stages?.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stage_id && (
                <p className="text-sm text-red-500">{errors.stage_id.message}</p>
              )}
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...register('value')}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_close_date">Data Prevista de Fechamento</Label>
              <Input
                id="expected_close_date"
                type="date"
                {...register('expected_close_date')}
              />
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
              Criar Oportunidade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
