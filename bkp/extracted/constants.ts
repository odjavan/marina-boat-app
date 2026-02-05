import { User, Vessel, ServiceRequest } from './types';

export const CURRENT_USER_CLIENT: User = {
  id: 'u1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '(11) 99876-5432',
  user_type: 'cliente',
  avatar_initial: 'J',
  created_at: '2023-01-15'
};

export const CURRENT_USER_EMPLOYEE: User = {
  id: 'e1',
  name: 'Maria Marina',
  email: 'maria.staff@marinaboat.com',
  phone: '(21) 98888-7777',
  user_type: 'funcionario',
  avatar_initial: 'M',
  created_at: '2022-05-20'
};

export const MOCK_VESSELS: Vessel[] = [
  {
    id: 'v1',
    created_by: 'joao.silva@email.com',
    name: 'Lancha Azul',
    type: 'Lancha',
    brand: 'Phantom',
    model: '303',
    year: 2022,
    length: '30 pés'
  },
  {
    id: 'v2',
    created_by: 'joao.silva@email.com',
    name: 'Veleiro Vento',
    type: 'Veleiro',
    brand: 'Bavaria',
    model: '46',
    year: 2020,
    length: '46 pés'
  },
  {
    id: 'v3',
    created_by: 'joao.silva@email.com',
    name: 'Iate Luxo',
    type: 'Iate',
    brand: 'Ferretti',
    model: '720',
    year: 2023,
    length: '72 pés'
  }
];

export const MOCK_SERVICES: ServiceRequest[] = [
  {
    id: 's1',
    created_by: 'joao.silva@email.com',
    vessel_id: 'v1',
    category: 'Limpeza',
    description: 'Limpeza completa do casco e convés.',
    preferred_date: '2023-10-25',
    urgency: 'Normal',
    status: 'Pendente',
    created_at: '2023-10-20'
  },
  {
    id: 's2',
    created_by: 'joao.silva@email.com',
    vessel_id: 'v2',
    category: 'Manutenção Preventiva',
    description: 'Revisão do motor e troca de óleo.',
    preferred_date: '2023-10-28',
    urgency: 'Urgente',
    status: 'Em Andamento',
    created_at: '2023-10-21'
  },
  {
    id: 's3',
    created_by: 'joao.silva@email.com',
    vessel_id: 'v3',
    category: 'Abastecimento',
    description: 'Abastecimento completo de Diesel.',
    preferred_date: '2023-10-15',
    urgency: 'Normal',
    status: 'Concluído',
    created_at: '2023-10-10'
  }
];
