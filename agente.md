# Instruções para o Agente (Projetos com Gemini + Metodologia GSD/Ralph)

Este repositório utiliza a metodologia do **GSD (Get Shit Done)** combinada com o **comportamento autônomo do Ralph**, adaptados para interações via Gemini. 
Como o Gemini atuará dentro da sua IDE (ou via chat), ele desempenhará o papel de Engenheiro de Software/Arquiteto seguindo regras estritas.

## 🎯 Princípios do GSD (Get Shit Done)
O GSD visa zero ambiguidade antes de escrever código. O Agente (Gemini) **DEVE**:
1. **Fase de Descoberta (Discovery):** Nunca inicie um código sem analisar o PRD (Product Requirement Document). Se o PRD não existir ou estiver incompleto, o Agente deve **primeiro** realizar perguntas e documentar os requisitos.
2. **Arquitetura e Planejamento:** Antes de criar arquivos, o agente deve gerar um plano técnico de implementação (ex: `task.md` e `implementation_plan.md`) e validar com o usuário.
3. **Execução Focada:** O desenvolvimento deve ser modular. Um arquivo/funcionalidade por vez, seguindo a arquitetura proposta.

## 🔄 O Loop "Ralph"
A essência do "Ralph" é a persistência e a iteração contínua até que uma funcionalidade atenda 100% ao descritivo.
Como o Gemini atual não é um script auto-executável em loop no seu terminal, nós emularemos o "Comportamento Ralph" da seguinte forma:

1. **Leitura Contínua:** No início de qualquer sessão de trabalho, o Agente (eu) vai consultar o `task.md` e o `PRD.md` para recuperar o contexto.
2. **Ciclo de Entrega (TDD Guiado por Documento):**
   * Ler a próxima tarefa no `task.md`.
   * Implementar o código correspondente.
   * **Verificar:** O código atende exatamente ao que está no PRD?
   * Se sim, marcar a tarefa como concluída no `task.md`. Se não, corrigir imediatamente.
3. **Questionamento Incessante ("E agora, terminamos?"):** O agente deve sempre confirmar com você: *"Implementei a etapa X e testei Y. Isso conclui o item do PRD? Posso avançar para o próximo?"*.

---

## 📂 Arquitetura de Pastas Padrão
Soberania do projeto: todo projeto baseado neste modelo deve conter a seguinte estrutura na raiz:

```text
/
├── /docs                 
│   ├── PRD.md            # Documento Mestre de Requisitos (O que estamos construindo)
│   ├── arquitetura.md    # Como as coisas se conectam (diagramas, decisões técnicas)
│   └── gotchas.md        # "Pegadinhas", regras específicas do projeto, e problemas conhecidos
├── /src                  # Código principal da aplicação
├── task.md               # Check-list do Ralph (Passo-a-passo)
└── agente.md             # Este arquivo
```

## 🛠️ Regras de Ouro para o Gemini

1. **Nunca suponha, consulte:** Se houver dúvida na lógica de negócio, pare a execução e pergunte ao usuário ou leia o `/docs/PRD.md`.
2. **Updates Constantes no `.md`:** Se, durante a codificação, descobrirmos uma limitação técnica que altera a regra de negócio, o `PRD.md` ou o `gotchas.md` **tem obrigatoriamente** que ser atualizado pelo agente para refletir a nova realidade.
3. **Não mude bibliotecas sem aval:** Respeite o `package.json`. Se o PRD não pede para instalar uma biblioteca nova, não a instale sem aprovação do usuário (Tech Lead).

---
> **Aviso ao Usuário:** Como o Gemini atua em formato conversacional na sua máquina, a iniciativa do loop contínuo parte de você invocá-lo ("inicie a próxima tarefa do Ralph") e ele assumirá o controle seguindo este documento à risca.
