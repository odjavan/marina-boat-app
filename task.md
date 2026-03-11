# Checklist de Pendências - Marina Boat (06/03/2026)

## 🔧 Infraestrutura & DevOps
- [x] Configurar Registro tipo A no Registro.br (`marinaboat.boatpass.com.br` -> `212.85.17.131`)
- [/] Atualizar o domínio nas configurações da aplicação no Coolify
- [ ] Verificar propagação do DNS e emissão do certificado SSL
- [ ] Sincronizar pasta oficial com `sync_to_official.ps1`

## 🍱 Funcionalidades v1.0 (MVP)
- [x] Alertas de Documentos (Frontend avisando sobre validade) (v1.0.7)
- [x] Refinamento de Login e Redefinição (v1.0.8)
    - [x] Switch do Captcha animado (sliding)
    - [x] Traduzir erros do Supabase para o Português
    - [x] Criar tela/fluxo de Nova Senha dedicada
- [x] Integrar Meteorologia (Ajustando API Key e UI do Dashboard - v1.0.9)
- [x] Implementar exportação de Relatórios Financeiros (PDF/CSV) (v1.1.0)

## 📡 Roadmap Futuro
- [x] Implementar PWA (Instalação como APP)
    - [x] Criar pasta `public` (se necessário)
    - [x] Criar `manifest.json`
    - [x] Gerar/Adicionar ícones (192x192, 512x512)
    - [x] Vincular no `index.html`
- [x] Atualizar PRD e Versionamento (v1.0.4)
- [ ] Notificações Push nativas
- [ ] Dashboard específico do Marinheiro
- [ ] Pagamentos integrados (Stripe/Cakto)
