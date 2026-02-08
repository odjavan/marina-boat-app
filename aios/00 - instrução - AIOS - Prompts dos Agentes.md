# Manual de Operação AIOS (Antigravity Operating System)

Este guia define **COMO** você, o "Humano no Comando", deve pilotar os 8 Agentes Especializados para construir, corrigir e manter softwares.

---

## 🚀 Conceito Central: O "Loop de Trabalho"

O sistema não é mágico; ele é procedimental. Você é o **Gatilho**, os Agentes são as **Engrenagens**, e os arquivos (`task.md`, `AIOS_LOG.md`) são a **Correia**.

### O Ciclo Básico
1.  **Você dá a Ordem** (via Chat com o Coordenador).
2.  **Agentes Leem/Escrevem Arquivos** (o estado do projeto muda).
3.  **Você Valida** (Testa o App ou lê o Log).
4.  **Você Reinicia** (Próximo passo).

---

## 🛠️ Modos de Operação (O Que Pedir?)

Existem 3 formas principais de usar o AIOS. Escolha a sua:

### 1. Modo ADOÇÃO (Onboarding)
**Quando usar**: Agora. Quando você tem um código existente (`marina-boat-app`) e quer que os agentes entendam o que há nele.
**Comando**:
> "Coordenador, inicie o Protocolo de Adoção. Mapeie o app atual."
**O que acontece**:
*   Aria mapeia pastas e tecnologias.
*   Pax limpa o `task.md`.
*   Quinn roda testes para ver o que funciona.

### 2. Modo FEATURE (Criação)
**Quando usar**: "Quero uma nova tela de Login" ou "Crie um módulo de Financeiro".
**Comando**:
> "Coordenador, nova feature: [Descrição]. Inicie com Atlas e Morgan."
**O que acontece**:
*   Atlas pesquisa refs.
*   Morgan cria o Plano.
*   Aria define Arquitetura.
*   Dex implementa.

### 3. Modo FIX (Correção Rápida)
**Quando usar**: "O botão salvar não funciona" ou "Erro 500 na API".
**Comando**:
> "Coordenador, BUG CRÍTICO: [Erro]. Pule o planejamento, vá direto para Quinn (Diagnóstico) e Dex (Fix)."
**O que acontece**:
*   Quinn cria um teste que falha (reprodução).
*   Dex corrige o código até o teste passar.

---

## 📊 Como Acompanhar (A "Prova")

O sistema é auditável. Não confie na palavra do agente; confie nos Logs.

1.  **O Log Mestre**: `aios/AIOS_LOG.md`
    *   Sempre que um agente termina, ele escreve aqui. Se não estiver aqui, não aconteceu.
    *   *Exemplo*: `[DEX] Código implementado em App.tsx`.

2.  **O Plano**: `implementation_plan.md`
    *   Antes de qualquer código ser escrito (no Modo Feature), este arquivo DEVE conter o plano aprovado. Leia-o.

3.  **O Backlog**: `task.md`
    *   Este é o mapa de progresso. Se a tarefa não está `[x]`, ela não existe para o sistema.

---

## 💡 Dicas de Eficiência

*   **Seja Específico**: Em vez de "Melhore o layout", diga "Use Tailwind para deixar o header azul escuro e fixo".
*   **Intervenha nos Arquivos**: Se Morgan planejou algo errado, **edite o `implementation_plan.md` você mesmo** antes de chamar o próximo agente. Os agentes leem o arquivo, não sua mente.
*   **Feedback de Erro**: Se Quinn disser que passou, mas você testou e falhou, diga:
    > "Coordenador, Quinn falsou positivo. O erro persiste quando clico X. Reative Dex."

---

## ⚡ Início Rápido (Seu Próximo Passo)

Copie e cole isto no chat para começar a valer:

> "Coordenador AIOS, assuma. Vamos iniciar pelo **Modo Adoção**. Quero que Aria e Pax mapeiem o estado atual do `marina-boat-app` para sabermos onde estamos."