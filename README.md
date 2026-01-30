# Marina Boat App

Sistema de gerenciamento de marina para reservas de barcos.

## 📁 Estrutura do Projeto

```
marina-boat-app/
├── supabase/
│   └── migrations/       # Arquivos de migração do banco de dados
├── src/                  # Código fonte da aplicação
├── .gitignore
└── README.md
```

## 🛠️ Tecnologias

- **Backend/Database**: Supabase (PostgreSQL + Auth + Storage)
- **Deploy**: Coolify (Self-hosted)
- **Versionamento**: Git/GitHub

## 🗄️ Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Dados dos usuários (vinculado ao Supabase Auth) |
| `boats` | Cadastro de embarcações |
| `bookings` | Reservas de barcos |

### Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado para garantir que:
- Usuários só acessam seus próprios dados
- Admins têm acesso completo (quando aplicável)

## 🚀 Setup Local

### Pré-requisitos

- Node.js 18+
- Supabase CLI
- Git

### Configuração do Supabase

1. Instale a CLI do Supabase:
   ```bash
   npm install -g supabase
   ```

2. Faça login:
   ```bash
   supabase login
   ```

3. Vincule ao projeto remoto:
   ```bash
   supabase link --project-ref SEU_PROJECT_REF
   ```

4. Para gerar migrações a partir do banco existente:
   ```bash
   supabase db pull
   ```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local` (nunca commitar):

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

## 🔒 Segurança

- Nunca commitar arquivos `.env` ou chaves de API
- Usar sempre RLS nas tabelas do Supabase
- Service Role Key apenas no backend/server-side

## 📄 Licença

Projeto privado - Todos os direitos reservados.

---

**Autor**: Matrix Agent  
**Criado em**: Janeiro 2026
