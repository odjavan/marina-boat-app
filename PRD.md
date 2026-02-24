# PRD — Marina Boat v1.0

## Visão Geral
**Marina Boat** é um ecossistema digital para o setor náutico que conecta proprietários de embarcações a marinas e prestadores de serviços. O objetivo é simplificar a gestão de barcos, solicitações de manutenção, abastecimento e limpeza através de uma interface moderna e intuitiva.

## Escopo Técnica (MVP)
- **Frontend:** React, Vite, Tailwind CSS.
- **Backend/DB:** Supabase (Auth, Tables, RLS).
- **Entidades Principais:**
    - `boats` (Embarcações): Nome, marca, modelo, ano, tamanho, matrícula.
    - `service_requests` (Solicitações): Vínculo com barco, status, urgência.
    - `service_categories` & `services`: Catálogo de serviços náuticos.
    - `boat_documents`: TIE, Seguro, Licença (com alertas de validade).
    - `service_ratings`: Feedback pós-serviço.

## Funcionalidades Core
1. **Dashboard Home:** Visão geral de serviços ativos e alertas.
2. **Wizard de Serviço:** Fluxo em etapas para agendar limpezas, abastecimento ou reparos.
3. **Timeline de Status:** Acompanhamento visual da evolução do serviço (Pendente -> Concluído).
4. **Gestão de Frota:** Cadastro detalhado de múltiplos barcos.
5. **Carteira de Documentos:** Armazenamento seguro de documentos náuticos com aviso de vencimento.

## Roadmap Futuro
- Pagamentos integrados via Gateway (Stripe/Cakto).
- Chat em tempo real entre Dono e Marina.
- Notificações Push nativas.
- Geolocalização de marinas próximas.
