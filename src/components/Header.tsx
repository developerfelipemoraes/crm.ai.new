import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'
import { toast } from 'sonner'

export function Header() {
  const { systemUser, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {systemUser?.organization?.name || 'CRM Multi-Empresa'}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">{systemUser?.full_name}</span>
          <span className="text-xs text-gray-500">({systemUser?.role})</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          title="Sair"
          aria-label="Sair do sistema"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
