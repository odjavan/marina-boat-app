# GOTCHAS — Marina Boat (Lições Aprendidas)

Este documento registra as dificuldades técnicas e erros recorrentes encontrados durante o desenvolvimento do MVP, para evitar retrabalho.

## 1. Testes e Automação (Playwright)
- **Timeout no Login:** Frequentemente o seletor `Entrar como Administrador` falha por lentidão na renderização do AppProvider. Solução: Aumentar o timeout para 10s em testes críticos.
- **Conexão Recusada (Port 5173):** Certifique-se de que o servidor Vite está rodando antes de iniciar os testes. O erro `ECONNREFUSED` indica que o backend local não foi iniciado.

## 2. Banco de Dados & Supabase
- **RLS (Row Level Security):** Ao adicionar novas tabelas como `boat_documents`, é CRÍTICO habilitar o RLS e adicionar a política `Enable insert for authenticated users only` baseada no `owner_id`.
- **Mapeamento de IDs:** O sistema utiliza `owner_id` para barcos e `created_by` para solicitações. No refactor para GSD, manter a consistência desses campos.

## 3. Frontend (React)
- **Nesting de Providers:** Mantenha o `AppProvider` como pai direto do `App` para garantir que o estado global de autenticação esteja disponível em todas as rotas.
- **Service Wizard:** O componente wizard é sensível ao estado de `is_active` das embarcações. Se um barco está arquivado, ele não deve aparecer no seletor de serviços.

## 4. Deploy e Sincronização
- **Script de Sincronização:** Use o `sync_to_official.ps1` para mover alterações da pasta de teste para a pasta oficial. Não edite a pasta oficial diretamente sem testar no BKP primeiro.
