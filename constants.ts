// ... imports
import { User, Vessel, ServiceRequest } from './types';

// ... variables

// UUIDs estáticos para evitar churn e erros de "invalid syntax for type uuid"
export const CURRENT_USER_CLIENT: User = {
  id: '00000000-0000-0000-0000-000000000001', // UUID Válido
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '(11) 99876-5432',
  user_type: 'cliente',
  avatar_initial: 'J',
  created_at: '2023-01-15'
};

export const CURRENT_USER_EMPLOYEE: User = {
  id: '00000000-0000-0000-0000-000000000002', // UUID Válido
  name: 'Maria Marina',
  email: 'maria.staff@marinaboat.com',
  phone: '(21) 98888-7777',
  user_type: 'funcionario',
  avatar_initial: 'M',
  created_at: '2022-05-20'
};

export const MOCK_CLIENTS_LIST: User[] = [
  CURRENT_USER_CLIENT,
  {
    id: '00000000-0000-0000-0000-000000000003', // UUID Válido
    name: 'Ana Souza',
    email: 'ana.souza@email.com',
    phone: '(11) 98765-4321',
    user_type: 'cliente',
    avatar_initial: 'A',
    created_at: '2023-02-10',
    cpf: '123.456.789-00'
  }
];

export const MOCK_VESSELS: Vessel[] = [
  {
    id: '00000000-0000-0000-0000-000000000010', // UUID Válido
    owner_id: '00000000-0000-0000-0000-000000000001', // João
    name: 'Lancha Azul',
    type: 'Lancha',
    brand: 'Phantom',
    model: '303',
    year: 2022,
    length: '30 pés',
    registration_number: '442123984-2',
    photos: [],
    documents: [],
    is_archived: false
  },
  {
    id: '00000000-0000-0000-0000-000000000011', // UUID Válido
    owner_id: '00000000-0000-0000-0000-000000000001', // João
    name: 'Veleiro Vento',
    type: 'Veleiro',
    brand: 'Bavaria',
    model: '46',
    year: 2020,
    length: '46 pés',
    registration_number: '553214098-1',
    photos: [],
    documents: [],
    is_archived: false
  },
  {
    id: '00000000-0000-0000-0000-000000000012', // UUID Válido
    owner_id: '00000000-0000-0000-0000-000000000001', // João
    name: 'Iate Luxo',
    type: 'Iate',
    brand: 'Ferretti',
    model: '720',
    year: 2023,
    length: '72 pés',
    registration_number: '998877665-0',
    photos: [],
    documents: [],
    is_archived: false
  }
];

export const MOCK_SERVICES: ServiceRequest[] = [
  {
    id: '00000000-0000-0000-0000-000000000100', // UUID Válido
    user_id: '00000000-0000-0000-0000-000000000001', // João
    boat_id: '00000000-0000-0000-0000-000000000010', // Lancha Azul
    category: 'Limpeza',
    description: 'Limpeza completa do casco e convés.',
    preferred_date: '2023-10-25',
    urgency: 'Normal',
    status: 'Pendente',
    created_at: '2023-10-20',
    photos: []
  },
  {
    id: '00000000-0000-0000-0000-000000000101', // UUID Válido
    user_id: '00000000-0000-0000-0000-000000000001', // João
    boat_id: '00000000-0000-0000-0000-000000000011', // Veleiro Vento
    category: 'Manutenção Preventiva',
    description: 'Revisão do motor e troca de óleo.',
    preferred_date: '2023-10-28',
    urgency: 'Urgente',
    status: 'Em Andamento',
    created_at: '2023-10-21',
    photos: []
  },
  {
    id: '00000000-0000-0000-0000-000000000102', // UUID Válido
    user_id: '00000000-0000-0000-0000-000000000001', // João
    boat_id: '00000000-0000-0000-0000-000000000012', // Iate Luxo
    category: 'Abastecimento',
    description: 'Abastecimento completo de Diesel.',
    preferred_date: '2023-10-15',
    urgency: 'Normal',
    status: 'Concluído',
    created_at: '2023-10-10',
    photos: []
  }
];
