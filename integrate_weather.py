#!/usr/bin/env python3
"""
Script para integrar o WeatherWidget no App.tsx
Evita problemas de encoding ao fazer modificações programáticas
"""

import re

def integrate_weather_widget():
    file_path = r'g:\Projeto\APP\Testador de APP\marina-boat-app\App.tsx'
    
    # Ler o arquivo
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Adicionar import do WeatherWidget
    import_pattern = r"(import { ServiceHistory } from './components/ServiceHistory';)"
    import_replacement = r"\1\nimport { WeatherWidget } from './components/WeatherWidget';"
    
    if "import { WeatherWidget }" not in content:
        content = re.sub(import_pattern, import_replacement, content)
        print("✅ Import do WeatherWidget adicionado")
    else:
        print("ℹ️  Import do WeatherWidget já existe")
    
    # 2. Adicionar WeatherWidget no Dashboard
    dashboard_pattern = r"(      </div>\r?\n\r?\n      {/\* Lista de Atividades Recentes \*/})"
    dashboard_replacement = r"      </div>\r\n\r\n      {/* Weather Widget */}\r\n      <WeatherWidget />\r\n\r\n      {/* Lista de Atividades Recentes */}"
    
    if "<WeatherWidget />" not in content:
        content = re.sub(dashboard_pattern, dashboard_replacement, content)
        print("✅ WeatherWidget adicionado ao Dashboard")
    else:
        print("ℹ️  WeatherWidget já existe no Dashboard")
    
    # Salvar o arquivo
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Integração concluída com sucesso!")

if __name__ == "__main__":
    integrate_weather_widget()
