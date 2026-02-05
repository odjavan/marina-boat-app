$source = "G:\Projeto\APP\Testador de APP\marina-boat-app"
$dest = "G:\Projeto\MarinaBoat"

Write-Host "Iniciando sincronização de $source para $dest..."

# Copia pastas de código
Write-Host "Copiando componentes..."
robocopy "$source\components" "$dest\components" /E /IS /IT /XO

Write-Host "Copiando lib..."
robocopy "$source\lib" "$dest\lib" /E /IS /IT /XO

Write-Host "Copiando supabase..."
robocopy "$source\supabase" "$dest\supabase" /E /IS /IT /XO

# Copia arquivos da raiz (App, config, etc)
Write-Host "Copiando arquivos da raiz..."
robocopy "$source" "$dest" App.tsx types.ts constants.ts package.json package-lock.json tsconfig.json vite.config.ts index.html postcss.config.js tailwind.config.js .gitignore README.md /IS /IT /XO

Write-Host "--------------------------------------------------"
Write-Host "Sincronização Concluída!"
Write-Host "Arquivos copiados para $dest"
Write-Host "--------------------------------------------------"
