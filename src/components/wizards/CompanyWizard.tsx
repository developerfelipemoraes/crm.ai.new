import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const companySchema = z.object({
  corporate_name: z.string().min(1, 'Razão social é obrigatória'),
  trade_name: z.string().optional(),
  cnpj: z.string().min(14, 'CNPJ é obrigatório').max(18),
  state_registration: z.string().optional(),
  municipal_registration: z.string().optional(),
  primary_email: z.string().email('Email inválido').optional().or(z.literal('')),
  primary_phone: z.string().optional(),
  primary_mobile: z.string().optional(),
  primary_street: z.string().optional(),
  primary_number: z.string().optional(),
  primary_neighborhood: z.string().optional(),
  primary_city: z.string().optional(),
  primary_state: z.string().optional(),
  primary_zip_code: z.string().optional(),
  company_size: z.string().optional(),
  status: z.string().default('prospect'),
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanyWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanyWizard({ open, onOpenChange }: CompanyWizardProps) {
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
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      status: 'prospect',
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      const companyData = {
        organization_id: systemUser?.organization_id,
        corporate_name: data.corporate_name,
        trade_name: data.trade_name || null,
        cnpj: data.cnpj.replace(/\D/g, ''),
        state_registration: data.state_registration || null,
        municipal_registration: data.municipal_registration || null,
        primary_email: data.primary_email || null,
        primary_phone: data.primary_phone || null,
        primary_mobile: data.primary_mobile || null,
        primary_street: data.primary_street || null,
        primary_number: data.primary_number || null,
        primary_neighborhood: data.primary_neighborhood || null,
        primary_city: data.primary_city || null,
        primary_state: data.primary_state || null,
        primary_zip_code: data.primary_zip_code || null,
        company_size: data.company_size || '',
        status: data.status,
      }

      const { data: result, error } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Empresa criada com sucesso!')
      reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar empresa')
    },
  })

  const onSubmit = async (data: CompanyFormData) => {
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
          <DialogTitle>Nova Empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="corporate_name">Razão Social *</Label>
            <Input
              id="corporate_name"
              {...register('corporate_name')}
              placeholder="Empresa Transportes Ltda"
            />
            {errors.corporate_name && (
              <p className="text-sm text-red-500">{errors.corporate_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trade_name">Nome Fantasia</Label>
            <Input
              id="trade_name"
              {...register('trade_name')}
              placeholder="Transportes São Paulo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                {...register('cnpj')}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
              {errors.cnpj && (
                <p className="text-sm text-red-500">{errors.cnpj.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_size">Porte</Label>
              <Select
                onValueChange={(value) => setValue('company_size', value)}
                defaultValue={watch('company_size')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEI">MEI</SelectItem>
                  <SelectItem value="ME">Microempresa</SelectItem>
                  <SelectItem value="EPP">Empresa Pequeno Porte</SelectItem>
                  <SelectItem value="Médio">Médio Porte</SelectItem>
                  <SelectItem value="Grande">Grande Porte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state_registration">Inscrição Estadual</Label>
              <Input
                id="state_registration"
                {...register('state_registration')}
                placeholder="000.000.000.000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipal_registration">Inscrição Municipal</Label>
              <Input
                id="municipal_registration"
                {...register('municipal_registration')}
                placeholder="00000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_email">Email</Label>
            <Input
              id="primary_email"
              type="email"
              {...register('primary_email')}
              placeholder="contato@empresa.com"
            />
            {errors.primary_email && (
              <p className="text-sm text-red-500">{errors.primary_email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_phone">Telefone</Label>
              <Input
                id="primary_phone"
                {...register('primary_phone')}
                placeholder="(11) 3333-3333"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_mobile">Celular</Label>
              <Input
                id="primary_mobile"
                {...register('primary_mobile')}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Endereço Principal</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="primary_street">Rua</Label>
                  <Input
                    id="primary_street"
                    {...register('primary_street')}
                    placeholder="Avenida Paulista"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary_number">Número</Label>
                  <Input
                    id="primary_number"
                    {...register('primary_number')}
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_neighborhood">Bairro</Label>
                <Input
                  id="primary_neighborhood"
                  {...register('primary_neighborhood')}
                  placeholder="Bela Vista"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="primary_city">Cidade</Label>
                  <Input
                    id="primary_city"
                    {...register('primary_city')}
                    placeholder="São Paulo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary_state">UF</Label>
                  <Input
                    id="primary_state"
                    {...register('primary_state')}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_zip_code">CEP</Label>
                <Input
                  id="primary_zip_code"
                  {...register('primary_zip_code')}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
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
              Criar Empresa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
