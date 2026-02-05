# CHANGELOG - Marina Boat App

## [2026-02-04] - Database & Frontend Refactor

### Editor
- **Agent**: Antigravity (Google Deepmind)
- **Action**: Full refactor of database schema and frontend logic to match "Marina Boat App" specifications.

### Database (Supabase)
- **Migration Created**: [`002_update_schema.sql`](file:///g:/Projeto/APP/Testador%20de%20APP/marina-boat-app/supabase/migrations/002_update_schema.sql)
- **Tables Created/Updated**:
    - `service_categories`: Added predefined categories (Limpeza, Abastecimento, etc.).
    - `services`: Added catalog table.
    - `service_requests`: Created table to replace `bookings`. Supports status, urgency, and description.
    - `boat_documents`: Created table for document uploads.
    - `notifications`: Created table for system alerts.
    - `boats`: Updated schema (Added `brand`, `model`, `year`, `registration_number`; Removed rental columns).
- **Security**: Added RLS policies for all new tables.

### Frontend Logic (`App.tsx` & `types.ts`)
- **Types Updated**:
    - `Vessel`: Added `owner_id`, `brand`, `model`, `year`, `documents`.
    - `ServiceRequest`: Remapped to use `boat_id` and `user_id`.
    - Added `BoatDocument`, `Notification`, `ServiceCategory` interfaces.
- **Components Updated**:
    - **AppProvider**:
        - `fetchData`: Updated to query new tables.
        - `addVessel`: Now sends `owner_id` correctly.
        - `addService`: Now sends `boat_id` and `user_id`; fixed status handling.
        - Added `updateService` and `deleteService` functions (previously missing).
    - **Vessels Component**:
        - Form updated to collect Brand, Model, Year, etc.
        - Owner selection for Admin mode fixed.
    - **Services Component**:
        - Filtering logic updated to check `user_id`.
        - Form updated to save to `boat_id` instead of `vessel_id`.
    - **UI**: Added `owner_id` display for Admins.

### Status
- **Local Code**: ✅ Updated and Ready.
- **Database**: ✅ Migration SQL created (Applicable via Supabase Dashboard).
- **Live Server**: ⚠️ Requires Deployment.

### How to Deploy
The files are currently only on your **Local Machine** (`G:\Projeto\APP\Testador de APP\marina-boat-app`).
To update the live server:
1. Run local build (verification).
2. Execute `sync_to_official.ps1` to copy files to your official repo/folder (`G:\Projeto\MarinaBoat`).

### [2026-02-05] - Release 3: Service Request Wizard
- **Service Request Wizard**: Implemented a multi-step wizard for creating service requests.
  - Steps: Service Selection, Details, Date/Urgency, Photos, Review.
  - Integrated `ServiceRequestWizard` into `App.tsx` service creation flow.
- **ServiceCatalog**: Added `ServiceCatalog` component for browsing services.
- **ServiceCard**: Implemented consistent service display in `Services` list.
- **Bug Fixes**:
  - Resolved structural errors in `App.tsx` (AppProvider nesting, missing braces).
  - Fixed TypeScript interface errors in `components/ui.tsx`.
  - Fixed reference errors ("ServiceCard used before declaration").

### [2026-02-05] - Release 4: Service Details & Timeline
- **Service Details**: Added a detailed view for service requests.
  - **Visual Timeline**: Stepper showing the progress of the service (Pendente -> Em Análise -> Agendado -> Em Andamento -> Concluído).
  - **Admin Actions**: Buttons to advance status directly from the details view.
  - **Navigation**: "Ver Detalhes" button added to Service Cards.

### [2026-02-05] - Release 5: UI Visual Redesign
- **High Density UI**: Refactored token system (reduced padding/radius) for professional look (`components/ui.tsx`).
- **DataTable**: Created reusable table component for dense data display (`components/DataTable.tsx`).
- **Admin Views**:
  - Switched `Services` list to `DataTable` for Admins.
  - Switched `Vessels` list to `DataTable` for Admins.
- **Layout**: Optimized Sidebar (Narrower, Dense Menu) and Main Content area padding.
