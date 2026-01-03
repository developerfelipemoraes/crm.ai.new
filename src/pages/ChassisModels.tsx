import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { ChassisModel } from '@/types/database'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function ChassisModels() {
  const { systemUser } = useAuth()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<ChassisModel | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    manufacturer: '',
    name: ''
  })

  const { data: models, isLoading } = useQuery({
    queryKey: ['chassis_models', systemUser?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chassis_models')
        .select('*')
        .eq('organization_id', systemUser?.organization_id!)
        .order('manufacturer', { ascending: true })

      if (error) throw error
      return data as ChassisModel[]
    },
    enabled: !!systemUser?.organization_id,
  })

  const createMutation = useMutation({
    mutationFn: async (data: { manufacturer: string; name: string }) => {
      const { error } = await supabase
        .from('chassis_models')
        .insert([{
          organization_id: systemUser?.organization_id,
          ...data
        }])

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chassis_models'] })
      toast.success('Modelo de chassi criado com sucesso!')
      handleCloseDialog()
    },
    onError: (error) => {
      toast.error('Erro ao criar modelo de chassi')
      console.error(error)
    }
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; manufacturer: string; name: string }) => {
      const { error } = await supabase
        .from('chassis_models')
        .update({
          manufacturer: data.manufacturer,
          name: data.name
        })
        .eq('id', data.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chassis_models'] })
      toast.success('Modelo de chassi atualizado com sucesso!')
      handleCloseDialog()
    },
    onError: (error) => {
      toast.error('Erro ao atualizar modelo de chassi')
      console.error(error)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('chassis_models')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chassis_models'] })
      toast.success('Modelo de chassi excluído com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao excluir modelo de chassi')
      console.error(error)
    }
  })

  const handleOpenDialog = (model?: ChassisModel) => {
    if (model) {
      setEditingModel(model)
      setFormData({
        manufacturer: model.manufacturer,
        name: model.name
      })
    } else {
      setEditingModel(null)
      setFormData({
        manufacturer: '',
        name: ''
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingModel(null)
    setFormData({
      manufacturer: '',
      name: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.manufacturer || !formData.name) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    if (editingModel) {
      updateMutation.mutate({
        id: editingModel.id,
        ...formData
      })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este modelo?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Modelos de Chassi</h1>
          <p className="text-muted-foreground">Gestão de modelos e fabricantes de chassi</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Modelo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Modelos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : models && models.length > 0 ? (
            <div className="space-y-4">
              {models.map((model) => (
                <div key={model.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{model.manufacturer}</p>
                    <p className="text-sm text-muted-foreground">{model.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(model)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(model.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum modelo encontrado.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModel ? 'Editar Modelo' : 'Novo Modelo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Fabricante <span className="text-red-500">*</span></Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Ex: Mercedes-Benz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Modelo <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: OF-1721"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
