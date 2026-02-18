# Diretiva: Processar Dados de Exemplo

## Objetivo
Demonstrar como criar uma diretiva simples que chama um script de execução.

## Entradas
- Nenhuma (ou arquivo de exemplo).

## Ferramentas (Scripts)
- `execution/exemplo_script.py`

## Saídas
- Mensagem de sucesso no console.
- Arquivo de log em `.tmp/exemplo.log`.

## Instruções
1. Verifique se o script `execution/exemplo_script.py` existe.
2. Execute o script.
3. Verifique se a execução foi bem-sucedida (código de saída 0).
4. Verifique se o arquivo de log foi criado em `.tmp/`.

## Casos de Borda
- Se o script falhar, verifique as permissões de execução.
