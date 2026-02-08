# Marina Boat App - Deployment

## Quick Deploy Guide

This application is ready for deployment on a VPS. See [VPS Deployment Guide](./docs/vps_deployment_guide.md) for complete instructions.

### Quick Start

1. **Clone repository on VPS**
   ```bash
   git clone https://github.com/YOUR_USERNAME/marina-boat-app.git
   cd marina-boat-app
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env  # Add your Supabase credentials
   ```

3. **Install and build**
   ```bash
   npm install
   npm run build
   ```

4. **Configure Nginx** (see full guide for details)

5. **Future deploys**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Environment Variables Required

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Database Migrations

Execute the following migrations in Supabase SQL Editor:

1. `supabase/migrations/015_add_price_to_services.sql`
2. `supabase/migrations/016_add_admin_services_rls.sql`
3. `supabase/migrations/017_create_user_settings.sql`

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Nginx + VPS

### Support

For detailed deployment instructions, troubleshooting, and configuration options, see the [complete deployment guide](./docs/vps_deployment_guide.md).
