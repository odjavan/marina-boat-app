# Guia de Deploy - Marina Boat App no VPS

## 📋 Pré-requisitos

- VPS com Ubuntu 20.04+ ou Debian 11+
- Acesso root ou sudo
- Domínio configurado (opcional, mas recomendado)
- Credenciais do Supabase

---

## 1️⃣ Preparação do Servidor VPS

### Atualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### Instalar Node.js (v20 LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verificar instalação
npm --version
```

### Instalar Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Instalar Git

```bash
sudo apt install -y git
```

### Instalar PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

---

## 2️⃣ Clonar Repositório

```bash
cd /var/www
sudo git clone https://github.com/SEU_USUARIO/marina-boat-app.git
sudo chown -R $USER:$USER marina-boat-app
cd marina-boat-app
```

---

## 3️⃣ Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
nano .env
```

Adicione as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Optional: Gemini API (se usar)
GEMINI_API_KEY=sua-chave-gemini-aqui

# Build Configuration
NODE_ENV=production
```

> **IMPORTANTE**: Substitua os valores pelas suas credenciais reais do Supabase!

---

## 4️⃣ Instalar Dependências e Build

```bash
npm install
npm run build
```

Isso criará a pasta `dist/` com os arquivos otimizados para produção.

---

## 5️⃣ Configurar Nginx

### Criar arquivo de configuração

```bash
sudo nano /etc/nginx/sites-available/marina-boat
```

### Configuração Nginx (HTTP - sem SSL)

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    root /var/www/marina-boat-app/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Ativar site

```bash
sudo ln -s /etc/nginx/sites-available/marina-boat /etc/nginx/sites-enabled/
sudo nginx -t  # Testar configuração
sudo systemctl reload nginx
```

---

## 6️⃣ Configurar SSL com Certbot (HTTPS - Recomendado)

### Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obter certificado SSL

```bash
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

Siga as instruções e escolha a opção de redirecionar HTTP para HTTPS.

### Renovação automática

```bash
sudo certbot renew --dry-run  # Testar renovação
```

O Certbot configura automaticamente a renovação via cron.

---

## 7️⃣ Aplicar Migrações do Supabase

Acesse o Supabase SQL Editor e execute as migrações pendentes:

### Migração: Adicionar coluna price

```sql
-- Arquivo: supabase/migrations/015_add_price_to_services.sql
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0;
```

### Migração: Desabilitar RLS (temporário)

```sql
-- Arquivo: supabase/migrations/016_add_admin_services_rls.sql
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories DISABLE ROW LEVEL SECURITY;
```

### Migração: User Settings

```sql
-- Arquivo: supabase/migrations/017_create_user_settings.sql
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    sms_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_settings UNIQUE (user_id)
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
    ON public.user_settings FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
    ON public.user_settings FOR UPDATE
    USING (user_id = auth.uid());

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
```

---

## 8️⃣ Script de Deploy Automatizado

Crie um script para facilitar deploys futuros:

```bash
nano deploy.sh
```

```bash
#!/bin/bash
set -e

echo "🚀 Iniciando deploy..."

# Pull latest changes
echo "📥 Baixando atualizações..."
git pull origin main

# Install dependencies
echo "📦 Instalando dependências..."
npm install

# Build
echo "🔨 Compilando aplicação..."
npm run build

# Reload Nginx
echo "🔄 Recarregando Nginx..."
sudo systemctl reload nginx

echo "✅ Deploy concluído com sucesso!"
```

Tornar executável:

```bash
chmod +x deploy.sh
```

---

## 9️⃣ Verificação Final

### Testar aplicação

1. Acesse `http://seu-dominio.com` (ou `https://` se configurou SSL)
2. Faça login como admin
3. Teste criar/editar serviços
4. Verifique configurações de notificação

### Verificar logs do Nginx

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔄 Atualizações Futuras

Para fazer deploy de novas versões:

```bash
cd /var/www/marina-boat-app
./deploy.sh
```

---

## 🔒 Segurança Adicional (Recomendado)

### Configurar Firewall

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

### Configurar fail2ban (proteção contra ataques)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📝 Checklist de Deploy

- [ ] VPS configurado e atualizado
- [ ] Node.js 20+ instalado
- [ ] Nginx instalado e rodando
- [ ] Repositório clonado
- [ ] Arquivo `.env` criado com credenciais corretas
- [ ] Dependências instaladas (`npm install`)
- [ ] Build executado (`npm run build`)
- [ ] Nginx configurado e testado
- [ ] SSL configurado (Certbot)
- [ ] Migrações do Supabase aplicadas
- [ ] Aplicação acessível via domínio
- [ ] Testes funcionais realizados

---

## 🆘 Troubleshooting

### Erro 502 Bad Gateway
- Verifique se o build foi executado: `ls -la dist/`
- Verifique configuração do Nginx: `sudo nginx -t`

### Página em branco
- Verifique console do navegador (F12)
- Confirme variáveis de ambiente no `.env`
- Verifique logs: `sudo tail -f /var/log/nginx/error.log`

### Erro de conexão com Supabase
- Confirme `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- Verifique se as variáveis começam com `VITE_` (obrigatório no Vite)

---

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs do Nginx: `/var/log/nginx/error.log`
2. Console do navegador (F12)
3. Configuração do Supabase
