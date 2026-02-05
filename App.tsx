import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Anchor, Wind, Droplets, User as UserIcon, LogOut, Settings,
  HelpCircle, Home, Ship, Briefcase, Plus, Search,
  CheckCircle2, Clock, AlertTriangle, Moon, Sun, Menu, LayoutDashboard,
  Lock, Mail, Eye, EyeOff, Save, Phone, Upload, X, FileText, Image as ImageIcon, Users, Edit, Trash2
} from 'lucide-react';
import { Card, Button, Badge, Input, Select, Label, Dialog, cn } from './components/ui';
import { DataTable, type Column } from './components/DataTable';
import { ServiceCatalog } from './components/ServiceCatalog';
import { User, Vessel, ServiceRequest, ViewState, ServiceStatus, Service } from './types';
import {
  CURRENT_USER_CLIENT, CURRENT_USER_EMPLOYEE
} from './constants';
import { supabase } from './lib/supabase';
import { ServiceRequestWizard } from './components/ServiceRequestWizard';
import { ServiceDetails } from './components/ServiceDetails';
import { ServiceHistory } from './components/ServiceHistory';

// --- Contexts ---

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (type: 'admin' | 'user') => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  vessels: Vessel[];
  services: ServiceRequest[];
  clients: User[];
  addClient: (user: Omit<User, 'id' | 'created_at' | 'avatar_initial' | 'user_type'>) => void;
  addVessel: (vessel: Omit<Vessel, 'id'>) => void;
  updateVessel: (id: string, data: Partial<Vessel>) => void;
  deleteVessel: (id: string) => void;
  catalog: Service[]; // Added logic

  addService: (service: Omit<ServiceRequest, 'id' | 'created_by' | 'status' | 'created_at'>) => void;
  updateService: (id: string, data: Partial<ServiceRequest>) => void;
  deleteService: (id: string) => void;
  updateServiceStatus: (id: string, status: ServiceStatus) => void;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  notifications: string[];
  addNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// --- Login Screen Component ---

const LoginScreen = () => {
  const { login } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Demonstração apenas
  const handleDemoLogin = (type: 'admin' | 'user') => {
    login(type);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@marina.com' && password === 'admin123') {
      login('admin');
    } else if (email === 'cliente@marina.com' && password === 'user123') {
      login('user');
    } else {
      alert('Credenciais inválidas! Use as credenciais de teste exibidas na tela.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-900 to-slate-900 opacity-10 dark:opacity-40"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="z-10 w-full max-w-md p-6">
        <Card className="p-8 shadow-2xl border-t-4 border-t-cyan-500">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl shadow-lg mb-4">
              <Anchor className="text-white h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Marina Boat
            </h1>
            <p className="text-slate-500 text-sm mt-2">Gestão Náutica Inteligente</p>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <Label>E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base">
              Entrar
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-center text-slate-500 mb-4 font-medium uppercase tracking-wider">
              Área de Testes
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('admin')}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
              >
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Administrador</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-cyan-600">
                  admin@marina.com<br />admin123
                </div>
              </button>
              <button
                onClick={() => handleDemoLogin('user')}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
              >
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Usuário/Cliente</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-blue-600">
                  cliente@marina.com<br />user123
                </div>
              </button>
            </div>
          </div>
        </Card>
        <p className="text-center text-slate-400 text-xs mt-6">
          © 2024 Marina Boat. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

// --- Components ---

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const { currentUser, currentView, setCurrentView, isDarkMode, toggleTheme, logout } = useAppContext();

  if (!currentUser) return null;

  const menuItems = currentUser.user_type === 'cliente' ? [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'vessels', label: 'Embarcações', icon: Ship },
    { id: 'services', label: 'Serviços', icon: Briefcase },
    { id: 'profile', label: 'Perfil', icon: UserIcon },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'help', label: 'Ajuda', icon: HelpCircle },
  ] : [
    { id: 'dashboard', label: 'Painel da Marina', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'services', label: 'Todas Solicitações', icon: Briefcase },
    { id: 'history', label: 'Histórico', icon: FileText },
    { id: 'vessels', label: 'Todas Embarcações', icon: Ship },
    { id: 'profile', label: 'Perfil', icon: UserIcon },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'help', label: 'Ajuda', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn("fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:translate-x-0 flex flex-col h-full",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg shadow-lg">
            <Anchor className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Marina Boat
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {currentUser.user_type === 'funcionario' ? '🔧 Painel Admin' : '⚓ Área do Cliente'}
            </p>
          </div>
        </div>

        {/* Weather Widget */}
        {/* Weather Widget */}
        <div className="mx-3 mt-4 p-3 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 border border-blue-100 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-3 tracking-wider">Status da Marina</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 shadow-sm transition-transform hover:scale-105">
              <div className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-1">
                <Sun size={16} />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">28°C</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 shadow-sm transition-transform hover:scale-105">
              <div className="p-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 mb-1">
                <Wind size={16} />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">12 nós</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 shadow-sm transition-transform hover:scale-105">
              <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-1">
                <Droplets size={16} />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">0.8m</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as ViewState);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 text-blue-600 dark:text-blue-400 shadow-sm translate-x-1"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <Icon size={20} className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-medium text-slate-500">Modo Escuro</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 border border-slate-100 dark:border-slate-700/50">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              {currentUser.avatar_initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {currentUser.name.split(' ')[0]}
              </p>
              <p className="text-xs text-slate-500 truncate capitalize">{currentUser.user_type}</p>
            </div>
            <button
              onClick={logout}
              title="Sair"
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Page: Dashboard ---

const Dashboard = () => {
  const { currentUser, vessels, services, currentView, setCurrentView } = useAppContext();

  if (!currentUser) return null;

  // Filter Logic
  const myVessels = currentUser.user_type === 'cliente'
    ? vessels.filter(v => v.created_by === currentUser.email)
    : vessels;

  const myServices = currentUser.user_type === 'cliente'
    ? services.filter(s => s.created_by === currentUser.email)
    : services;

  const pendingServices = myServices.filter(s => s.status === 'Pendente');
  const activeServices = myServices.filter(s => ['Pendente', 'Em Andamento'].includes(s.status));
  const completedServices = myServices.filter(s => s.status === 'Concluído');
  const inProgressServices = myServices.filter(s => s.status === 'Em Andamento');

  // Client Stats
  const clientStats = [
    { label: 'Embarcações', value: myVessels.length, icon: Ship, color: 'text-blue-600 bg-blue-100' },
    { label: 'Serviços Ativos', value: activeServices.length, icon: ActivityIcon, color: 'text-cyan-600 bg-cyan-100' },
    { label: 'Concluídos', value: completedServices.length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100' },
    { label: 'Total', value: myServices.length, icon: Briefcase, color: 'text-purple-600 bg-purple-100' },
  ];

  // Admin Stats
  const adminStats = [
    { label: 'Pendentes', value: pendingServices.length, icon: AlertTriangle, color: 'text-amber-600 bg-amber-100' },
    { label: 'Em Andamento', value: inProgressServices.length, icon: ActivityIcon, color: 'text-blue-600 bg-blue-100' },
    { label: 'Concluídos', value: completedServices.length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100' },
    { label: 'Embarcações', value: vessels.length, icon: Ship, color: 'text-cyan-600 bg-cyan-100' },
    { label: 'Clientes', value: 3, icon: UserIcon, color: 'text-slate-600 bg-slate-100' },
  ];

  const statsToShow = currentUser.user_type === 'cliente' ? clientStats : adminStats;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Olá, {currentUser.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400">Aqui está o resumo da sua marina hoje.</p>
        </div>
        {currentUser.user_type === 'cliente' && (
          <Button onClick={() => setCurrentView('services')}>
            <Plus size={18} /> Novo Serviço
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className={cn("grid gap-4", currentUser.user_type === 'cliente' ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5")}>
        {statsToShow.map((stat, idx) => (
          <Card key={idx} className="p-4 flex flex-col items-center justify-center text-center hover:-translate-y-1">
            <div className={cn("p-3 rounded-full mb-3", stat.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 '))} >
              <stat.icon className={cn("h-6 w-6", stat.color.split(' ')[0])} />
            </div>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</span>
            <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
          </Card>
        ))}
      </div>

      {/* Recent Activity List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {currentUser.user_type === 'cliente' ? 'Serviços Ativos' : 'Solicitações Pendentes'}
        </h3>

        {activeServices.length === 0 && currentUser.user_type === 'cliente' ? (
          <Card className="p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="text-slate-400" />
            </div>
            <p className="text-slate-500">Nenhum serviço ativo no momento.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(currentUser.user_type === 'cliente' ? activeServices : pendingServices).slice(0, 6).map(service => (
              <ServiceCard key={service.id} service={service} vessels={vessels} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Page: Clients (Admin) ---

const Clients = () => {
  const { clients, addClient } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: ''
  });

  const handleMasks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2').slice(0, 15);
    } else if (name === 'cpf') {
      newValue = value.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(formData);
    setFormData({ name: '', email: '', phone: '', cpf: '', password: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Clientes Cadastrados</h2>
          <p className="text-slate-500">Gerencie os usuários da marina.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Novo Cliente
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4">CPF</th>
                <th className="px-6 py-4 text-center">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                      {client.avatar_initial}
                    </div>
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{client.email}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{client.phone}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono">{client.cpf || '-'}</td>
                  <td className="px-6 py-4 text-slate-400 text-center">{new Date(client.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Cliente">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome Completo</Label>
            <Input
              name="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: João da Silva"
            />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="cliente@email.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <Input
                name="phone"
                required
                value={formData.phone}
                onChange={handleMasks}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Label>CPF</Label>
              <Input
                name="cpf"
                required
                value={formData.cpf}
                onChange={handleMasks}
                placeholder="000.000.000-00"
              />
            </div>
          </div>
          <div>
            <Label>Senha Provisória</Label>
            <Input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="******"
            />
            <p className="text-xs text-slate-400 mt-1">O cliente deverá alterar a senha no primeiro acesso.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Cadastrar Cliente</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

// --- Page: Vessels ---

const Vessels = () => {
  const { vessels, currentUser, addVessel, updateVessel, deleteVessel, clients } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [filterType, setFilterType] = useState('Todos');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Form States
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [docs, setDocs] = useState<File[]>([]);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);

  if (!currentUser) return null;

  // --- Filter Logic ---
  // --- Filter Logic ---
  const filteredVessels = vessels.filter(v => {
    // 1. Security / Role Filter
    if (currentUser.user_type === 'cliente') {
      // Strict ID check. If legacy data uses email in owner_id, this might need adjustment, 
      // but for proper security we enforce ID.
      if (v.owner_id !== currentUser.id) return false;
    }

    // 2. Search Filter (Search term is not in this component state, but props? 
    // Wait, typical pattern here is local state. 
    // Looking at line 559: const [filterBrand, setFilterBrand] = useState('');
    // There is no global search term passed in here. Let's stick to the local filters present (Brand, Type, Year).
    // The previous code verified local state exists.

    // 3. Dropdown Filters
    const matchType = filterType === 'Todos' || v.type === filterType;
    const matchBrand = filterBrand === '' || (v.brand + ' ' + v.model).toLowerCase().includes(filterBrand.toLowerCase());
    const matchYear = filterYear === '' || v.year.toString().includes(filterYear);

    return matchType && matchBrand && matchYear;
  });

  // We only use filteredVessels now (visibleVessels was an intermediate step we can merge)
  // Check usages of visibleVessels... It was used in "No results" message. 
  // We can just use filteredVessels.length there or a separate "hasAnyVessels" check if needed.
  // Actually, to keep "Adicione sua primeira embarcação" logic correct, we might need to know if they have ANY boats.
  const userHasBoats = vessels.some(v => currentUser.user_type === 'funcionario' || v.owner_id === currentUser.id);

  // --- Form Logic ---

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (photos.length + newFiles.length > 5) {
        alert("Máximo de 5 fotos permitido.");
        return;
      }
      setPhotos([...photos, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file as any));
      setPhotoPreviews([...photoPreviews, ...newPreviews]);
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocs([...docs, ...Array.from(e.target.files)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const removeDoc = (index: number) => {
    setDocs(docs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const ownerEmail = formData.get('owner_email') as string;

    const vesselData = {
      name: formData.get('name') as string,
      type: formData.get('type') as any,
      brand: formData.get('brand') as string,
      model: formData.get('model') as string,
      year: parseInt(formData.get('year') as string),
      length: formData.get('length') as string,
      registration_number: formData.get('registration_number') as string,
      photos: photoPreviews,
      documents: docs.map(d => d.name),
      owner_id: ownerEmail || (editingVessel ? editingVessel.owner_id : currentUser.id)
    };

    if (editingVessel) {
      updateVessel(editingVessel.id, vesselData);
    } else {
      addVessel(vesselData);
    }

    // Reset
    setPhotos([]);
    setPhotoPreviews([]);
    setDocs([]);
    setEditingVessel(null);
    setIsModalOpen(false);
  };

  const vesselColumns: Column<Vessel>[] = [
    {
      header: 'Nome',
      cell: (v) => (
        <div className="flex items-center gap-3">
          {v.photos?.[0] ? <img src={v.photos[0]} className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center"><Ship size={16} /></div>}
          <div>
            <div className="font-medium text-slate-900 dark:text-white">{v.name}</div>
            <div className="text-xs text-slate-500">{v.brand} {v.model}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Tipo',
      width: '100px',
      cell: (v) => <Badge color="blue">{v.type}</Badge>
    },
    {
      header: 'Ano',
      width: '80px',
      accessorKey: 'year'
    },
    {
      header: 'Comprimento',
      width: '100px',
      accessorKey: 'length'
    }
  ];

  if (currentUser.user_type === 'funcionario') {
    vesselColumns.push({
      header: 'Proprietário',
      cell: (v) => {
        const owner = clients.find(c => c.id === v.owner_id);
        return <span className="text-xs">{owner?.name || v.owner_id}</span>;
      }
    });
    vesselColumns.push({
      header: 'Docs',
      width: '60px',
      cell: (v) => v.documents.length > 0 ? <Badge color="slate">{v.documents.length}</Badge> : null
    });
  }

  const vesselActions = (v: Vessel) => (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="sm" onClick={() => { setEditingVessel(v); setIsModalOpen(true); }} title="Editar" className="h-8 w-8 p-0">
        <Edit size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => { if (confirm('Excluir?')) deleteVessel(v.id); }} title="Excluir" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500">
        <Trash2 size={14} />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentUser.user_type === 'cliente' ? 'Minhas Embarcações' : 'Todas as Embarcações'}
          </h2>
          <p className="text-slate-500">Gerencie a frota e documentos.</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nova Embarcação
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <Label>Tipo</Label>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="Lancha">Lancha</option>
              <option value="Veleiro">Veleiro</option>
              <option value="Jet Ski">Jet Ski</option>
              <option value="Iate">Iate</option>
              <option value="Outros">Outros</option>
            </Select>
          </div>
          <div>
            <Label>Marca</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar marca..."
                className="pl-9"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Ano</Label>
            <Input
              placeholder="Ex: 2022"
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => { setFilterType('Todos'); setFilterBrand(''); setFilterYear(''); }}
            disabled={filterType === 'Todos' && filterBrand === '' && filterYear === ''}
            className="w-full"
          >
            Limpar
          </Button>
        </div>
      </Card>

      {/* List */}
      {filteredVessels.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <Ship className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Nenhuma embarcação encontrada</h3>
          <p className="text-slate-500 mb-6">
            {!userHasBoats
              ? "Adicione sua primeira embarcação para começar."
              : "Tente ajustar os filtros para encontrar o que procura."}
          </p>
          {!userHasBoats && (
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>Cadastrar Agora</Button>
          )}
        </Card>
      ) : (
        currentUser.user_type === 'funcionario' ? (
          <DataTable
            data={filteredVessels}
            columns={vesselColumns}
            actions={vesselActions}
            onRowClick={(v) => { setEditingVessel(v); setIsModalOpen(true); }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVessels.map(vessel => (
              <Card key={vessel.id} className="relative group flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Cover Photo */}
                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative">
                  {vessel.photos && vessel.photos.length > 0 ? (
                    <img
                      src={vessel.photos[0]}
                      alt={vessel.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-slate-800 dark:to-slate-700">
                      <Ship className="h-16 w-16 text-blue-200 dark:text-slate-600 mb-2" />
                      <span className="text-xs text-slate-400">Sem foto</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">{vessel.type}</Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate">{vessel.name}</h3>
                    <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">{vessel.brand} {vessel.model}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 dark:text-slate-400 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-slate-400 font-bold">Ano</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{vessel.year}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-slate-400 font-bold">Comprimento</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{vessel.length}</span>
                    </div>
                    <div className="flex flex-col col-span-2 mt-2">
                      <span className="text-[10px] uppercase text-slate-400 font-bold">Matrícula</span>
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded w-fit">{vessel.registration_number || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Owner Badge (Admin Only) */}
                  {currentUser.user_type === 'funcionario' && (
                    <div className="text-xs text-slate-500 mt-3 flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded border border-slate-200 dark:border-slate-800/50">
                      <UserIcon size={12} className="text-slate-400" />
                      <span className="truncate flex-1">
                        <span className="font-bold">Proprietário:</span> {clients.find(c => c.id === vessel.owner_id || c.email === vessel.owner_id)?.name || vessel.owner_id}
                      </span>
                    </div>
                  )}

                  {/* Footer Actions (Visual Only) */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    {vessel.documents.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-full">
                        <FileText size={12} />
                        {vessel.documents.length} Docs
                      </div>
                    )}

                    {/* Edit/Delete Actions */}
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingVessel(vessel); setIsModalOpen(true); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Tem certeza que deseja excluir esta embarcação?')) deleteVessel(vessel.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* New/Edit Vessel Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingVessel(null); }} title={editingVessel ? "Editar Embarcação" : "Nova Embarcação"}>
        <form key={editingVessel ? editingVessel.id : 'new'} onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">

          {/* Admin: Select Owner */}
          {currentUser.user_type === 'funcionario' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900 mb-4">
              <Label>Proprietário da Embarcação <span className="text-red-500">*</span></Label>
              <Select name="owner_email" required defaultValue="">
                <option value="" disabled>Selecione um cliente</option>
                {clients.filter(c => c.user_type === 'cliente').map(client => (
                  <option key={client.id} value={client.email}>{client.name} ({client.email})</option>
                ))}
              </Select>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">A embarcação será vinculada a este cliente.</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 pb-2">Dados Principais</h4>

            <div>
              <Label>Nome da Embarcação <span className="text-red-500">*</span></Label>
              <Input name="name" required placeholder="Ex: Pérola Negra" defaultValue={editingVessel?.name} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo <span className="text-red-500">*</span></Label>
                <Select name="type" required defaultValue={editingVessel?.type || 'Lancha'}>
                  <option value="Lancha">Lancha</option>
                  <option value="Veleiro">Veleiro</option>
                  <option value="Jet Ski">Jet Ski</option>
                  <option value="Iate">Iate</option>
                  <option value="Outros">Outros</option>
                </Select>
              </div>
              <div>
                <Label>Ano Fabricação <span className="text-red-500">*</span></Label>
                <Input name="year" type="number" min="1900" max="2100" defaultValue={editingVessel?.year || 2024} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Marca / Modelo <span className="text-red-500">*</span></Label>
                <Input name="model" placeholder="Ex: Azimut 60" required defaultValue={editingVessel?.model} />
                {/* Combining Brand/Model in UI for simplicity based on prompt listing, but backend splits them. 
                    Let's just use two fields as per original structure but ensure Model covers requirement */}
                <input type="hidden" name="brand" value="Genérico" />
              </div>
              <div>
                <Label>Comprimento <span className="text-red-500">*</span></Label>
                <Input name="length" placeholder="Ex: 30 pés" required defaultValue={editingVessel?.length} />
              </div>
            </div>

            <div>
              <Label>Matrícula / Registro <span className="text-red-500">*</span></Label>
              <Input name="registration_number" placeholder="Ex: 442123984-2" required defaultValue={editingVessel?.registration_number} />
            </div>
          </div>

          {/* Photos Upload */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 pb-2">Fotos da Embarcação</h4>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-500">
                  <ImageIcon size={24} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Arraste fotos ou clique para enviar</p>
                <p className="text-xs text-slate-400">Até 5 fotos (JPG, PNG)</p>
              </div>
            </div>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {photoPreviews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200 dark:border-slate-700">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5">Capa</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents Upload */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 pb-2">Documentação</h4>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleDocChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-1 pointer-events-none">
                <Upload size={20} className="text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Arraste documentos PDF (TIE, Seguro)</p>
              </div>
            </div>

            {docs.length > 0 && (
              <ul className="space-y-2">
                {docs.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={14} className="text-red-500 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => removeDoc(idx)} className="text-slate-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setEditingVessel(null); }}>Cancelar</Button>
            <Button type="submit">{editingVessel ? 'Salvar Alterações' : 'Salvar Embarcação'}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

// --- Component: ServiceCard ---

const ServiceCard: React.FC<{
  service: ServiceRequest;
  vessels: Vessel[];
  onStatusChange?: (id: string, status: ServiceStatus) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}> = ({
  service,
  vessels,
  onStatusChange,
  onEdit,
  onDelete,
  onViewDetails
}) => {
    const vessel = vessels.find(v => v.id === service.boat_id);

    const statusColors: Record<ServiceStatus, "slate" | "blue" | "green" | "red" | "yellow" | "purple"> = {
      'Pendente': 'slate',
      'Em Andamento': 'blue',
      'Concluído': 'green',
      'Cancelado': 'red',
      'Em Análise': 'yellow',
      'Agendado': 'purple'
    };

    const urgencyBadge = service.urgency === 'Emergencial' ? 'red' : service.urgency === 'Urgente' ? 'yellow' : 'blue';

    return (
      <Card className="p-5 flex flex-col h-full border-t-4 border-t-cyan-500">
        <div className="flex justify-between items-start mb-3">
          <Badge color={statusColors[service.status]}>{service.status}</Badge>
          <span className="text-xs text-slate-400 font-mono">#{service.id.slice(0, 4)}</span>
        </div>

        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{service.category}</h4>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
          <Ship size={14} />
          <span>{vessel?.name || 'Embarcação desconhecida'}</span>
        </div>

        <div className="flex-1 mb-4 flex flex-col gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg line-clamp-3">
            {service.description}
          </p>
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={onViewDetails} className="self-start text-cyan-600 hover:text-cyan-700 p-0 h-auto font-normal text-xs">
              Ver detalhes &rarr;
            </Button>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{new Date(service.preferred_date).toLocaleDateString('pt-BR')}</span>
            </div>
            <Badge color={urgencyBadge} className="text-[10px]">{service.urgency}</Badge>
          </div>

          {/* Footer Actions: Status + Edit/Delete */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center gap-2">
              {onStatusChange ? (
                <Select
                  value={service.status}
                  onChange={(e) => onStatusChange(service.id, e.target.value as ServiceStatus)}
                  className="py-1 text-sm h-9 flex-1"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </Select>
              ) : (
                <span className="text-sm font-medium text-slate-500">Status: {service.status}</span>
              )}

              {/* Edit/Delete Buttons */}
              <div className="flex gap-1">
                {onEdit && (
                  <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 text-slate-400 hover:text-blue-500 rounded bg-slate-50 dark:bg-slate-800"><Edit size={14} /></button>
                )}
                {onDelete && (
                  <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-slate-400 hover:text-red-500 rounded bg-slate-50 dark:bg-slate-800"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };
// --- Page: Services ---

const Services = () => {
  const { services, vessels, currentUser, addService, updateService, deleteService, updateServiceStatus, clients, catalog } = useAppContext();
  const [activeTab, setActiveTab] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRequest | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);

  if (!currentUser) return null;

  if (selectedService) {
    const vessel = vessels.find(v => v.id === selectedService.boat_id);
    const requester = clients.find(c => c.id === selectedService.user_id) || { name: 'Usuário', email: '...', avatar_initial: 'U', user_type: 'cliente' } as any;

    return (
      <ServiceDetails
        service={selectedService}
        vessel={vessel}
        requester={requester}
        onBack={() => setSelectedService(null)}
        onStatusUpdate={(id, status) => {
          updateServiceStatus(id, status);
          // Update local selected service state to reflect change immediately if needed, 
          // though Context update should trigger re-render, we might need to sync passed prop.
          setSelectedService(prev => prev ? ({ ...prev, status }) : null);
        }}
        isAdmin={currentUser.user_type === 'funcionario'}
      />
    );
  }

  const statusColors: Record<ServiceStatus, any> = {
    'Pendente': 'slate', 'Em Andamento': 'blue', 'Concluído': 'green',
    'Cancelado': 'red', 'Em Análise': 'yellow', 'Agendado': 'purple'
  };

  const adminColumns: Column<ServiceRequest>[] = [
    {
      header: 'ID',
      width: '60px',
      cell: (s) => <span className="font-mono text-xs text-slate-500">#{s.id.slice(0, 4)}</span>
    },
    {
      header: 'Status',
      width: '120px',
      cell: (s) => <Badge color={statusColors[s.status]}>{s.status}</Badge>
    },
    {
      header: 'Serviço',
      cell: (s) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white">{s.category}</div>
          <div className="text-xs text-slate-500 line-clamp-1">{s.description} {s.urgency !== 'Normal' && <span className="text-red-500 font-bold">({s.urgency})</span>}</div>
        </div>
      )
    },
    {
      header: 'Embarcação',
      width: '150px',
      cell: (s) => {
        const v = vessels.find(v => v.id === s.boat_id);
        return <span className="text-slate-600 dark:text-slate-400 text-xs">{v?.name || '-'}</span>;
      }
    },
    {
      header: 'Data',
      width: '100px',
      cell: (s) => <span className="text-xs text-slate-500">{new Date(s.preferred_date).toLocaleDateString('pt-BR')}</span>
    }
  ];

  const adminActions = (s: ServiceRequest) => (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="sm" onClick={() => setSelectedService(s)} title="Ver Detalhes" className="h-8 w-8 p-0">
        <Eye size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => { setEditingService(s); setIsModalOpen(true); }} title="Editar" className="h-8 w-8 p-0">
        <Edit size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => { if (confirm('Excluir?')) deleteService(s.id); }} title="Excluir" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500">
        <Trash2 size={14} />
      </Button>
    </div>
  );

  const filteredServices = services.filter(s => {
    // 1. Role Filter
    if (currentUser.user_type === 'cliente') {
      if (s.user_id !== currentUser.id) return false;
    }

    // 2. Tab Filter
    if (activeTab === 'Todos') return true;
    return s.status === activeTab;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const serviceData = {
      boat_id: formData.get('vessel_id') as string,
      category: formData.get('category') as any,
      description: formData.get('description') as string,
      preferred_date: formData.get('preferred_date') as string,
      urgency: formData.get('urgency') as any,
    };

    if (editingService) {
      updateService(editingService.id, serviceData);
    } else {
      addService(serviceData);
    }

    setEditingService(null);
    setIsModalOpen(false);
  };

  const tabs = ['Todos', 'Pendente', 'Em Andamento', 'Concluído'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {currentUser.user_type === 'cliente' ? 'Menu de Serviços' : 'Gestão de Serviços'}
          </h2>
          <p className="text-slate-500 mt-1">
            {currentUser.user_type === 'cliente'
              ? 'Escolha um serviço do catálogo ou acompanhe suas solicitações.'
              : 'Gerencie o catálogo oficial e acompanhe as ordens de serviço.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setEditingService(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Solicitação Personalizada
          </Button>
        </div>
      </div>

      {/* CATALOG SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-1 bg-cyan-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Catálogo Disponível</h3>
        </div>

        <ServiceCatalog
          isAdmin={currentUser.user_type === 'funcionario'}
          onSelectService={(service) => {
            // Pre-fill the modal with catalog item details
            setEditingService({
              id: 'new', // Flag as new
              boat_id: '',
              user_id: currentUser.id,
              category: service.name, // Map Service Name to Category field
              description: service.description,
              preferred_date: new Date().toISOString().split('T')[0],
              urgency: 'Normal',
              status: 'Pendente',
              created_at: '',
              photos: []
            });
            setIsModalOpen(true);
          }}
        />
      </section>

      {/* REQUESTS LIST SECTION */}
      <section className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Acompanhamento</h3>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto pb-2 gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-full transition-colors whitespace-nowrap border",
                  activeTab === tab
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className={cn(currentUser.user_type === 'funcionario' ? "" : "grid gap-4 md:grid-cols-2 lg:grid-cols-3")}>
          {filteredServices.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200">
              <p>Nenhuma solicitação encontrada nesta categoria.</p>
            </div>
          ) : (
            currentUser.user_type === 'funcionario' ? (
              <DataTable
                data={filteredServices}
                columns={adminColumns}
                actions={adminActions}
                onRowClick={(s) => setSelectedService(s)}
              />
            ) : (
              filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  vessels={vessels}
                  onStatusChange={currentUser.user_type === 'funcionario' ? updateServiceStatus : undefined}
                  onEdit={() => { setEditingService(service); setIsModalOpen(true); }}
                  onDelete={() => { if (confirm('Excluir este serviço?')) deleteService(service.id); }}
                  onViewDetails={() => setSelectedService(service)}
                />
              ))
            )
          )}
          {/* Modal de Solicitação */}
          <Dialog
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingService(null);
            }}
            title={editingService?.id === 'new' ? 'Nova Solicitação' : editingService ? 'Editar Solicitação' : 'Nova Solicitação'}
          >
            {(!editingService || editingService.id === 'new') ? (
              <ServiceRequestWizard
                vessels={vessels}
                catalog={catalog}
                preSelectedService={
                  editingService && editingService.category
                    ? catalog.find(s => s.name === editingService.category) || { name: editingService.category, description: editingService.description } as any
                    : null
                }
                onCancel={() => setIsModalOpen(false)}
                onSubmit={async (formData) => {
                  const newServiceData = {
                    boat_id: formData.vessel_id,
                    description: formData.description,
                    category: formData.service_name,
                    preferred_date: formData.preferred_date,
                    urgency: formData.urgency,
                    photos: [],
                    user_id: currentUser.id,
                    status: 'Pendente' as any
                  };
                  addService(newServiceData);
                  setIsModalOpen(false);
                  setEditingService(null);
                }}
              />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>Embarcação</Label>
                  <Select name="vessel_id" required defaultValue={editingService.boat_id}>
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Categoria/Serviço</Label>
                    <Input name="category" defaultValue={editingService.category} disabled />
                  </div>
                  <div>
                    <Label>Urgência</Label>
                    <Select name="urgency" defaultValue={editingService.urgency}>
                      <option value="Normal">Normal</option>
                      <option value="Urgente">Urgente</option>
                      <option value="Emergencial">Emergencial</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Status (Admin)</Label>
                  <Select name="status" defaultValue={editingService.status} disabled={currentUser.user_type !== 'funcionario'}>
                    <option value="Pendente">Pendente</option>
                    <option value="Em Análise">Em Análise</option>
                    <option value="Agendado">Agendado</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                  </Select>
                </div>

                <div>
                  <Label>Descrição</Label>
                  <Input name="description" defaultValue={editingService.description} />
                </div>

                <div>
                  <Label>Data Preferencial</Label>
                  <Input name="preferred_date" type="date" defaultValue={editingService.preferred_date} />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit">Salvar Alterações</Button>
                </div>
              </form>
            )}
          </Dialog>
        </div>
      </section>
    </div>
  );
};



// --- Page: Profile ---

const Profile = () => {
  const { currentUser, updateUserProfile } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        phone: currentUser.phone
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Meu Perfil</h2>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl text-white font-bold shadow-xl">
            {currentUser.avatar_initial}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h3>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-1 text-sm">
              <Badge color={currentUser.user_type === 'funcionario' ? 'purple' : 'blue'}>
                {currentUser.user_type === 'funcionario' ? 'Administrador' : 'Cliente'}
              </Badge>
              <span className="text-slate-400 flex items-center gap-1 justify-center md:justify-start">
                <Clock size={12} /> Membro desde {new Date(currentUser.created_at).getFullYear()}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label>Nome Completo</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label>Telefone (WhatsApp)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          <div>
            <Label>E-mail (Não editável)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input defaultValue={currentUser.email} disabled className="pl-9 bg-slate-100 dark:bg-slate-800 opacity-70 cursor-not-allowed" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">
              <Save size={18} /> Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// --- Helper Icon for Activity ---
const ActivityIcon = (props: React.ComponentProps<'svg'>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);

// --- Page: Help & Settings Placeholders ---

const Help = () => (
  <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold">Central de Ajuda</h2>
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i} className="p-4">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <HelpCircle size={20} className="text-cyan-500" />
            Como solicitar um serviço?
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Passo a passo detalhado: 1. Acesse a aba serviços. 2. Clique no botão "Novo Serviço". 3. Preencha os dados e clique em salvar.</p>
        </Card>
      ))}
    </div>
    <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900">
      <h3 className="font-bold text-blue-900 dark:text-blue-100">Precisa de suporte urgente?</h3>
      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">Entre em contato pelo telefone (11) 9999-9999 ou envie um e-mail para suporte@marinaboat.com</p>
    </Card>
  </div>
);

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useAppContext();
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold">Configurações</h2>
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="font-medium text-lg mb-4">Aparência</h3>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Modo Escuro</span>
            <button
              onClick={toggleTheme}
              className={cn("w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center", isDarkMode ? "bg-cyan-600 justify-end" : "bg-slate-300 justify-start")}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <h3 className="font-medium text-lg mb-4">Notificações</h3>
          <div className="space-y-3">
            {['E-mail', 'Notificações Push', 'SMS'].map(type => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{type}</span>
                <div className="w-12 h-6 rounded-full bg-cyan-600 p-1 flex justify-end cursor-pointer"><div className="w-4 h-4 rounded-full bg-white" /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <p className="text-xs text-center text-slate-400">Marina Boat v1.0.0 • Todos os direitos reservados</p>
        </div>
      </Card>
    </div>
  )
}

// --- Layout ---

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications, isAuthenticated } = useAppContext();

  // If not authenticated, we only render the Login Screen (controlled in MainContent, but structure-wise handled here)
  if (!isAuthenticated) {
    return (
      <>
        {/* Toast Notification for Login Screen */}
        {notifications.length > 0 && (
          <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {notifications.map((msg, idx) => (
              <div key={idx} className="bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in slide-in-from-right fade-in">
                {msg}
              </div>
            ))}
          </div>
        )}
        <LoginScreen />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
          <div className="flex items-center gap-2">
            <Anchor className="text-cyan-500" />
            <span className="font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Marina Boat</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
            <Menu />
          </button>
        </header>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {/* Simple Toast Notification */}
          {notifications.length > 0 && (
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
              {notifications.map((msg, idx) => (
                <div key={idx} className="bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in slide-in-from-right fade-in">
                  {msg}
                </div>
              ))}
            </div>
          )}
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- App Provider & Main Logic ---


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]); // These are the REQUESTS
  const [catalog, setCatalog] = useState<Service[]>([]); // These are the CATALOG ITEMS
  const [clients, setClients] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  // ...
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Data on Auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch Vessels
    const { data: vesselsData, error: vesselsError } = await supabase
      .from('boats') // Updated table name
      .select('*');
    if (vesselsError) console.error('Error fetching vessels:', vesselsError);
    else if (vesselsData) {
      // Map DB columns to Frontend if needed, assuming direct map for now plus explicit archival check if needed?
      // DB 'is_archived' needs to be handled?
      // types.ts has 'is_archived', DB has 'is_archived'.
      setVessels(vesselsData as Vessel[]);
    }

    // Fetch Services (Requests)
    const { data: servicesData, error: servicesError } = await supabase
      .from('service_requests')
      .select('*');
    if (servicesError) console.error('Error fetching services:', servicesError);
    else if (servicesData) setServices(servicesData);

    // Fetch Catalog (Official Services)
    const { data: catalogData, error: catalogError } = await supabase
      .from('services')
      .select('*');
    if (catalogError) console.error('Error fetching catalog:', catalogError);
    else if (catalogData) setCatalog(catalogData);

    // Fetch Clients (Profiles)
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'cliente');
    if (profilesError) console.error('Error fetching clients:', profilesError);
    else if (profilesData) setClients(profilesData as User[]);

    setLoading(false);
  };

  // Theme Handling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Notification Helper
  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== msg));
    }, 3000);
  };

  // Auth Logic
  const login = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setCurrentUser(CURRENT_USER_EMPLOYEE);
    } else {
      setCurrentUser(CURRENT_USER_CLIENT);
    }
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    addNotification(`Bem-vindo, ${type === 'admin' ? 'Administrador' : 'Cliente'}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    addNotification("Você saiu do sistema.");
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...data });
    addNotification("Perfil atualizado com sucesso!");
  };

  const addClient = async (userData: Omit<User, 'id' | 'created_at' | 'avatar_initial' | 'user_type'>) => {
    // 1. Create Profile in Supabase
    // Note: In a full auth system, you'd use supabase.auth.signUp() here.
    // For this simple demo where we just insert into 'profiles' table to "simulate" a user registry linked to auth:
    const newUser = {
      ...userData,
      // Generating a random UUID-like string since we aren't using real Auth Signup yet for this "Admin creates User" flow
      // In real usage, Admin would invite user via email.
      // We will just insert into profiles.
      user_type: 'cliente' as const,
      avatar_initial: userData.name.charAt(0).toUpperCase(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([newUser])
      .select();

    if (error) {
      addNotification("Erro ao cadastrar cliente: " + error.message);
      console.error(error);
    } else if (data) {
      setClients([...clients, data[0] as User]);
      addNotification("Cliente cadastrado com sucesso!");
    }
  };

  const addVessel = async (vesselData: Omit<Vessel, 'id' | 'created_at'>) => {
    if (!currentUser) return;

    // Handle owner_id similar to service
    let ownerId = currentUser.id;
    // logic to get real ID if mock... simplified for brevity, assuming 'owner_email' logic from frontend handles proper existing user select for Admin
    // If admin is creating, vesselData.owner_id should be set from the form select.
    // If owner is creating, vesselData.owner_id might need to be set or inferred.

    // logic inside UI component sets owner_id via email lookup usually? 
    // The Interface 'Vessel' now has owner_id.

    const { data, error } = await supabase
      .from('boats') // Table name is boats
      .insert([vesselData]) // vesselData should match table columns
      .select();

    if (error) {
      addNotification("Erro ao salvar embarcação: " + error.message);
      console.error(error);
    } else if (data) {
      setVessels([...vessels, data[0] as Vessel]);
      addNotification("Embarcação salva com sucesso!");
    }
  };

  const updateVessel = async (id: string, data: Partial<Vessel>) => {
    const { error } = await supabase.from('vessels').update(data).eq('id', id);
    if (error) {
      console.error(error);
      addNotification("Erro ao atualizar embarcação: " + error.message);
    } else {
      setVessels(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
      addNotification("Embarcação atualizada com sucesso!");
    }
  };

  const deleteVessel = async (id: string) => {
    const { error } = await supabase.from('vessels').delete().eq('id', id);
    if (error) {
      console.error(error);
      addNotification("Erro ao excluir embarcação: " + error.message);
    } else {
      setVessels(prev => prev.filter(v => v.id !== id));
      addNotification("Embarcação excluída com sucesso!");
    }
  };

  const addService = async (serviceData: Omit<ServiceRequest, 'id' | 'user_id' | 'status' | 'created_at' | 'photos'>) => {
    if (!currentUser) return;

    // Get the user ID from the profile matching the current email (simulated auth)
    // Ideally use auth.uid() if real auth is likely
    // For now, assume currentUser has ID matching profiles table if we fetched it.
    // If currentUser comes from 'clients' state, it has ID.
    // If it comes from Mock, it has 'u1'.

    // We need to fetch the real UUID for the profile based on email if we are simulating login without real auth session
    let userId = currentUser.id;
    if (userId === 'u1' || userId === 'u2') {
      // Try to find real ID from clients list if loaded, or fetch it
      const found = clients.find(c => c.email === currentUser.email);
      if (found) userId = found.id;
    }

    const newService = {
      ...serviceData,
      user_id: userId, // Changed from created_by to user_id
      status: 'Pendente' as const,
      photos: [] // Default empty
    };

    const { data, error } = await supabase
      .from('service_requests')
      .insert([newService])
      .select();

    if (error) {
      addNotification("Erro ao solicitar serviço: " + error.message);
      console.error(error);
    } else if (data) {
      setServices([...services, data[0] as ServiceRequest]);
      addNotification("Solicitação enviada com sucesso!");
    }
  };

  const updateService = async (id: string, data: Partial<ServiceRequest>) => {
    const { error } = await supabase.from('service_requests').update(data).eq('id', id);
    if (error) {
      console.error(error);
      addNotification("Erro ao atualizar serviço: " + error.message);
    } else {
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
      addNotification("Serviço atualizado com sucesso!");
    }
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from('service_requests').delete().eq('id', id);
    if (error) {
      console.error(error);
      addNotification("Erro ao excluir serviço: " + error.message);
    } else {
      setServices(prev => prev.filter(s => s.id !== id));
      addNotification("Serviço excluído com sucesso!");
    }
  };

  const updateServiceStatus = (id: string, status: ServiceStatus) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    addNotification(`Status atualizado para ${status}`);
  };

  return (
    <AppContext.Provider value={{
      currentUser, isAuthenticated, login, logout, updateUserProfile,
      vessels, addVessel, updateVessel, deleteVessel,
      services, addService, updateService, deleteService, updateServiceStatus,
      clients, addClient, catalog, // Added catalog
      currentView, setCurrentView,
      isDarkMode, toggleTheme,
      notifications, addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

const MainContent = () => {
  const { currentView, services, vessels } = useAppContext();

  switch (currentView) {
    case 'dashboard': return <Dashboard />;
    case 'vessels': return <Vessels />;
    case 'services': return <Services />;
    case 'history': return <ServiceHistory services={services} vessels={vessels} />;
    case 'clients': return <Clients />;
    case 'profile': return <Profile />;
    case 'settings': return <SettingsPage />;
    case 'help': return <Help />;
    default: return <Dashboard />;
  }
};

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Layout>
          <MainContent />
        </Layout>
      </AppProvider>
    </ErrorBoundary>
  );
}
