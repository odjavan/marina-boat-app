# Checklist de Pendências - Marina Boat (06/03/2026)

## 🔧 Infraestrutura & DevOps
- [x] Configurar Registro tipo A no Registro.br (`marinaboat.boatpass.com.br` -> `212.85.17.131`)
- [/] Atualizar o domínio nas configurações da aplicação no Coolify
- [ ] Verificar propagação do DNS e emissão do certificado SSL
- [ ] Sincronizar pasta oficial com `sync_to_official.ps1`

## 🍱 Funcionalidades v1.0 (MVP)
- [ ] Ativar Alertas de Documentos (Frontend avisando sobre validade)
- [/] Integrar Meteorologia (Ajustando API Key e UI do Dashboard - v1.0.3)
- [x] Refinamento de Segurança e UX (v1.0.5)
    - [x] Remover "Acesso Rápido" da tela de login
    - [x] Adicionar toggle de senha (olhinho) em todos os campos de senha
    - [x] Implementar fluxo de "Esqueci minha senha"
    - [x] Atualizar versão para v1.0.5
- [x] Correção de Login e UX (v1.0.6)
    - [x] Implementar Checkbox "Confirmo que sou humano" (Captcha)
    - [x] Criar Modal de Recuperação de Senha estilizado (substituindo prompt)
    - [x] Melhorar legibilidade das cores do Toast (Erro)
    - [x] Atualizar Site URL e Redirecionamento para Produção
    - [x] Atualizar versão para v1.0.6
- [ ] Implementar exportação de Relatórios Financeiros (PDF/CSV)

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
