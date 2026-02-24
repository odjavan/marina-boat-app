export type UserType = 'admin' | 'marina' | 'cliente';

export interface User {
  id: string;
  name: string; // full_name in db
  email: string;
  phone: string;
  user_type: UserType; // standardized: admin, marina, cliente
  avatar_initial: string;
  created_at: string;
  cpf?: string;
}

export type VesselType = 'Lancha' | 'Veleiro' | 'Iate' | 'Jet Ski' | 'Outros';

export interface Vessel {
  id: string;
  owner_id: string; // Changed from created_by to match DB column
  marina_id?: string; // Marina onde a embarcação está atracada
  name: string;
  type: VesselType;
  brand: string;
  model: string;
  year: number;
  length: string;
  capacity?: number; // Added to match DB and form
  price_per_hour?: number; // Added to match DB and form
  registration_number: string;
  photos: string[];
  documents: string[]; // URLs or JSON
  is_archived: boolean;
  created_at?: string;
}

export type ServiceCategoryName = string;


export interface ServiceCategory {
  id: string;
  name: ServiceCategoryName;
  description: string;
  icon: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  estimated_time: string;
  icon: string;
  price?: number; // New field for cost/price
  is_active: boolean;
}

export type ServiceUrgency = 'Normal' | 'Urgente' | 'Emergencial';
export type ServiceStatus = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado' | 'Em Análise' | 'Agendado' | 'Aguardando Orçamento' | 'Orçamento Recusado';
export type QuotationStatus = 'Aguardando' | 'Aprovado' | 'Recusado';

export interface ServiceRequest {
  id: string;
  user_id: string; // Requester (dono da embarcação)
  boat_id: string;
  category: string; // Legacy/Simplified for now
  service_id?: string; // Optional link to specific service
  assigned_to?: string; // ID of the employee assigned to the service
  description: string;
  preferred_date: string;
  urgency: ServiceUrgency;
  status: ServiceStatus;
  photos: string[];
  admin_notes?: string;
  total_cost?: number;
  status_payment?: 'Pendente' | 'Pago' | 'N/A';
  created_at: string;
}

export interface Marina {
  id: string;
  owner_id: string; // dono_marina user id
  name: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Quotation {
  id: string;
  service_request_id: string;
  marina_id: string;
  amount: number;
  description?: string;
  estimated_days?: number;
  status: QuotationStatus;
  approved_at?: string;
  created_at?: string;
}

export interface BoatDocument {
  id: string;
  boat_id: string;
  name: string;
  file_url: string;
  expiry_date?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  data?: any;
  created_at: string;
}

export type ViewState = 'dashboard' | 'vessels' | 'services' | 'history' | 'clients' | 'profile' | 'settings' | 'help' | 'marinas' | 'agents' | 'quotations';
