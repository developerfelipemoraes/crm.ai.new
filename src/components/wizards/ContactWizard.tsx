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

const contactSchema = z.object({
  full_name: z.string().min(1, 'Nome completo é obrigatório'),
  cpf: z.string().min(11, 'CPF é obrigatório').max(14),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  address_email: z.string().email('Email inválido').optional().or(z.literal('')),
  address_mobile: z.string().optional(),
  address_phone: z.string().optional(),
  address_street: z.string().optional(),
  address_number: z.string().optional(),
  address_neighborhood: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  address_zip_code: z.string().optional(),
  occupation: z.string().optional(),
  marital_status: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactWizard({ open, onOpenChange }: ContactWizardProps) {
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
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const createMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const contactData = {
        organization_id: systemUser?.organization_id,
        full_name: data.full_name,
        cpf: data.cpf.replace(/\D/g, ''),
        birth_date: data.birth_date || null,
        gender: data.gender || '',
        address_email: data.address_email || null,
        address_mobile: data.address_mobile || null,
        address_phone: data.address_phone || null,
        address_street: data.address_street || null,
        address_number: data.address_number || null,
        address_neighborhood: data.address_neighborhood || null,
        address_city: data.address_city || null,
        address_state: data.address_state || null,
        address_zip_code: data.address_zip_code || null,
        occupation: data.occupation || null,
        marital_status: data.marital_status || '',
      }

      const { data: result, error } = await supabase
        .from('contacts')
        .insert(contactData)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast.success('Contato criado com sucesso!')
      reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar contato')
    },
  })

  const onSubmit = async (data: ContactFormData) => {
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
          <DialogTitle>Novo Contato</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo *</Label>
            <Input
              id="full_name"
              {...register('full_name')}
              placeholder="João da Silva"
            />
            {errors.full_name && (
              <p className="text-sm text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                {...register('cpf')}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500">{errors.cpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                type="date"
                {...register('birth_date')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select
                onValueChange={(value) => setValue('gender', value)}
                defaultValue={watch('gender')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marital_status">Estado Civil</Label>
              <Select
                onValueChange={(value) => setValue('marital_status', value)}
                defaultValue={watch('marital_status')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                  <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                  <SelectItem value="União estável">União estável</SelectItem>
                  <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                  <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_email">Email</Label>
            <Input
              id="address_email"
              type="email"
              {...register('address_email')}
              placeholder="joao@email.com"
            />
            {errors.address_email && (
              <p className="text-sm text-red-500">{errors.address_email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address_mobile">Celular</Label>
              <Input
                id="address_mobile"
                {...register('address_mobile')}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_phone">Telefone</Label>
              <Input
                id="address_phone"
                {...register('address_phone')}
                placeholder="(11) 3333-3333"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Profissão</Label>
            <Input
              id="occupation"
              {...register('occupation')}
              placeholder="Engenheiro"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Endereço</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address_street">Rua</Label>
                  <Input
                    id="address_street"
                    {...register('address_street')}
                    placeholder="Rua das Flores"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_number">Número</Label>
                  <Input
                    id="address_number"
                    {...register('address_number')}
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_neighborhood">Bairro</Label>
                <Input
                  id="address_neighborhood"
                  {...register('address_neighborhood')}
                  placeholder="Centro"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address_city">Cidade</Label>
                  <Input
                    id="address_city"
                    {...register('address_city')}
                    placeholder="São Paulo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_state">UF</Label>
                  <Input
                    id="address_state"
                    {...register('address_state')}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_zip_code">CEP</Label>
                <Input
                  id="address_zip_code"
                  {...register('address_zip_code')}
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
              Criar Contato
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
