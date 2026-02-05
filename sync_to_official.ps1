$source = "G:\Projeto\APP\Testador de APP\marina-boat-app"
$dest = "G:\Projeto\MarinaBoat"

Write-Host "Iniciando sincronização de $source para $dest..."

# Copia a pasta SRC (código fonte)
Write-Host "Copiando pasta src..."
robocopy "$source\src" "$dest\src" /E /IS /IT /XO

# Copia a pasta PUBLIC (assets)
Write-Host "Copiando pasta public..."
robocopy "$source\public" "$dest\public" /E /IS /IT /XO

# Copia arquivos de configuração da raiz (package.json, tsconfig, vite.config, etc)
Write-Host "Copiando arquivos de configuração..."
robocopy "$source" "$dest" package.json package-lock.json tsconfig.json vite.config.ts index.html postcss.config.js tailwind.config.js .gitignore README.md /IS /IT /XO

Write-Host "--------------------------------------------------"
Write-Host "Sincronização Concluída!"
Write-Host "Agora você pode ir até G:\Projeto\MarinaBoat e fazer o commit/push das alterações."
Write-Host "--------------------------------------------------"
