# Arquitetura do Sistema (Scan Inicial)

**Data**: 2026-02-07
**Status**: Brownfield (Adoção)

## 1. Stack Tecnológico (Detectado)
*   **Frontend**: React 19 + Vite
*   **Estilização**: Tailwind CSS (`tailwind-merge`, `clsx`)
*   **Ícones**: Lucide React
*   **Backend/Dados**: Supabase (PostgreSQL)
*   **Testes**: Playwright
*   **Linguagem**: TypeScript

## 2. Estrutura de Arquivos
*   **Raiz**: Contém `App.tsx` (Monolito Funcional?), `index.html`, `vite.config.ts`.
*   **components/**: Componentes de UI reutilizáveis.
*   **lib/**: Utilitários e configurações (provável `supabase.ts`).
*   **supabase/**:
    *   `migrations/`: 15 arquivos de migração detectados (001 a 014).
*   **tests/**: Testes E2E e unitários.

## 3. Observações de Arquitetura
*   O projeto parece usar um padrão de "Single File Component" gigante em `App.tsx` (baseado no tamanho de 113KB), o que é um débito técnico a ser refatorado futuramente.
*   Autenticação via Supabase Auth.
*   Banco de dados relacional com RLS (Row Level Security) ativo (visto nas migrations).

## 4. Próximos Passos (Recomendação Aria)
1.  Quebrar `App.tsx` em microrrotas/páginas.
2.  Organizar melhor os tipos em `types.ts` (se existir) ou `src/types`.
