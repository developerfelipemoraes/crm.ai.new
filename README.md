# Bolt CRM - Sistema Multi-Empresa

Sistema CRM completo com arquitetura multi-tenant para gestão de contatos, empresas, veículos e oportunidades de venda.

## 🚀 Funcionalidades

### Core Features
- ✅ **Autenticação e Autorização** - Sistema completo com Supabase Auth
- ✅ **Multi-Tenancy** - Isolamento total de dados por organização
- ✅ **Dashboard** - KPIs e métricas em tempo real
- ✅ **Gestão de Contatos** - Cadastro completo de pessoas físicas
- ✅ **Gestão de Empresas** - Cadastro completo de pessoas jurídicas
- ✅ **Gestão de Veículos** - Controle de estoque de veículos
- ✅ **Pipeline de Vendas** - Gestão de oportunidades e estágios
- ✅ **Tarefas e Atividades** - Agendamento e acompanhamento

### Recursos Técnicos
- ⚡ **Vite + React 18** - Build rápido e HMR
- 🎨 **Tailwind CSS + Shadcn/ui** - Design system moderno
- 🔐 **Supabase** - Backend as a Service com RLS
- 📊 **React Query** - Gerenciamento de estado e cache
- 🎯 **TypeScript** - Type safety em todo o código
- 📱 **Responsive Design** - Funciona em desktop, tablet e mobile

### Validações Brasileiras
- ✅ CPF e CNPJ com validação de dígitos verificadores
- ✅ CEP com integração ViaCEP
- ✅ Formatação automática de documentos

## 📋 Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Conta Supabase (já configurada)

## 🛠️ Instalação

1. Clone o repositório (já feito)

2. Instale as dependências:
```bash
npm install
```

3. As variáveis de ambiente já estão configuradas no arquivo `.env`

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse `http://localhost:5173`

## 🗄️ Estrutura do Banco de Dados

O sistema usa Supabase com as seguintes tabelas principais:

### Organizações e Usuários
- `organizations` - Organizações que usam o CRM
- `system_users` - Usuários com roles (super_admin, company_admin, sales, support)
- `permissions` e `role_permissions` - Sistema de permissões

### Core Business
- `contacts` - Contatos (PF) com dados pessoais, documentos, endereço, profissionais, financeiros, bancários e compliance
- `companies` - Empresas (PJ) com identificação, endereços, estrutura corporativa, financeiro e compliance
- `vehicles` - Veículos com tipo, categoria, dados técnicos, mídia e localização
- `contact_company_links` - Vínculos N:N entre contatos e empresas

### Sales Pipeline
- `sales_pipelines` - Pipelines de venda configuráveis
- `pipeline_stages` - Estágios dos pipelines com probabilidade
- `sales_opportunities` - Oportunidades de venda
- `opportunity_timeline` - Histórico de eventos
- `loss_reasons` - Motivos de perda configuráveis

### Tasks & Activities
- `tasks` - Tarefas e atividades (call, meeting, email, task, follow_up)
- `task_comments` - Comentários nas tarefas

### Segurança
- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Isolamento por `organization_id`
- ✅ Verificação de permissões por resource e action
- ✅ Políticas restritivas por padrão

## 📱 Páginas e Rotas

- `/login` - Login
- `/register` - Registro de novos usuários
- `/dashboard` - Dashboard com KPIs
- `/contacts` - Lista de contatos
- `/companies` - Lista de empresas
- `/vehicles` - Lista de veículos
- `/opportunities` - Pipeline de vendas
- `/tasks` - Tarefas e atividades

## 🏗️ Arquitetura

```
src/
├── components/         # Componentes React
│   ├── ui/            # Componentes UI (shadcn)
│   ├── Layout.tsx     # Layout principal
│   ├── Sidebar.tsx    # Menu lateral
│   └── Header.tsx     # Cabeçalho
├── contexts/          # React Contexts
│   └── AuthContext.tsx
├── lib/               # Utilitários
│   ├── supabase.ts    # Cliente Supabase
│   ├── utils.ts       # Helpers
│   └── validations.ts # Validações BR
├── pages/             # Páginas da aplicação
├── types/             # TypeScript types
└── App.tsx            # App principal
```

## 🔑 Primeiro Acesso

1. Crie uma conta em `/register`
2. O usuário será criado na organização "Aurovel" (master)
3. Role padrão: `sales`

Para criar um admin, execute no Supabase:
```sql
UPDATE system_users
SET role = 'company_admin'
WHERE email = 'seu@email.com';
```

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

Os arquivos estarão em `dist/` prontos para deploy.

## 🎯 Próximos Passos

### Wizards Completos
- [ ] Contact Wizard - 9 passos completos
- [ ] Company Wizard - 11 passos completos
- [ ] Vehicle Wizard - 11 passos completos

### Features Avançadas
- [ ] Smart Matching - Algoritmo de matching entre empresas e contatos
- [ ] Relatórios e Analytics
- [ ] Exportação de dados (Excel, PDF)
- [ ] Notificações em tempo real
- [ ] Upload de arquivos e documentos
- [ ] Sistema de comentários e notas

## 📝 Licença

MIT

---

Desenvolvido com ❤️ usando React, TypeScript e Supabase