export type UserType = 'cliente' | 'funcionario';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_type: UserType;
  avatar_initial: string;
  created_at: string;
  cpf?: string;
}

export type VesselType = 'Lancha' | 'Veleiro' | 'Iate' | 'Jet Ski' | 'Outros';

export interface Vessel {
  id: string;
  created_by: string; // User ID/Email
  name: string;
  type: VesselType;
  brand: string;
  model: string;
  year: number;
  length: string;
  registration_number: string;
  photos: string[];
  documents: string[];
}

export type ServiceCategory = 'Limpeza' | 'Abastecimento' | 'Manutenção Preventiva' | 'Manutenção Corretiva';
export type ServiceUrgency = 'Normal' | 'Urgente' | 'Emergencial';
export type ServiceStatus = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';

export interface ServiceRequest {
  id: string;
  created_by: string; // User ID/Email
  vessel_id: string;
  category: ServiceCategory;
  description: string;
  preferred_date: string;
  urgency: ServiceUrgency;
  status: ServiceStatus;
  created_at: string;
}

export type ViewState = 'dashboard' | 'vessels' | 'services' | 'clients' | 'profile' | 'settings' | 'help';
