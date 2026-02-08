#!/usr/bin/env python3
"""
Script para integrar ClientCard e VesselCard no App.tsx
Substitui DataTable por card lists modernas
"""

import re

def integrate_card_components():
    file_path = r'g:\Projeto\APP\Testador de APP\marina-boat-app\App.tsx'
    
    # Ler o arquivo
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Adicionar imports dos card components
    import_pattern = r"(import { WeatherWidget } from './components/WeatherWidget';)"
    import_replacement = r"\1\nimport { ClientCard } from './components/ClientCard';\nimport { VesselCard } from './components/VesselCard';"
    
    if "import { ClientCard }" not in content:
        content = re.sub(import_pattern, import_replacement, content)
        print("✅ Imports dos Card components adicionados")
    else:
        print("ℹ️  Imports dos Card components já existem")
    
    # Salvar o arquivo
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Integração dos imports concluída!")
    print("\nPróximo passo: Substituir DataTable por card lists nas páginas Clients e Vessels")
    print("Isso será feito manualmente ou em outro script para evitar quebrar funcionalidades")

if __name__ == "__main__":
    integrate_card_components()
