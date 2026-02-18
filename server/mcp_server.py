import sys
try:
    from mcp.server.fastmcp import FastMCP
except ImportError:
    import sys
    print("ERRO CRÍTICO: Não foi possível importar 'mcp.server.fastmcp'.", file=sys.stderr)
    print("Verifique se o pacote 'mcp' está instalado corretamente com 'pip install mcp[cli]'.", file=sys.stderr)
    print(f"Python executando: {sys.executable}", file=sys.stderr)
    print(f"Caminho do path: {sys.path}", file=sys.stderr)
    sys.exit(1)

import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Carrega variáveis de ambiente
load_dotenv()

# Configuração do Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")

if not url or not key:
    raise ValueError("Variáveis SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias no arquivo .env.")

try:
    supabase: Client = create_client(url, key)
except Exception as e:
    print(f"Erro ao conectar no Supabase: {e}")
    sys.exit(1)

# Inicializa o servidor MCP
mcp = FastMCP("Marina Boat")

@mcp.tool()
def list_boats() -> str:
    """Lista todas as embarcações cadastradas."""
    try:
        response = supabase.table("boats").select("*").execute()
        return str(response.data)
    except Exception as e:
        return f"Erro ao listar barcos: {str(e)}"

@mcp.tool()
def create_service_request(user_id: str, description: str, boat_id: str = None) -> str:
    """
    Cria uma nova solicitação de serviço.
    
    Args:
        user_id: UUID do usuário que está solicitando.
        description: Descrição detalhada do serviço necessário.
        boat_id: UUID da embarcação (opcional).
    """
    try:
        data = {
            "user_id": user_id,
            "description": description,
            "status": "Pendente"
        }
        if boat_id:
            data["boat_id"] = boat_id
            
        response = supabase.table("service_requests").insert(data).execute()
        return f"Solicitação criada com sucesso! ID: {response.data[0]['id']}"
    except Exception as e:
        return f"Erro ao criar solicitação: {str(e)}"

if __name__ == "__main__":
    print("Iniciando servidor Marina Boat MCP...", file=sys.stderr)
    try:
        mcp.run()
    except Exception as e:
        print(f"Erro na execução do servidor: {e}", file=sys.stderr)
