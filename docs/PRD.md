# PRD: Marina Boat

## 🎯 Objetivo Principal
Transformar o Marina Boat em um Progressive Web App (PWA) instalável, permitindo que os usuários o utilizem como um aplicativo nativo "standalone", sem as barras de navegação do browser, com ícone próprio e experiência premium.

## 🏗️ Requisitos Não Funcionais
* **Acessibilidade:** Deve ser instalável em dispositivos Android e iOS via Chrome/Safari.
* **UX:** Experiência de "app nativo" (standalone).
* **Segurança:** Requer HTTPS (garantido pelo deploy).
* **Controle de Versão:** **OBRIGATÓRIO** incrementar a versão da aplicação em cada entrega para facilitar a validação do deploy e evitar problemas de cache.

## 📋 Escopo Funcional (O que o sistema FAZ)
1. **Manifesto Web:** Implementação do `manifest.json` com configurações de nome, ícones e modo de exibição.
2. **Ícones PWA:** Criação e disponibilização de ícones em 192x192 e 512x512.
3. **Integração HTML:** Vinculação do manifesto e meta tags de app no `index.html`.
4. **Segurança de Autenticação:** Remoção de acessos de demonstração e implementação de fluxos reais de login e recuperação de senha.
5. **UX de Login:** Implementação de visibilidade de senha e feedback visual claro.

## 🛠️ Diretrizes de Entrega e Deploy
Em cada finalização de tarefa, o Agente deve:
1. **Versionar:** Incrementar o campo `version` no `package.json` e a constante `APP_VERSION` no `App.tsx`.
2. **Commit & Push:** Realizar o Git Commit (com descrição clara) e Git Push para o repositório.
3. **Citação de Deploy:** Informar explicitamente ao usuário se é necessário realizar o deploy (ex: via Coolify/VPS) e qual a **Nova Versão** que ele deve visualizar após a atualização.

## 🔄 Fluxo do Usuário (User Journey)
1. O usuário acessa o site via dispositivo móvel.
2. O navegador detecta o PWA e oferece a opção "Instalar App".
3. O usuário instala o app.
4. O app aparece na home screen com o ícone do Marina Boat.
5. Ao abrir, o app carrega em tela cheia (standalone).
