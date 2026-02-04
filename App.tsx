import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Anchor, Wind, Droplets, User as UserIcon, LogOut, Settings,
  HelpCircle, Home, Ship, Briefcase, Plus, Search,
  CheckCircle2, Clock, AlertTriangle, Moon, Sun, Menu, LayoutDashboard,
  Lock, Mail, Eye, EyeOff, Save, Phone
} from 'lucide-react';
import { Card, Button, Badge, Input, Select, Label, Dialog, cn } from './components/ui';
import { User, Vessel, ServiceRequest, ViewState, ServiceStatus } from './types';
import {
  CURRENT_USER_CLIENT, CURRENT_USER_EMPLOYEE,
  MOCK_VESSELS, MOCK_SERVICES
} from './constants';

// --- Contexts ---

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (type: 'admin' | 'user') => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  vessels: Vessel[];
  services: ServiceRequest[];
  addVessel: (vessel: Omit<Vessel, 'id' | 'created_by'>) => void;
  addService: (service: Omit<ServiceRequest, 'id' | 'created_by' | 'status' | 'created_at'>) => void;
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
    { id: 'services', label: 'Todas Solicitações', icon: Briefcase },
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
        "fixed md:static inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:translate-x-0 flex flex-col h-full",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
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
        <div className="mx-4 mt-6 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 border border-blue-100 dark:border-slate-700">
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
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
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
    { label: 'Clientes', value: 12, icon: UserIcon, color: 'text-slate-600 bg-slate-100' }, // Mock
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
            <div className="mx-4 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
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

// --- Page: Vessels ---

const Vessels = () => {
  const { vessels, currentUser, addVessel } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentUser) return null;

  // Filter States
  const [filterType, setFilterType] = useState('Todos');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Base list depending on role
  const visibleVessels = currentUser.user_type === 'cliente'
    ? vessels.filter(v => v.created_by === currentUser.email)
    : vessels;

  // Apply filters
  const filteredVessels = visibleVessels.filter(v => {
    const matchType = filterType === 'Todos' || v.type === filterType;
    const matchBrand = v.brand.toLowerCase().includes(filterBrand.toLowerCase());
    const matchYear = filterYear === '' || v.year.toString().includes(filterYear);
    return matchType && matchBrand && matchYear;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    addVessel({
      name: formData.get('name') as string,
      type: formData.get('type') as any,
      brand: formData.get('brand') as string,
      model: formData.get('model') as string,
      year: parseInt(formData.get('year') as string),
      length: formData.get('length') as string,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentUser.user_type === 'cliente' ? 'Minhas Embarcações' : 'Todas as Embarcações'}
          </h2>
          <p className="text-slate-500">Gerencie a frota náutica.</p>
        </div>
        {currentUser.user_type === 'cliente' && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Nova Embarcação
          </Button>
        )}
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
              <option value="Iate">Iate</option>
              <option value="Catamarã">Catamarã</option>
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
            {visibleVessels.length === 0
              ? "Adicione sua primeira embarcação para começar."
              : "Tente ajustar os filtros para encontrar o que procura."}
          </p>
          {visibleVessels.length === 0 && currentUser.user_type === 'cliente' && (
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>Cadastrar Agora</Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVessels.map(vessel => (
            <Card key={vessel.id} className="relative group flex flex-col">
              <div className="h-32 bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-900/40 dark:to-blue-900/40 flex items-center justify-center shrink-0">
                <Ship className="h-16 w-16 text-blue-400/50 dark:text-blue-300/30 transform group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate pr-2">{vessel.name}</h3>
                  <Badge className="shrink-0">{vessel.type}</Badge>
                </div>
                {currentUser.user_type === 'funcionario' && (
                  <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                    <UserIcon size={12} />
                    <span className="truncate">{vessel.created_by}</span>
                  </div>
                )}
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mt-auto">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                    <span>Marca/Modelo:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate ml-2">{vessel.brand} {vessel.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                    <span>Ano:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{vessel.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comprimento:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{vessel.length}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Embarcação">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome da Embarcação</Label>
            <Input name="name" required placeholder="Ex: Pérola Negra" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select name="type">
                <option value="Lancha">Lancha</option>
                <option value="Veleiro">Veleiro</option>
                <option value="Iate">Iate</option>
                <option value="Catamarã">Catamarã</option>
              </Select>
            </div>
            <div>
              <Label>Ano</Label>
              <Input name="year" type="number" min="1900" max="2100" defaultValue="2024" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Marca</Label>
              <Input name="brand" placeholder="Ex: Azimut" required />
            </div>
            <div>
              <Label>Modelo</Label>
              <Input name="model" placeholder="Ex: 60 Fly" required />
            </div>
          </div>
          <div>
            <Label>Comprimento</Label>
            <Input name="length" placeholder="Ex: 60 pés" required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

// --- Page: Services ---

const Services = () => {
  const { services, vessels, currentUser, addService, updateServiceStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentUser) return null;

  const filteredServices = services.filter(s => {
    // 1. Role Filter
    if (currentUser.user_type === 'cliente' && s.created_by !== currentUser.email) return false;
    // 2. Tab Filter
    if (activeTab === 'Todos') return true;
    return s.status === activeTab;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    addService({
      vessel_id: formData.get('vessel_id') as string,
      category: formData.get('category') as any,
      description: formData.get('description') as string,
      preferred_date: formData.get('preferred_date') as string,
      urgency: formData.get('urgency') as any,
    });
    setIsModalOpen(false);
  };

  const tabs = ['Todos', 'Pendente', 'Em Andamento', 'Concluído'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentUser.user_type === 'cliente' ? 'Meus Serviços' : 'Solicitações de Serviço'}
          </h2>
          <p className="text-slate-500">Acompanhe o status das manutenções.</p>
        </div>
        {currentUser.user_type === 'cliente' && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Novo Serviço
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap",
              activeTab === tab
                ? "bg-white dark:bg-slate-800 text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            Nenhum serviço encontrado nesta categoria.
          </div>
        ) : (
          filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              vessels={vessels}
              onStatusChange={currentUser.user_type === 'funcionario' ? updateServiceStatus : undefined}
            />
          ))
        )}
      </div>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Solicitar Serviço">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Embarcação</Label>
            <Select name="vessel_id" required>
              {vessels.filter(v => v.created_by === currentUser.email).map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.model})</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoria</Label>
              <Select name="category">
                <option value="Limpeza">Limpeza</option>
                <option value="Abastecimento">Abastecimento</option>
                <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                <option value="Manutenção Corretiva">Manutenção Corretiva</option>
              </Select>
            </div>
            <div>
              <Label>Urgência</Label>
              <Select name="urgency">
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
                <option value="Emergencial">Emergencial</option>
              </Select>
            </div>
          </div>
          <div>
            <Label>Data Preferencial</Label>
            <Input name="preferred_date" type="date" required />
          </div>
          <div>
            <Label>Descrição Detalhada</Label>
            <textarea
              name="description"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none h-24 resize-none"
              placeholder="Descreva o que precisa ser feito..."
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Solicitar</Button>
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
}> = ({
  service,
  vessels,
  onStatusChange
}) => {
    const vessel = vessels.find(v => v.id === service.vessel_id);

    const statusColors: Record<ServiceStatus, "slate" | "blue" | "green" | "red"> = {
      'Pendente': 'slate',
      'Em Andamento': 'blue',
      'Concluído': 'green',
      'Cancelado': 'red'
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

        <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          {service.description}
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{new Date(service.preferred_date).toLocaleDateString('pt-BR')}</span>
            </div>
            <Badge color={urgencyBadge} className="text-[10px]">{service.urgency}</Badge>
          </div>

          {onStatusChange && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Select
                value={service.status}
                onChange={(e) => onStatusChange(service.id, e.target.value as ServiceStatus)}
                className="py-1 text-sm h-9"
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </Select>
            </div>
          )}
        </div>
      </Card>
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
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
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

  const [vessels, setVessels] = useState<Vessel[]>(MOCK_VESSELS);
  const [services, setServices] = useState<ServiceRequest[]>(MOCK_SERVICES);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

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

  const addVessel = (vesselData: Omit<Vessel, 'id' | 'created_by'>) => {
    if (!currentUser) return;
    const newVessel: Vessel = {
      ...vesselData,
      id: Math.random().toString(36).substr(2, 9),
      created_by: currentUser.email
    };
    setVessels([...vessels, newVessel]);
    addNotification("Embarcação cadastrada com sucesso!");
  };

  const addService = (serviceData: Omit<ServiceRequest, 'id' | 'created_by' | 'status' | 'created_at'>) => {
    if (!currentUser) return;
    const newService: ServiceRequest = {
      ...serviceData,
      id: Math.random().toString(36).substr(2, 9),
      created_by: currentUser.email,
      status: 'Pendente',
      created_at: new Date().toISOString()
    };
    setServices([...services, newService]);
    addNotification("Solicitação enviada com sucesso!");
  };

  const updateServiceStatus = (id: string, status: ServiceStatus) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    addNotification(`Status atualizado para ${status}`);
  };

  return (
    <AppContext.Provider value={{
      currentUser, isAuthenticated, login, logout, updateUserProfile,
      vessels, addVessel,
      services, addService, updateServiceStatus,
      currentView, setCurrentView,
      isDarkMode, toggleTheme,
      notifications, addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

const MainContent = () => {
  const { currentView } = useAppContext();

  switch (currentView) {
    case 'dashboard': return <Dashboard />;
    case 'vessels': return <Vessels />;
    case 'services': return <Services />;
    case 'profile': return <Profile />;
    case 'settings': return <SettingsPage />;
    case 'help': return <Help />;
    default: return <Dashboard />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <MainContent />
      </Layout>
    </AppProvider>
  );
}