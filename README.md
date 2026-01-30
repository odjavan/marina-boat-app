# Marina Boat App

Sistema de gerenciamento de marina para reservas de barcos.

## 📁 Estrutura do Projeto

```
marina-boat-app/
├── components/
│   └── ui.tsx            # Componentes de UI reutilizáveis
├── supabase/
│   └── migrations/       # Arquivos de migração do banco de dados
├── App.tsx               # Componente principal
├── index.tsx             # Ponto de entrada
├── index.html            # HTML principal
├── types.ts              # Tipos TypeScript
├── constants.ts          # Constantes da aplicação
├── package.json          # Dependências
├── vite.config.ts        # Configuração do Vite
├── tsconfig.json         # Configuração do TypeScript
├── .gitignore
└── README.md
```

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Backend/Database**: Supabase (PostgreSQL + Auth + Storage)
- **Deploy**: Coolify (Self-hosted)
- **Versionamento**: Git/GitHub

## 🚀 Executar Localmente

### Pré-requisitos

- Node.js 18+
- Git

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/odjavan/marina-boat-app.git
   cd marina-boat-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   # Edite .env.local com suas chaves
   ```

4. Execute o app:
   ```bash
   npm run dev
   ```

5. Acesse: http://localhost:5173

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

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local` (nunca commitar):

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
GEMINI_API_KEY=sua_gemini_key_aqui
```

## 🔒 Segurança

- Nunca commitar arquivos `.env` ou chaves de API
- Usar sempre RLS nas tabelas do Supabase
- Service Role Key apenas no backend/server-side

## 📦 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview do build de produção |

## 📄 Licença

Projeto privado - Todos os direitos reservados.

---

**Autor**: Matrix Agent  
**Criado em**: Janeiro 2026
