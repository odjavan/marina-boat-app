import asyncio
import sys
import os
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Define o caminho para o servidor
SERVER_SCRIPT = os.path.join(os.path.dirname(__file__), "mcp_server.py")

async def run_client():
    # Parâmetros para iniciar o servidor como subprocesso
    server_params = StdioServerParameters(
        command=sys.executable,
        args=[SERVER_SCRIPT],
        # As variáveis de ambiente já devem estar carregadas pelo sistema ou definidas aqui
    )

    print(f"Conectando ao servidor MCP em: {SERVER_SCRIPT}...")
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 1. Inicializa
            await session.initialize()
            print("Conectado e inicializado!")

            # 2. Lista Ferramentas Disponíveis
            tools = await session.list_tools()
            print("\nFerramentas Disponíveis:")
            for tool in tools.tools:
                print(f"- {tool.name}: {tool.description}")

            # 3. Testa 'list_boats'
            print("\nExecutando 'list_boats'...")
            try:
                result = await session.call_tool("list_boats", arguments={})
                print(f"Resultado: {result.content}")
            except Exception as e:
                print(f"Erro ao chamar list_boats: {e}")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(run_client())
