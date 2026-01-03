import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  Car,
  TrendingUp,
  CheckSquare,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contatos', href: '/contacts', icon: Users },
  { name: 'Empresas', href: '/companies', icon: Building2 },
  { name: 'Veículos', href: '/vehicles', icon: Car },
  { name: 'Oportunidades', href: '/opportunities', icon: TrendingUp },
  { name: 'Tarefas', href: '/tasks', icon: CheckSquare },
  { name: 'Modelos de Chassi', href: '/chassis-models', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="flex w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary">Bolt CRM</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
