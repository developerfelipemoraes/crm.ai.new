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
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { brazilianStates } from '@/data/brazilian-states'

const vehicleSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  vehicle_type: z.string().min(1, 'Tipo é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  subcategory: z.string().optional(),
  fabrication_year: z.string().optional(),
  model_year: z.string().optional(),
  chassis_manufacturer: z.string().optional(),
  body_manufacturer: z.string().optional(),
  chassis_model: z.string().optional(),
  body_model: z.string().optional(),
  license_plate: z.string().optional(),
  mileage: z.string().optional(),
  condition: z.string().optional(),
  status: z.string().default('active'),
  description: z.string().optional(),
  location_city: z.string().min(1, 'Cidade é obrigatória'),
  location_state: z.string().min(1, 'Estado é obrigatório'),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

interface VehicleWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VehicleWizard({ open, onOpenChange }: VehicleWizardProps) {
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
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      status: 'active',
      condition: 'used',
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: VehicleFormData) => {
      const vehicleData = {
        organization_id: systemUser?.organization_id,
        title: data.title,
        vehicle_type: { type: data.vehicle_type },
        category: { category: data.category },
        subcategory: data.subcategory ? { subcategory: data.subcategory } : null,
        fabrication_year: data.fabrication_year ? parseInt(data.fabrication_year) : null,
        model_year: data.model_year ? parseInt(data.model_year) : null,
        chassis_manufacturer: data.chassis_manufacturer || null,
        body_manufacturer: data.body_manufacturer || null,
        chassis_model: data.chassis_model || null,
        body_model: data.body_model || null,
        license_plate: data.license_plate || null,
        mileage: data.mileage ? parseInt(data.mileage) : 0,
        condition: data.condition || null,
        status: data.status,
        description: data.description || null,
        location: {
          city: data.location_city,
          state: data.location_state,
        },
      }

      const { data: result, error } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      toast.success('Veículo criado com sucesso!')
      reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar veículo')
    },
  })

  const onSubmit = async (data: VehicleFormData) => {
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
          <DialogTitle>Novo Veículo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ex: Ônibus Mercedes-Benz O500"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_type">Tipo *</Label>
              <Select
                onValueChange={(value) => setValue('vehicle_type', value)}
                defaultValue={watch('vehicle_type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onibus">Ônibus</SelectItem>
                  <SelectItem value="micro-onibus">Micro-ônibus</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="caminhao">Caminhão</SelectItem>
                  <SelectItem value="carreta">Carreta</SelectItem>
                </SelectContent>
              </Select>
              {errors.vehicle_type && (
                <p className="text-sm text-red-500">{errors.vehicle_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                onValueChange={(value) => setValue('category', value)}
                defaultValue={watch('category')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urbano">Urbano</SelectItem>
                  <SelectItem value="rodoviario">Rodoviário</SelectItem>
                  <SelectItem value="turismo">Turismo</SelectItem>
                  <SelectItem value="escolar">Escolar</SelectItem>
                  <SelectItem value="fretamento">Fretamento</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fabrication_year">Ano de Fabricação</Label>
              <Input
                id="fabrication_year"
                type="number"
                {...register('fabrication_year')}
                placeholder="2020"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model_year">Ano Modelo</Label>
              <Input
                id="model_year"
                type="number"
                {...register('model_year')}
                placeholder="2021"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chassis_manufacturer">Fabricante do Chassi</Label>
              <Input
                id="chassis_manufacturer"
                {...register('chassis_manufacturer')}
                placeholder="Mercedes-Benz"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_manufacturer">Fabricante da Carroceria</Label>
              <Input
                id="body_manufacturer"
                {...register('body_manufacturer')}
                placeholder="Marcopolo"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chassis_model">Modelo do Chassi</Label>
              <Input
                id="chassis_model"
                {...register('chassis_model')}
                placeholder="O500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_model">Modelo da Carroceria</Label>
              <Input
                id="body_model"
                {...register('body_model')}
                placeholder="Paradiso"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="license_plate">Placa</Label>
              <Input
                id="license_plate"
                {...register('license_plate')}
                placeholder="ABC-1234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Quilometragem</Label>
              <Input
                id="mileage"
                type="number"
                {...register('mileage')}
                placeholder="50000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condição</Label>
              <Select
                onValueChange={(value) => setValue('condition', value)}
                defaultValue={watch('condition')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Novo</SelectItem>
                  <SelectItem value="semi-new">Semi-novo</SelectItem>
                  <SelectItem value="used">Usado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location_city">Cidade *</Label>
              <Input
                id="location_city"
                {...register('location_city')}
                placeholder="São Paulo"
              />
              {errors.location_city && (
                <p className="text-sm text-red-500">{errors.location_city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_state">Estado *</Label>
              <Select
                onValueChange={(value) => setValue('location_state', value)}
                defaultValue={watch('location_state')}
              >
                <SelectTrigger id="location_state">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent className="h-60">
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location_state && (
                <p className="text-sm text-red-500">{errors.location_state.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Informações adicionais sobre o veículo"
              rows={3}
            />
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
              Criar Veículo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
