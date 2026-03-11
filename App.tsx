import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Anchor, Wind, Droplets, User as UserIcon, LogOut, Settings,
  HelpCircle, Home, Ship, Briefcase, Plus, Search,
  CheckCircle2, Clock, AlertTriangle, Moon, Sun, Menu, LayoutDashboard,
  Lock, Mail, Eye, EyeOff, Save, Phone, Upload, X, FileText, Image as ImageIcon, Users, Edit, Trash2, Badge as BadgeIcon,
  TrendingUp, Activity as ActivityLucide, Building2, DollarSign, ClipboardList, Smartphone
} from 'lucide-react';
import { Card, Button, Badge, Input, Select, Label, Dialog, cn } from './components/ui';
import { DataTable, type Column } from './components/DataTable';
import { ServiceCatalog } from './components/ServiceCatalog';
import { User, Vessel, ServiceRequest, ViewState, ServiceStatus, Service, Marina, Quotation, UserType } from './types';

export interface LocationData {
  name: string;
  lat: string;
  lon: string;
}

const PRESET_LOCATIONS: LocationData[] = [
  { name: 'Rio de Janeiro', lat: '-23.0039', lon: '-43.3231' },
  { name: 'Represa Guarapiranga', lat: '-23.6823', lon: '-46.7324' },
  { name: 'Santos', lat: '-23.9608', lon: '-46.3336' },
  { name: 'Guarujá', lat: '-23.9935', lon: '-46.2571' },
  { name: 'Angra dos Reis', lat: '-23.0067', lon: '-44.3181' },
];
import {
  CURRENT_USER_CLIENT, CURRENT_USER_EMPLOYEE, CURRENT_USER_MARINA_OWNER
} from './constants';
// Adaptação para suportar tanto addService quanto addRequest se houver confusão de nomes anteriores
// ...
import { supabase } from './lib/supabase';
import { ServiceRequestWizard } from './components/ServiceRequestWizard';
import { ServiceDetails } from './components/ServiceDetails';
import { ServiceHistory } from './components/ServiceHistory';
import { WeatherWidget } from './components/WeatherWidget';
import { ProactiveAlerts } from './components/ProactiveAlerts';
import { ClientCard } from './components/ClientCard';
import { VesselCard } from './components/VesselCard';
import { DockMap } from './components/DockMap';
import { Toast } from './components/Toast';

import { InstallGuide } from './components/InstallGuide';

const APP_VERSION = "v1.0.4";


// --- Contextos ---

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (type: UserType | 'manual', email?: string, password?: string) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  vessels: Vessel[];
  services: ServiceRequest[];
  clients: User[];
  addClient: (user: Omit<User, 'id' | 'created_at' | 'avatar_initial' | 'user_type'>) => void;
  updateClient: (id: string, data: Partial<User>) => void;
  deleteClient: (id: string) => void;
  addVessel: (vessel: Omit<Vessel, 'id'>) => void;
  updateVessel: (id: string, data: Partial<Vessel>) => void;
  deleteVessel: (id: string) => void;
  catalog: Service[]; // Lógica adicionada
  updateCatalogState: (newCatalog: Service[]) => void;

  addService: (service: Omit<ServiceRequest, 'id' | 'user_id' | 'status' | 'created_at' | 'photos'>) => void;
  updateService: (id: string, data: Partial<ServiceRequest>) => void;
  deleteService: (id: string) => void;
  updateServiceStatus: (id: string, status: ServiceStatus) => void;

  agents: User[];
  addAgent: (user: Omit<User, 'id' | 'created_at' | 'avatar_initial' | 'user_type'>) => void;
  updateAgent: (id: string, data: Partial<User>) => void;
  deleteAgent: (id: string) => void;

  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentMarina: Marina | null;
  marinas: Marina[];
  addMarina: (marina: Omit<Marina, 'id' | 'created_at' | 'updated_at'>) => void;
  updateMarina: (id: string, data: Partial<Marina>) => void;
  deleteMarina: (id: string) => void;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  addNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
  notificationSettings: { email: boolean; push: boolean; sms: boolean };
  updateNotificationSettings: (settings: { email: boolean; push: boolean; sms: boolean }) => void;

  quotations: Quotation[];
  addQuotation: (data: Omit<Quotation, 'id' | 'created_at'>) => Promise<void>;
  updateQuotationStatus: (id: string, status: 'Aprovado' | 'Recusado') => Promise<void>;
  marinaLocation: LocationData;
  setMarinaLocation: (location: LocationData) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// --- Componente da Tela de Login ---

const LoginScreen = () => {
  const { login } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Demonstração apenas
  const handleDemoLogin = (type: UserType) => {
    login(type);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('manual' as any, email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Decoração de Fundo */}
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
            <p className="text-slate-500 text-sm mt-2">Gestão Náutica Inteligente • {APP_VERSION}</p>
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
            <p className="text-[10px] text-center text-slate-400 mb-4 font-bold uppercase tracking-[0.2em]">
              Acesso Rápido (Demonstração)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin('admin')}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
              >
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">Admin</div>
                <div className="text-[9px] text-slate-500 font-mono mt-1 group-hover:text-cyan-600">
                  admin@<br />admin123
                </div>
              </button>
              <button
                onClick={() => handleDemoLogin('marina')}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
              >
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">Marina</div>
                <div className="text-[9px] text-slate-500 font-mono mt-1 group-hover:text-emerald-600">
                  marina@<br />marina123
                </div>
              </button>
              <button
                onClick={() => handleDemoLogin('cliente')}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
              >
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">Embarcação</div>
                <div className="text-[9px] text-slate-500 font-mono mt-1 group-hover:text-blue-600">
                  cliente@<br />user123
                </div>
              </button>
            </div>
          </div>
        </Card>
        <p className="text-center text-slate-400 text-[10px] mt-6 font-medium uppercase tracking-widest">
          © 2024-2026 Boat Pass • {APP_VERSION}
        </p>
      </div>
    </div>
  );
};

// --- Componentes ---

// --- Componente: Tooltip ---
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl">
          {content}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900 dark:border-r-slate-700" />
        </div>
      )}
    </div>
  );
};

// --- Componente: Sidebar ---

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const { currentUser, currentView, setCurrentView, isDarkMode, toggleTheme, logout, currentMarina } = useAppContext();

  if (!currentUser) return null;

  const menuItemsByType: Record<string, { id: string; label: string; icon: any }[]> = {
    admin: [
      { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
      { id: 'clients', label: 'Clientes', icon: Users },
      { id: 'marinas', label: 'Marinas', icon: Building2 },
      { id: 'agents', label: 'Equipe', icon: BadgeIcon },
      { id: 'services', label: 'Todas Solicitações', icon: Briefcase },
      { id: 'history', label: 'Histórico', icon: FileText },
      { id: 'vessels', label: 'Todas Embarcações', icon: Ship },
    ],
    marina: [
      { id: 'dashboard', label: 'Painel da Marina', icon: LayoutDashboard },
      { id: 'clients', label: 'Clientes', icon: Users },
      { id: 'services', label: 'Fila de Serviços', icon: ClipboardList },
      { id: 'vessels', label: 'Embarcações na Marina', icon: Ship },
      { id: 'quotations', label: 'Orçamentos', icon: DollarSign },
      { id: 'agents', label: 'Equipe', icon: BadgeIcon },
      { id: 'history', label: 'Histórico', icon: FileText },
      { id: 'profile', label: 'Perfil', icon: UserIcon },
    ],
    cliente: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'vessels', label: 'Minhas Embarcações', icon: Ship },
      { id: 'services', label: 'Meus Serviços', icon: Briefcase },
      { id: 'quotations', label: 'Orçamentos', icon: DollarSign },
      { id: 'profile', label: 'Perfil', icon: UserIcon },
      { id: 'settings', label: 'Configurações', icon: Settings },
      { id: 'help', label: 'Ajuda', icon: HelpCircle },
    ],
  };

  const menuItems = menuItemsByType[currentUser.user_type] || menuItemsByType.cliente;

  return (
    <>
      {/* Sobreposição Móvel */}
      <div
        className={cn("fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
        onClick={() => setIsOpen(false)}
      />

      {/* Barra Lateral Minimalista */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-30 w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:translate-x-0 flex flex-col items-center py-4",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Avatar do Usuário no Topo */}
        <Tooltip content={currentUser.name.split(' ')[0]}>
          <div className="mb-6 relative group cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white dark:ring-slate-900 transition-transform group-hover:scale-110">
              {currentUser.avatar_initial}
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
          </div>
        </Tooltip>

        {/* Navegação Principal */}
        <nav className="flex-1 flex flex-col items-center gap-1 w-full px-2">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <div key={item.id}>
                <Tooltip content={item.label}>
                  <button
                    data-testid={item.id}
                    onClick={() => {
                      setCurrentView(item.id as ViewState);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                      isActive
                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 shadow-sm"
                        : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300"
                    )}
                  >
                    {/* Indicador de Ativo */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-600 dark:bg-cyan-400 rounded-r-full" />
                    )}
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </button>
                </Tooltip>
              </div>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="flex flex-col items-center gap-1 w-full px-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Tooltip content="Configurações">
            <button
              onClick={() => setCurrentView('settings')}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
            >
              <Settings size={20} />
            </button>
          </Tooltip>

          <Tooltip content={isDarkMode ? "Modo Claro" : "Modo Escuro"}>
            <button
              onClick={toggleTheme}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </Tooltip>

          <Tooltip content="Sair">
            <button
              onClick={logout}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
            >
              <LogOut size={20} />
            </button>
          </Tooltip>

          <div className="py-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest pointer-events-none select-none">
            {APP_VERSION}
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Página: Dashboard ---

const Dashboard = () => {
  const {
    currentUser, vessels, services, clients, agents,
    setCurrentView, currentMarina, marinaLocation, setMarinaLocation, addNotification
  } = useAppContext();

  const [locationToConfirm, setLocationToConfirm] = useState<LocationData | null>(null);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);

  if (!currentUser) return null;

  // Lógica de Filtro
  const myVessels = currentUser.user_type === 'cliente'
    ? vessels.filter(v => v.owner_id === currentUser.id)
    : vessels;

  const myServices = currentUser.user_type === 'cliente'
    ? services.filter(s => s.user_id === currentUser.id)
    : services;

  const pendingServices = myServices.filter(s => s.status === 'Pendente');
  const activeServices = myServices.filter(s => ['Pendente', 'Em Andamento'].includes(s.status));
  const completedServices = myServices.filter(s => s.status === 'Concluído');
  const inProgressServices = myServices.filter(s => s.status === 'Em Andamento');

  // Estatísticas do Cliente
  const clientStats = [
    { label: 'Embarcações', value: myVessels.length, icon: Ship, color: 'text-blue-600', bgColor: 'bg-blue-50', trend: '+2' },
    { label: 'Serviços Ativos', value: activeServices.length, icon: ActivityLucide, color: 'text-cyan-600', bgColor: 'bg-cyan-50', trend: '+5' },
    { label: 'Concluídos', value: completedServices.length, icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', trend: '+12%' },
    { label: 'Total', value: myServices.length, icon: Briefcase, color: 'text-purple-600', bgColor: 'bg-purple-50', trend: '+8' },
  ];

  // Estatísticas do Admin
  const adminStats = [
    { label: 'Pendentes', value: pendingServices.length, icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-50', trend: '-3' },
    { label: 'Em Andamento', value: inProgressServices.length, icon: ActivityLucide, color: 'text-blue-600', bgColor: 'bg-blue-50', trend: '+2' },
    { label: 'Concluídos', value: completedServices.length, icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', trend: '+15%' },
    { label: 'Embarcações', value: vessels.length, icon: Ship, color: 'text-cyan-600', bgColor: 'bg-cyan-50', trend: '+4' },
    { label: 'Clientes', value: clients.length, icon: UserIcon, color: 'text-slate-600', bgColor: 'bg-slate-50', trend: '+7' },
  ];

  const statsToShow = currentUser.user_type === 'cliente' ? clientStats : adminStats;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Moderno */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {currentUser.user_type === 'cliente'
              ? `Olá, ${currentUser.name.split(' ')[0]}! 👋`
              : (currentMarina?.name || (currentUser.user_type === 'marina' ? `Marina ${currentUser.name}` : 'Painel Administrativo'))}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            {currentUser.user_type === 'cliente'
              ? 'Acompanhe seus serviços e embarcações.'
              : `${currentMarina?.city ? currentMarina.city + ' - ' : ''}${currentUser.user_type === 'marina' ? 'Gerencie sua marina e serviços.' : 'Gerencie usuários e serviços.'}`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-2 uppercase tracking-tighter">Região</div>
            <select
              className="bg-transparent border-0 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer py-1 px-3"
              value={marinaLocation.name}
              onChange={(e) => {
                const loc = PRESET_LOCATIONS.find(l => l.name === e.target.value);
                if (loc) setLocationToConfirm(loc);
              }}
            >
              {PRESET_LOCATIONS.map(loc => (
                <option key={loc.name} value={loc.name} className="bg-white dark:bg-slate-900">{loc.name}</option>
              ))}
            </select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsInstallGuideOpen(true)}
            className="text-slate-500 hover:text-blue-600 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 rounded-xl"
          >
            <Smartphone size={16} className="mr-1.5" />
            App no Celular
          </Button>
          {currentUser.user_type === 'cliente' && (
            <Button
              onClick={() => setCurrentView('services')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            >
              <Plus size={20} className="mr-2" />
              Novo Serviço
            </Button>
          )}
        </div>
      </div>

      {/* Grade de Estatísticas Modernas */}
      <div className={cn("grid gap-4", currentUser.user_type === 'cliente' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5")}>
        {statsToShow.map((stat, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition-all duration-200 border-0 shadow-md hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={14} />
                  {stat.trend} este mês
                </p>
              </div>
              <div className={cn("p-4 rounded-2xl", stat.bgColor)}>
                <stat.icon className={cn("h-8 w-8", stat.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>



      {/* Alertas Proativos */}
      <ProactiveAlerts />

      {/* Weather Widget */}
      <WeatherWidget
        lat={marinaLocation.lat}
        lon={marinaLocation.lon}
        marinaName={marinaLocation.name}
      />

      {/* Mapa de Píer Interativo (Apenas Marina/Admin) */}
      {(currentUser.user_type === 'marina' || currentUser.user_type === 'admin') && (
        <div className="animate-in slide-in-from-bottom duration-700 delay-200">
          <DockMap />
        </div>
      )}



      {/* Lista de Atividades Recentes */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          {currentUser.user_type === 'cliente' ? 'Serviços Ativos' : 'Solicitações Pendentes'}
        </h3>

        {activeServices.length === 0 && currentUser.user_type === 'cliente' ? (
          <Card className="p-6 text-center">
            <div className="mx-auto w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="text-slate-400" size={20} />
            </div>
            <p className="text-sm text-slate-500">Nenhum serviço ativo no momento.</p>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(currentUser.user_type === 'cliente' ? activeServices : pendingServices).slice(0, 6).map(service => (
              <ServiceCard key={service.id} service={service} vessels={vessels} />
            ))}
          </div>
        )}
      </div>

      {/* Confirmação de Troca de Região */}
      <Dialog
        isOpen={!!locationToConfirm}
        onClose={() => setLocationToConfirm(null)}
        title="Confirmar Mudança de Região"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Você deseja alterar a exibição climática para <strong>{locationToConfirm?.name}</strong>?
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setLocationToConfirm(null)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (locationToConfirm) {
                setMarinaLocation(locationToConfirm);
                addNotification(`Região alterada para ${locationToConfirm.name}`, 'success');
                setLocationToConfirm(null);
              }
            }}>
              Confirmar Alteração
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Guia de Instalação PWA */}
      <InstallGuide
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />
    </div>
  );
};

// --- Página: Clientes (Admin) ---

const Clients = () => {
  const { clients, addClient, updateClient, deleteClient } = useAppContext();
  const [editingClient, setEditingClient] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<User | null>(null);
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
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient(formData);
    }
    setFormData({ name: '', email: '', phone: '', cpf: '', password: '' });
    setEditingClient(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Clientes Cadastrados</h2>
          <p className="text-slate-500">Gerencie os usuários da marina.</p>
        </div>
        <Button onClick={() => { setEditingClient(null); setFormData({ name: '', email: '', phone: '', cpf: '', password: '' }); setIsModalOpen(true); }}>
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
                <th className="px-6 py-4 text-right">Ações</th>
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
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setFormData({
                            name: client.name || '',
                            email: client.email || '',
                            phone: client.phone || '',
                            cpf: client.cpf || '',
                            password: ''
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-500 rounded bg-slate-50 dark:bg-slate-800 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setClientToDelete(client)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded bg-slate-50 dark:bg-slate-800 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingClient(null); }} title={editingClient ? "Editar Cliente" : "Novo Cliente"}>
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
            <Button type="submit">{editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}</Button>
          </div>
        </form>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p>Você está prestes a excluir permanentemente o cliente <strong>{clientToDelete?.name}</strong>.</p>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Esta ação não pode ser desfeita. Todos os dados associados a este cliente serão perdidos.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setClientToDelete(null)}>Cancelar</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (clientToDelete) {
                  deleteClient(clientToDelete.id);
                  setClientToDelete(null);
                }
              }}
            >
              Excluir Cliente
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

// --- Página: Embarcações ---

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
  const [vesselToDelete, setVesselToDelete] = useState<Vessel | null>(null);

  if (!currentUser) return null;

  // --- Filter Logic ---
  // --- Lógica de Filtro ---
  const filteredVessels = vessels.filter(v => {
    // 1. Segurança / Filtro de Perfil
    if (currentUser.user_type === 'cliente') {
      // Verificação rigorosa de ID. Se dados legados usarem email em owner_id, isso pode precisar de ajuste,
      // mas para segurança adequada, exigimos ID.
      if (v.owner_id !== currentUser.id) return false;
    }

    // 2. Filtro de Pesquisa (Termo de pesquisa não está neste estado de componente, mas props?
    // Espere, padrão típico aqui é estado local.
    // Olhando para a linha 559: const [filterBrand, setFilterBrand] = useState('');
    // Não há termo de pesquisa global passado aqui. Vamos manter os filtros locais presentes (Marca, Tipo, Ano).
    // O código anterior verificou se o estado local existe.

    // 3. Filtros Dropdown
    const matchType = filterType === 'Todos' || v.type === filterType;
    const matchBrand = filterBrand === '' || (v.brand + ' ' + v.model).toLowerCase().includes(filterBrand.toLowerCase());
    const matchYear = filterYear === '' || v.year.toString().includes(filterYear);

    return matchType && matchBrand && matchYear;
  });

  // Usamos apenas filteredVessels agora (visibleVessels foi um passo intermediário que podemos mesclar)
  // Verificar usos de visibleVessels... Foi usado na mensagem "Sem resultados".
  // Podemos apenas usar filteredVessels.length lá ou uma verificação separada "hasAnyVessels" se necessário.
  // Na verdade, para manter a lógica "Adicione sua primeira embarcação" correta, podemos precisar saber se eles têm ALGUM barco.
  const userHasBoats = vessels.some(v => currentUser.user_type === 'admin' || v.owner_id === currentUser.id);

  // --- Lógica do Formulário ---

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
      capacity: parseInt(formData.get('capacity') as string),
      price_per_hour: parseFloat(formData.get('price') as string),
      registration_number: formData.get('registration_number') as string,
      photos: photoPreviews,
      documents: docs.map(d => d.name),
      owner_id: ownerEmail || (editingVessel ? editingVessel.owner_id : currentUser.id),
      is_archived: editingVessel ? editingVessel.is_archived : false
    };

    if (editingVessel) {
      updateVessel(editingVessel.id, vesselData);
    } else {
      addVessel(vesselData);
    }

    // Reiniciar
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

  if (currentUser.user_type === 'admin') {
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
      <Button variant="ghost" size="sm" onClick={() => { setEditingVessel(v); setIsModalOpen(true); }} aria-label="Editar" className="h-8 w-8 p-0">
        <Edit size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setVesselToDelete(v)} aria-label="Excluir" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500">
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
        currentUser.user_type === 'admin' ? (
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
                  {currentUser.user_type === 'admin' && (
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
                          setVesselToDelete(vessel);
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

          {/* Admin: Selecionar Proprietário */}
          {currentUser.user_type === 'admin' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900 mb-4">
              <Label>Proprietário da Embarcação <span className="text-red-500">*</span></Label>
              <Select name="owner_email" required defaultValue="">
                <option value="" disabled>Selecione um cliente</option>
                {clients.filter(c => c.user_type === 'cliente').map(client => (
                  <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                ))}
              </Select>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">A embarcação será vinculada a este cliente.</p>
            </div>
          )}

          {/* Informações Básicas */}
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
                {/* Combinando Marca/Modelo na UI para simplicidade com base na listagem do prompt, mas o backend os divide.
                    Vamos usar apenas dois campos de acordo com a estrutura original, mas garantir que o Modelo cubra o requisito */}
                <input type="hidden" name="brand" value="Genérico" />
              </div>
              <div>
                <Label>Comprimento <span className="text-red-500">*</span></Label>
                <Input name="length" placeholder="Ex: 30 pés" required defaultValue={editingVessel?.length} />
              </div>
              {/* HIDDEN FIELDS for Legacy DB Compatibility (Schema 001 requires these) */}
              <input type="hidden" name="capacity" value="10" />
              <input type="hidden" name="price" value="0" />
            </div>

            <div>
              <Label>Matrícula / Registro <span className="text-red-500">*</span></Label>
              <Input name="registration_number" placeholder="Ex: 442123984-2" required defaultValue={editingVessel?.registration_number} />
            </div>
          </div>

          {/* Upload de Fotos */}
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

          {/* Upload de Documentos */}
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

      {/* Modal de Confirmação de Exclusão de Embarcação */}
      <Dialog
        isOpen={!!vesselToDelete}
        onClose={() => setVesselToDelete(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p>Você tem certeza que deseja excluir a embarcação <strong>{vesselToDelete?.name}</strong>?</p>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Esta ação removerá permanentemente a embarcação e todos os serviços associados a ela.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setVesselToDelete(null)}>Cancelar</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (vesselToDelete) {
                  deleteVessel(vesselToDelete.id);
                  setVesselToDelete(null);
                }
              }}
            >
              Excluir Embarcação
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

// --- Componente: ServiceCard ---

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
      'Agendado': 'purple',
      'Aguardando Orçamento': 'yellow',
      'Orçamento Recusado': 'red'
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

          {/* Ações de Rodapé: Status + Editar/Excluir */}
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

              {/* Botões de Editar/Excluir */}
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
// --- Página: Serviços ---

const Services = () => {
  const { services, vessels, currentUser, addService, updateService, deleteService, updateServiceStatus, clients, catalog } = useAppContext();
  const [activeTab, setActiveTab] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRequest | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceRequest | null>(null);

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
          // Atualizar o estado do serviço selecionado localmente para refletir a mudança imediatamente, se necessário,
          // embora a atualização do Contexto deva acionar o re-render, podemos precisar sincronizar a prop passada.
          setSelectedService(prev => prev ? ({ ...prev, status }) : null);
        }}
        isAdmin={currentUser.user_type === 'admin' || currentUser.user_type === 'marina'}
      />
    );
  }

  const statusColors: Record<ServiceStatus, any> = {
    'Pendente': 'slate', 'Em Andamento': 'blue', 'Concluído': 'green',
    'Cancelado': 'red', 'Em Análise': 'yellow', 'Agendado': 'purple',
    'Aguardando Orçamento': 'yellow', 'Orçamento Recusado': 'red'
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
      <Button variant="ghost" size="sm" onClick={() => setSelectedService(s)} aria-label="Ver Detalhes" className="h-8 w-8 p-0">
        <Eye size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => { setEditingService(s); setIsModalOpen(true); }} aria-label="Editar" className="h-8 w-8 p-0">
        <Edit size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setServiceToDelete(s)} aria-label="Excluir" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500">
        <Trash2 size={14} />
      </Button>
    </div>
  );

  const filteredServices = services.filter(s => {
    // 1. Filtro de Perfil
    if (currentUser.user_type === 'cliente') {
      if (s.user_id !== currentUser.id) return false;
    }

    // 2. Filtro de Aba
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
      total_cost: formData.get('total_cost') ? parseFloat(formData.get('total_cost') as string) : undefined,
      status_payment: formData.get('status_payment') as any,
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

      {/* SEÇÃO DE CATÁLOGO */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-1 bg-cyan-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Catálogo Disponível</h3>
        </div>

        <ServiceCatalog
          isAdmin={currentUser.user_type === 'admin'}
          onSelectService={(service) => {
            // Preencher o modal com detalhes do item do catálogo
            setEditingService({
              id: 'new', // Marcar como novo
              boat_id: '',
              user_id: currentUser.id,
              category: service.name, // Mapear Nome do Serviço para campo Categoria
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

      {/* SEÇÃO DE LISTA DE SOLICITAÇÕES */}
      <section className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Acompanhamento</h3>
          </div>

          {/* Abas */}
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

        <div className={cn(currentUser.user_type === 'admin' ? "" : "grid gap-4 md:grid-cols-2 lg:grid-cols-3")}>
          {filteredServices.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200">
              <p>Nenhuma solicitação encontrada nesta categoria.</p>
            </div>
          ) : (
            currentUser.user_type === 'admin' ? (
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
                  onStatusChange={(currentUser.user_type === 'admin' || currentUser.user_type === 'marina') ? updateServiceStatus : undefined}
                  onEdit={() => { setEditingService(service); setIsModalOpen(true); }}
                  onDelete={() => setServiceToDelete(service)}
                  onViewDetails={() => setSelectedService(service)}
                />
              ))
            )
          )}

          {/* Modal de Confirmação de Exclusão de Serviço */}
          <Dialog
            isOpen={!!serviceToDelete}
            onClose={() => setServiceToDelete(null)}
            title="Confirmar Exclusão"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
                <AlertTriangle className="h-6 w-6 shrink-0" />
                <p>Você tem certeza que deseja excluir o serviço <strong>{serviceToDelete?.category}</strong>?</p>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setServiceToDelete(null)}>Cancelar</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    if (serviceToDelete) {
                      deleteService(serviceToDelete.id);
                      setServiceToDelete(null);
                    }
                  }}
                >
                  Excluir Serviço
                </Button>
              </div>
            </div>
          </Dialog>

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
                  <Select
                    name="vessel_id"
                    required
                    value={editingService.boat_id}
                    onChange={(e) => setEditingService({ ...editingService, boat_id: e.target.value })}
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Categoria/Serviço</Label>
                    <Select
                      name="category_select"
                      value={catalog.find(c => c.name === editingService.category) ? editingService.category : 'Outro'}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue === 'Outro') {
                          setEditingService({
                            ...editingService,
                            category: '' // Clear to force input
                          });
                        } else {
                          const catalogItem = catalog.find(c => c.name === selectedValue);
                          setEditingService({
                            ...editingService,
                            category: selectedValue,
                            description: catalogItem ? catalogItem.description : editingService.description
                          });
                        }
                      }}
                    >
                      <option value="Outro">Outro / Personalizado</option>
                      {catalog.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </Select>
                    {(!catalog.find(c => c.name === editingService.category)) && (
                      <Input
                        className="mt-2 animate-in fade-in slide-in-from-top-2"
                        name="category"
                        placeholder="Descreva o serviço..."
                        value={editingService.category}
                        onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                      />
                    )}
                  </div>
                  <div>
                    <Label>Urgência</Label>
                    <Select
                      name="urgency"
                      value={editingService.urgency}
                      onChange={(e) => setEditingService({ ...editingService, urgency: e.target.value as any })}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Urgente">Urgente</option>
                      <option value="Emergencial">Emergencial</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Status (Admin)</Label>
                  <Select
                    name="status"
                    value={editingService.status}
                    onChange={(e) => setEditingService({ ...editingService, status: e.target.value as any })}
                    disabled={currentUser.user_type !== 'admin'}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Análise">Em Análise</option>
                    <option value="Agendado">Agendado</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                  </Select>
                </div>

                {currentUser.user_type === 'admin' && (
                  <>
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input
                        name="total_cost"
                        type="number"
                        placeholder="0.00"
                        value={editingService.total_cost || ''}
                        onChange={(e) => setEditingService({ ...editingService, total_cost: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Status Pagamento</Label>
                      <Select
                        name="status_payment"
                        value={editingService.status_payment || 'Pendente'}
                        onChange={(e) => setEditingService({ ...editingService, status_payment: e.target.value as any })}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Pago">Pago</option>
                        <option value="N/A">N/A</option>
                      </Select>
                    </div>
                  </>
                )}

                <div>
                  <Label>Descrição</Label>
                  <Input
                    name="description"
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Data Preferencial</Label>
                  <Input
                    name="preferred_date"
                    type="date"
                    value={editingService.preferred_date}
                    onChange={(e) => setEditingService({ ...editingService, preferred_date: e.target.value })}
                  />
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



// --- Página: Perfil ---

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
              <Badge color={currentUser.user_type === 'admin' ? 'purple' : 'blue'}>
                {currentUser.user_type === 'admin' ? 'Administrador' : 'Cliente'}
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

// --- Página: Equipe (Agentes) ---

const Agents = () => {
  console.log("Agents component rendered");
  const { agents, addAgent, updateAgent, deleteAgent } = useAppContext();
  console.log("Agents list:", agents);
  const [editingAgent, setEditingAgent] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<User | null>(null);
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
    if (editingAgent) {
      updateAgent(editingAgent.id, formData);
    } else {
      addAgent(formData);
    }
    setFormData({ name: '', email: '', phone: '', cpf: '', password: '' });
    setEditingAgent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Equipe da Marina</h2>
          <p className="text-slate-500">Gerencie os membros da equipe.</p>
        </div>
        <Button onClick={() => { setEditingAgent(null); setFormData({ name: '', email: '', phone: '', cpf: '', password: '' }); setIsModalOpen(true); }}>
          <Plus size={18} /> Novo Membro
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
                <th className="px-6 py-4 text-center">Cadastro</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    Nenhum membro cadastrado.
                  </td>
                </tr>
              ) : (
                agents.map(agent => (
                  <tr key={agent.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                        {agent.avatar_initial}
                      </div>
                      {agent.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{agent.email}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{agent.phone}</td>
                    <td className="px-6 py-4 text-slate-400 text-center">{new Date(agent.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingAgent(agent);
                            setFormData({
                              name: agent.name || '',
                              email: agent.email || '',
                              phone: agent.phone || '',
                              cpf: agent.cpf || '',
                              password: ''
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-500 rounded bg-slate-50 dark:bg-slate-800 transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setAgentToDelete(agent)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded bg-slate-50 dark:bg-slate-800 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingAgent(null); }} title={editingAgent ? "Editar Membro" : "Novo Membro"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome Completo</Label>
            <Input
              name="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Maria Souza"
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
              placeholder="agente@marina.com"
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
            <Label>Senha</Label>
            <Input
              name="password"
              type="password"
              required={!editingAgent}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingAgent ? "Deixe em branco para manter" : "******"}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editingAgent ? 'Salvar Alterações' : 'Cadastrar Membro'}</Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={!!agentToDelete}
        onClose={() => setAgentToDelete(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p>Você excluir o membro <strong>{agentToDelete?.name}</strong>?</p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setAgentToDelete(null)}>Cancelar</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (agentToDelete) {
                  deleteAgent(agentToDelete.id);
                  setAgentToDelete(null);
                }
              }}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

// --- Ícone Auxiliar para Atividade ---
const ActivityIcon = (props: React.ComponentProps<'svg'>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);

// --- Página: Placeholders de Ajuda & Configurações ---

const Help = () => (
  <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold">Central de Ajuda</h2>
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <HelpCircle size={20} className="text-cyan-500" />
          Como solicitar um serviço?
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          1. Acesse a aba <strong>Serviços</strong>.<br />
          2. Clique no botão <strong>"Novo Serviço"</strong>.<br />
          3. Escolha o serviço desejado, a embarcação e a urgência.<br />
          4. Clique em salvar e acompanhe o status pelo painel.
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Ship size={20} className="text-blue-500" />
          Como cadastrar minha embarcação?
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Vá até <strong>Embarcações</strong> e clique em <strong>Nova Embarcação</strong>.
          Preencha os dados (nome, marca, modelo) e anexe fotos e documentos se necessário.
          A aprovação é automática em nosso sistema de demonstração.
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Clock size={20} className="text-green-500" />
          Quais os horários de funcionamento?
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          A marina funciona 24h para segurança e atracação.
          Serviços de manutenção e abastecimento ocorrem das <strong>08:00 às 18:00</strong>.
          Atendimentos emergenciais podem ser solicitados a qualquer momento pelo suporte.
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Users size={20} className="text-purple-500" />
          Como atualizar meu cadastro?
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Acesse a aba <strong>Perfil</strong> no menu lateral.
          Lá você pode atualizar seu telefone e nome de exibição.
          Para alterar o e-mail, entre em contato com a administração.
        </p>
      </Card>
    </div>

    <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900">
      <h3 className="font-bold text-blue-900 dark:text-blue-100">Precisa de suporte urgente?</h3>
      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
        Entre em contato pelo telefone (11) 9999-9999 ou envie um e-mail para suporte@marinaboat.com
      </p>
    </Card>
  </div>
);

const SettingsPage = () => {
  const { isDarkMode, toggleTheme, notificationSettings, updateNotificationSettings } = useAppContext();

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
            {[
              { id: 'email', label: 'E-mail' },
              { id: 'push', label: 'Notificações Push' },
              { id: 'sms', label: 'SMS' }
            ].map(type => (
              <div key={type.id} className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{type.label}</span>
                <button
                  onClick={() => updateNotificationSettings({
                    ...notificationSettings,
                    [type.id]: !notificationSettings[type.id as keyof typeof notificationSettings]
                  })}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center",
                    notificationSettings[type.id as keyof typeof notificationSettings] ? "bg-cyan-600 justify-end" : "bg-slate-300 justify-start"
                  )}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">
            * As preferências são salvas automaticamente neste dispositivo.
          </p>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <p className="text-xs text-center text-slate-400">Marina Boat v1.0.1 • Todos os direitos reservados</p>
        </div>
      </Card>
    </div>
  )
}

// --- Layout ---

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications, setNotifications, isAuthenticated, currentMarina, currentUser } = useAppContext();

  // Se não estiver autenticado, renderizamos apenas a Tela de Login (controlada no MainContent, mas estruturalmente tratada aqui)
  if (!isAuthenticated) {
    return (
      <>
        {/* Notificação Toast para Tela de Login */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {notifications.map((n: any) => (
            <div key={n.id} className="pointer-events-auto">
              <Toast
                message={n.message}
                type={n.type}
                onClose={() => setNotifications(prev => prev.filter((notif: any) => notif.id !== n.id))}
              />
            </div>
          ))}
        </div>
        <LoginScreen />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Cabeçalho Móvel */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
          <div className="flex items-center gap-2">
            <Anchor className="text-cyan-500" size={20} />
            <span className="font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {currentMarina?.name || (currentUser?.user_type === 'marina' ? `Marina ${currentUser.name.split(' ')[0]}` : 'Marina Boat')}
            </span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
            <Menu />
          </button>
        </header>

        {/* Área de Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {/* Notificação Toast Premium */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
            {notifications.map((n: any) => (
              <div key={n.id} className="pointer-events-auto">
                <Toast
                  message={n.message}
                  type={n.type}
                  onClose={() => setNotifications(prev => prev.filter((notif: any) => notif.id !== n.id))}
                />
              </div>
            ))}
          </div>
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- App Provider & Lógica Principal ---


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa estado preguiçosamente do localStorage para evitar "flash da tela de login" no F5
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('marina_boat_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('marina_boat_user');
  });

  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [marinaLocation, setMarinaLocation] = useState<LocationData>(PRESET_LOCATIONS[0]);
  const [services, setServices] = useState<ServiceRequest[]>([]); // Estas são as SOLICITAÇÕES
  const [catalog, setCatalog] = useState<Service[]>([]); // Estes são os ITENS DO CATÁLOGO
  const [clients, setClients] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [currentMarina, setCurrentMarina] = useState<Marina | null>(() => {
    const stored = localStorage.getItem('marina_boat_info');
    return stored ? JSON.parse(stored) : null;
  });
  const [marinas, setMarinas] = useState<Marina[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  // ...
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<User[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({ email: true, push: false, sms: false });

  const updateCatalogState = (newCatalog: Service[]) => {
    setCatalog(newCatalog);
  };

  const fetchData = async () => {
    setLoading(true);

    // Buscar Embarcações
    const { data: vesselsData, error: vesselsError } = await supabase
      .from('boats')
      .select('*');
    if (vesselsError) console.error('Error fetching vessels:', vesselsError);
    else if (vesselsData) {
      setVessels(vesselsData as Vessel[]);
    }

    // Buscar Serviços (Solicitações)
    const { data: servicesData, error: servicesError } = await supabase
      .from('service_requests')
      .select('*');
    if (servicesError) console.error('Error fetching services:', servicesError);
    else if (servicesData) setServices(servicesData);

    // Buscar Catálogo (Serviços Oficiais)
    const { data: catalogData, error: catalogError } = await supabase
      .from('services')
      .select('*');
    if (catalogError) console.error('Error fetching catalog:', catalogError);
    else if (catalogData) setCatalog(catalogData);


    // Buscar Clientes (Perfis)
    let clientsQuery = supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'cliente');

    // Se o usuário for 'marina', filtrar apenas clientes daquela marina
    if (currentUser?.user_type === 'marina') {
      const { data: marinaData } = await supabase
        .from('marinas')
        .select('id')
        .eq('owner_id', currentUser.id)
        .single();

      if (marinaData) {
        clientsQuery = clientsQuery.eq('marina_id', marinaData.id);
      }
    }

    const { data: profilesData, error: profilesError } = await clientsQuery;

    if (profilesError) console.error('Error fetching clients:', profilesError);
    else if (profilesData) {
      // Mapear perfis para incluir avatar_initial derivado do nome
      const mappedClients = profilesData.map((p: any) => ({
        ...p,
        name: p.full_name, // Mapear full_name do banco para name da interface
        avatar_initial: p.full_name ? p.full_name.charAt(0).toUpperCase() : '?'
      }));
      setClients(mappedClients as User[]);
    }



    // Buscar Agentes (Funcionários)
    const { data: agentsData, error: agentsError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'admin');
    if (agentsError) console.error('Error fetching agents:', agentsError);
    else if (agentsData) {
      const mappedAgents = agentsData.map((p: any) => ({
        ...p,
        name: p.full_name,
        avatar_initial: p.full_name ? p.full_name.charAt(0).toUpperCase() : '?'
      }));
      setAgents(mappedAgents as User[]);
    }

    // Buscar Marina vinculada se o usuário for role 'marina'
    if (currentUser?.user_type === 'marina') {
      const { data: marinaData } = await supabase
        .from('marinas')
        .select('*')
        .eq('owner_id', currentUser.id)
        .single();

      if (marinaData) {
        setCurrentMarina(marinaData as Marina);
        localStorage.setItem('marina_boat_info', JSON.stringify(marinaData));
      } else {
        // Fallback: se não encontrar marina no DB mas for user 'marina', limpar cache de marina antiga
        setCurrentMarina(null);
        localStorage.removeItem('marina_boat_info');
      }
    }

    // Buscar Orçamentos
    const { data: quotesData } = await supabase.from('quotations').select('*');
    if (quotesData) setQuotations(quotesData as Quotation[]);

    // Buscar Todas as Marinas se for Admin
    if (currentUser?.user_type === 'admin') {
      const { data: marinasData } = await supabase.from('marinas').select('*');
      if (marinasData) setMarinas(marinasData as Marina[]);
    }

    setLoading(false);
  };

  // --- Realtime Synchronization ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_requests' },
        (payload) => {
          console.log('Realtime Service Change:', payload);
          if (payload.eventType === 'INSERT') {
            setServices(prev => {
              // Evitar duplicidade se já adicionado localmente (otimista)
              if (prev.find(s => s.id === payload.new.id)) return prev;
              return [...prev, payload.new as ServiceRequest];
            });
            addNotification(`Nova solicitação: ${payload.new.category}`);
          } else if (payload.eventType === 'UPDATE') {
            setServices(prev => prev.map(s => s.id === payload.new.id ? { ...s, ...payload.new } : s));
            // Notificação apenas se o status mudou significativamente
            addNotification(`Serviço atualizado: ${payload.new.status}`);
          } else if (payload.eventType === 'DELETE') {
            setServices(prev => prev.filter(s => s.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quotations' },
        (payload) => {
          console.log('Realtime Quotation Change:', payload);
          if (payload.eventType === 'INSERT') {
            setQuotations(prev => {
              if (prev.find(q => q.id === payload.new.id)) return prev;
              return [...prev, payload.new as Quotation];
            });
            addNotification("Novo orçamento disponível!");
          } else if (payload.eventType === 'UPDATE') {
            setQuotations(prev => prev.map(q => q.id === payload.new.id ? { ...q, ...payload.new } : q));
          } else if (payload.eventType === 'DELETE') {
            setQuotations(prev => prev.filter(q => q.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Manipulação de Tema
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);



  // Carregar Configurações de Notificação do Supabase
  const loadUserSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setNotificationSettings({
          email: data.email_notifications,
          push: data.push_notifications,
          sms: data.sms_notifications
        });
      } else if (!error || error.code === 'PGRST116') {
        // No settings yet, create default
        await supabase.from('user_settings').insert({
          user_id: userId,
          email_notifications: true,
          push_notifications: false,
          sms_notifications: false
        });
      }
    } catch (err) {
      console.warn('Error loading user settings:', err);
      // Fallback to localStorage
      const stored = localStorage.getItem('marina_notification_settings');
      if (stored) setNotificationSettings(JSON.parse(stored));
    }
  };

  const updateNotificationSettings = async (settings: { email: boolean; push: boolean; sms: boolean }) => {
    setNotificationSettings(settings);
    localStorage.setItem('marina_notification_settings', JSON.stringify(settings));

    if (!currentUser) {
      addNotification("Preferências salvas localmente.");
      return;
    }

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: currentUser.id,
          email_notifications: settings.email,
          push_notifications: settings.push,
          sms_notifications: settings.sms
        }, { onConflict: 'user_id' });

      if (error) throw error;
      addNotification("Configurações salvas com sucesso!");
    } catch (err) {
      console.warn('Error saving notification settings:', err);
      addNotification("Erro ao salvar (salvo localmente)");
    }
  };

  // Auxiliar de Notificação
  const addNotification = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message: msg, type } as any]);
    setTimeout(() => {
      setNotifications(prev => prev.filter((n: any) => n.id !== id));
    }, 5000);
  };

  // Buscar Dados na Autenticação
  useEffect(() => {
    if (isAuthenticated) {
      // Apenas buscar dados, sem validar sessão Supabase
      // (Login manual não cria sessão Supabase, mas é válido)
      fetchData();
    }
  }, [isAuthenticated]);

  // Lógica de Autenticação com Persistência
  const login = async (type: UserType | 'manual', email?: string, password?: string) => {
    let user: User;
    let loginEmail, loginPassword;

    if (type === 'manual') {
      // Login manual com email/senha fornecidos
      if (!email || !password) {
        addNotification("Email e senha são obrigatórios!");
        return;
      }

      loginEmail = email;
      loginPassword = password;

      // Tentar autenticar no Supabase
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (error) {
          addNotification(`Erro no login: ${error.message}`);
          return;
        }

        if (data.user) {
          // Buscar perfil do usuário
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError || !profileData) {
            addNotification("Erro ao carregar perfil do usuário");
            return;
          }

          // Mapear perfil para User
          user = {
            id: profileData.id,
            name: profileData.full_name || email,
            email: data.user.email || email,
            phone: profileData.phone || '',
            user_type: profileData.user_type || 'cliente',
            avatar_initial: profileData.full_name ? profileData.full_name[0].toUpperCase() : email[0].toUpperCase(),
            created_at: profileData.created_at
          };
        } else {
          addNotification("Erro ao autenticar usuário");
          return;
        }
      } catch (err) {
        console.error('Exceção no Login Manual:', err);
        addNotification("Erro ao conectar com o servidor");
        return;
      }
    } else {
      // Login demo (admin, marina ou user)
      if (type === 'admin') {
        user = CURRENT_USER_EMPLOYEE;
        loginEmail = 'alexandre.djavan@gmail.com';
        loginPassword = 'admin123';
      } else if (type === 'marina') {
        user = CURRENT_USER_MARINA_OWNER;
        loginEmail = 'marina@marina.com';
        loginPassword = 'marina123';
      } else if (type === 'cliente') {
        user = CURRENT_USER_CLIENT;
        loginEmail = 'cliente@marina.com';
        loginPassword = 'user123';
      }

      // Tentar Login Real no Supabase para demo
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (error) {
          console.warn('Login Real Falhou (iniciando fallback):', error.message);
          // Continuar com login local mesmo se Supabase falhar
        } else {
          console.log('Login Real Sucesso:', data);
        }
      } catch (err) {
        console.error('Exceção no Login:', err);
      }
    }

    // Atualizar Estado Local (Visual)
    const userWithAvatar = {
      ...user,
      avatar_initial: user.avatar_initial || (user.name ? user.name.charAt(0).toUpperCase() : '?')
    };

    setCurrentUser(userWithAvatar);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    localStorage.setItem('marina_boat_user', JSON.stringify(userWithAvatar));

    // Load user settings from Supabase
    loadUserSettings(user.id);

    addNotification(`Bem-vindo, ${user.name}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    localStorage.removeItem('marina_boat_user');
    addNotification("Você saiu do sistema.");
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...data });
    addNotification("Perfil atualizado com sucesso!");
  };

  const addClient = async (userData: Omit<User, 'id' | 'created_at' | 'avatar_initial' | 'user_type'>) => {
    // 1. Criar Perfil no Supabase
    // Nota: Em um sistema de autenticação completo, você usaria supabase.auth.signUp() aqui.
    // Para esta demonstração simples onde apenas inserimos na tabela 'profiles' para "simular" um registro de usuário vinculado à autenticação:
    // Destruturar senha para fora para evitar enviá-la para a tabela profiles (Incompatibilidade de Schema / Segurança)
    // Mantivemos 'email' porque adicionamos a coluna na migração 007
    // Destruturar senha e name para renomear e limpar
    // 'name' deve virar 'full_name' para bater com o schema do banco
    const { password, name, ...safeUserData } = userData as any;

    const newUser: any = {
      ...safeUserData,
      full_name: name, // Mapeando 'name' (do form) para 'full_name' (do banco)
      // Gerando uma string tipo UUID aleatória já que não estamos usando Cadastro de Auth real ainda para este fluxo "Admin cria Usuário"
      // No uso real, Admin convidaria usuário via email.
      // Vamos apenas inserir em profiles.
      id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }),
      user_type: 'cliente' as const,
    };

    // Vincular à marina se o criador for um dono de marina
    if (currentUser?.user_type === 'marina' && currentMarina) {
      newUser.marina_id = currentMarina.id;
    }




    const { data, error } = await supabase
      .from('profiles')
      .insert([newUser])
      .select();

    if (error) {
      if (error.message.includes('row-level security') || error.message.includes('polic')) {
        console.warn("RLS Error (Demo Mode), aplicando atualização otimista.");
        const optimisticUser = {
          ...newUser,
          id: newUser.id,
          created_at: new Date().toISOString(),
          user_type: 'cliente',
          name: newUser.full_name,
          avatar_initial: newUser.full_name ? newUser.full_name[0] : '?'
        } as User;
        setClients([...clients, optimisticUser]);
        addNotification("Cliente cadastrado (Modo Demo/RLS Bypass)!");
      } else {
        addNotification("Erro ao cadastrar cliente: " + error.message);
        console.error(error);
      }
    } else if (data && data.length > 0 && data[0]) {
      setClients([...clients, data[0] as User]);
      addNotification("Cliente cadastrado com sucesso!");
    } else {
      // Fallback for RLS blocking return: Add optimistically since we generated the ID
      console.warn("Dados não retornados (RLS provável), atualizando estado localmente.");
      const optimisticUser = { ...newUser, name: newUser.full_name, avatar_initial: newUser.full_name ? newUser.full_name[0] : '?' } as User;
      setClients([...clients, optimisticUser]);
      addNotification("Cliente cadastrado e adicionado à lista!");
    }

  };

  const updateClient = async (id: string, data: Partial<User>) => {
    // Mapear name -> full_name se presente
    const payload: any = { ...data };

    // REMOVER password do payload para evitar erro de coluna inexistente
    delete payload.password;

    if (payload.name) {
      payload.full_name = payload.name;
      delete payload.name;
    }

    const { error } = await supabase.from('profiles').update(payload).eq('id', id);

    if (error) {
      console.error(error);
      addNotification("Erro ao atualizar cliente: " + error.message);
    } else {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      addNotification("Cliente atualizado com sucesso!");
    }
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      console.error(error);
      addNotification("Erro ao excluir cliente: " + error.message);
    } else {
      setClients(prev => prev.filter(c => c.id !== id));
      addNotification("Cliente excluído com sucesso!");
    }
  };

  const addVessel = async (vesselData: Omit<Vessel, 'id' | 'created_at'>) => {
    if (!currentUser) return;

    // Adicionar marina_id se o usuário for marina
    const payload = { ...vesselData };
    if (currentUser.user_type === 'marina' && currentUser.marina_id) {
      payload.marina_id = currentUser.marina_id;
    }

    const { data, error } = await supabase
      .from('boats') // Nome da tabela é boats
      .insert([payload]) // Usar o payload com marina_id
      .select();

    if (error) {
      if (error.message.includes('row-level security') || error.message.includes('polic')) {
        console.warn("RLS Error (Demo Mode), aplicando atualização otimista em Embarcação.");
        const fakeId = 'demo-vessel-' + Date.now();
        const optimisticVessel = { ...vesselData, id: fakeId, created_at: new Date().toISOString() } as Vessel;
        setVessels([...vessels, optimisticVessel]);
        addNotification("Embarcação salva (Modo Demo/RLS Bypass)!");
      } else {
        addNotification("Erro ao salvar embarcação: " + error.message);
        console.error(error);
      }
    } else if (data && data.length > 0 && data[0]) {
      setVessels([...vessels, data[0] as Vessel]);
      addNotification("Embarcação salva com sucesso!");
    }
  };

  const updateVessel = async (id: string, data: Partial<Vessel>) => {
    const { error } = await supabase.from('boats').update(data).eq('id', id);

    if (error) {
      console.error(error);
      addNotification("Erro ao atualizar embarcação: " + error.message);
    } else {
      setVessels(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
      addNotification("Embarcação atualizada com sucesso!");
    }
  };

  const deleteVessel = async (id: string) => {
    const { error } = await supabase.from('boats').delete().eq('id', id);
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

    // Obter o ID do usuário do perfil correspondente ao email atual (autenticação simulada)
    // Idealmente usar auth.uid() se autenticação real for provável
    // Por enquanto, assumir que currentUser tem ID correspondente à tabela profiles se o buscamos.
    // Se currentUser vem do estado 'clients', ele tem ID.
    // Se vem do Mock, tem 'u1'.

    // Precisamos buscar o UUID real para o perfil com base no email se estivermos simulando login sem sessão de auth real
    let userId = currentUser.id;

    // FIX PROACTIVE: Check for short/mock IDs
    if (userId.length < 10) {
      // 1. Tentar encontrar ID real na lista de clientes se carregada, ou buscá-lo
      const found = clients.find(c => c.email === currentUser.email);
      if (found) {
        userId = found.id;
      } else {
        // 2. Se não estiver no cache (ex: Admin), buscar direto no banco
        // Nota: Isso é um fallback assíncrono.
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', currentUser.email)
          .single();

        if (profile) userId = profile.id;
      }
    }

    const newService = {
      ...serviceData,
      user_id: userId, // Alterado de created_by para user_id
      status: 'Pendente' as const,
      photos: [] // Padrão vazio
    };

    const { data, error } = await supabase
      .from('service_requests')
      .insert([newService])
      .select();

    if (error) {
      console.warn("Erro ao solicitar serviço (Fallback Demo):", error.message);
      // Fallback Otimista Incondicional
      const fakeId = 'demo-service-' + Date.now();
      const optimisticService = { ...newService, id: fakeId, created_at: new Date().toISOString() } as ServiceRequest;
      setServices([...services, optimisticService]);
      addNotification("Solicitação enviada (Modo Demo/Fallback)!");
    } else if (data && data.length > 0 && data[0]) {
      setServices([...services, data[0] as ServiceRequest]);
      addNotification("Solicitação enviada com sucesso!");
    }
  };

  const updateService = async (id: string, data: Partial<ServiceRequest>) => {
    const { error } = await supabase.from('service_requests').update(data).eq('id', id);

    if (error) {
      console.warn("Erro ao atualizar serviço (Possível RLS):", error.message);
      // Fallback Otimista para Demo
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
      addNotification("Serviço atualizado (Modo Demo/Local)!");
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

  const updateServiceStatus = async (id: string, status: ServiceStatus) => {
    // Atualização otimista local
    setServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));

    const { error } = await supabase
      .from('service_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar status no banco:', error);
      addNotification("Erro ao sincronizar status com o servidor.");
    } else {
      addNotification(`Status atualizado para ${status}`);
    }
  };

  const addAgent = async (userData: Omit<User, 'id' | 'created_at' | 'avatar_initial' | 'user_type'>) => {
    const { password, name, ...safeUserData } = userData as any;
    // Gerar UUID v4 compatível
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    const newAgent = {
      ...safeUserData,
      full_name: name,
      id: uuid,
      user_type: 'admin',
    };

    const { data, error } = await supabase.from('profiles').insert([newAgent]).select();

    if (error) {
      console.warn("Erro ao criar agente (RLS/Auth):", error.message);
      // Fallback otimista
      const optimistic = {
        ...newAgent,
        name: name,
        created_at: new Date().toISOString(),
        avatar_initial: name ? name[0].toUpperCase() : '?'
      } as User;
      setAgents([...agents, optimistic]);
      addNotification("Membro adicionado (Modo Offline)!");
    } else if (data && data[0]) {
      const created = data[0];
      setAgents([...agents, { ...created, name: created.full_name, avatar_initial: created.full_name ? created.full_name[0].toUpperCase() : '?' } as User]);
      addNotification("Membro cadastrado com sucesso!");
    }
  };

  const updateAgent = async (id: string, data: Partial<User>) => {
    const payload: any = { ...data };
    delete payload.password;
    if (payload.name) {
      payload.full_name = payload.name;
      delete payload.name;
    }

    const { error } = await supabase.from('profiles').update(payload).eq('id', id);
    if (error) {
      console.error(error);
      addNotification("Erro ao atualizar membro: " + error.message);
    } else {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
      addNotification("Membro atualizado!");
    }
  };

  const deleteAgent = async (id: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      console.error(error);
      addNotification("Erro ao excluir membro: " + error.message);
    } else {
      setAgents(prev => prev.filter(a => a.id !== id));
      addNotification("Membro removido.");
    }
  };

  const addQuotation = async (data: Omit<Quotation, 'id' | 'created_at'>) => {
    const { data: newQuote, error } = await supabase.from('quotations').insert([data]).select();
    if (error) {
      addNotification("Erro ao enviar orçamento: " + error.message);
    } else if (newQuote && newQuote[0]) {
      setQuotations([...quotations, newQuote[0] as Quotation]);
      // Atualizar status do serviço solicitado para 'Aguardando Orçamento'
      await updateServiceStatus(data.service_request_id, 'Aguardando Orçamento');
      addNotification("Orçamento enviado com sucesso!");
    }
  };

  const updateQuotationStatus = async (id: string, status: 'Aprovado' | 'Recusado') => {
    const { error } = await supabase.from('quotations').update({ status }).eq('id', id);
    if (error) {
      addNotification("Erro ao atualizar orçamento: " + error.message);
    } else {
      setQuotations(prev => prev.map(q => q.id === id ? { ...q, status } : q));
      const quote = quotations.find(q => q.id === id);
      if (quote) {
        if (status === 'Aprovado') {
          await updateServiceStatus(quote.service_request_id, 'Agendado');
        } else {
          await updateServiceStatus(quote.service_request_id, 'Orçamento Recusado');
        }
      }
      addNotification(`Orçamento ${status === 'Aprovado' ? 'aprovado' : 'recusado'}!`);
    }
  };

  const addMarina = async (data: Omit<Marina, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: newMarina, error } = await supabase.from('marinas').insert([data]).select();
    if (error) {
      addNotification("Erro ao cadastrar marina: " + error.message);
    } else if (newMarina && newMarina[0]) {
      setMarinas([...marinas, newMarina[0] as Marina]);
      addNotification("Marina cadastrada com sucesso!");
    }
  };

  const updateMarina = async (id: string, data: Partial<Marina>) => {
    const { error } = await supabase.from('marinas').update(data).eq('id', id);
    if (error) {
      addNotification("Erro ao atualizar marina: " + error.message);
    } else {
      setMarinas(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
      if (currentMarina?.id === id) {
        const updated = { ...currentMarina, ...data };
        setCurrentMarina(updated);
        localStorage.setItem('marina_boat_info', JSON.stringify(updated));
      }
      addNotification("Dados da marina atualizados!");
    }
  };

  const deleteMarina = async (id: string) => {
    const { error } = await supabase.from('marinas').delete().eq('id', id);
    if (error) {
      addNotification("Erro ao remover marina: " + error.message);
    } else {
      setMarinas(prev => prev.filter(m => m.id !== id));
      if (currentMarina?.id === id) {
        setCurrentMarina(null);
        localStorage.removeItem('marina_boat_info');
      }
      addNotification("Marina removida com sucesso!");
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      logout,
      updateUserProfile,
      vessels,
      services,
      clients,
      addClient,
      updateClient,
      deleteClient,
      addVessel,
      updateVessel,
      deleteVessel,
      catalog,
      updateCatalogState,
      addService,
      updateService,
      deleteService,
      updateServiceStatus,
      agents,
      addAgent,
      updateAgent,
      deleteAgent,
      marinas,
      addMarina,
      updateMarina,
      deleteMarina,
      notifications,
      setNotifications,
      addNotification,
      currentView,
      setCurrentView,
      isDarkMode,
      toggleTheme,
      currentMarina,
      notificationSettings,
      updateNotificationSettings,
      quotations,
      addQuotation,
      updateQuotationStatus,
      marinaLocation,
      setMarinaLocation
    }}>
      {children}
    </AppContext.Provider>
  );
};

// --- Página: Marinas (Apenas Admin) ---

const Marinas = () => {
  const { marinas, addMarina, updateMarina, deleteMarina, agents } = useAppContext();
  const [editingMarina, setEditingMarina] = useState<Marina | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marinaToDelete, setMarinaToDelete] = useState<Marina | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    owner_id: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMarina) {
      updateMarina(editingMarina.id, formData);
    } else {
      addMarina(formData);
    }
    setFormData({ name: '', owner_id: '', address: '', city: '', state: '', phone: '', email: '' });
    setEditingMarina(null);
    setIsModalOpen(false);
  };

  const marinaOwners = agents.filter(a => a.user_type === 'marina' || a.user_type === 'admin'); // Simplificação para demo

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestão de Marinas</h2>
          <p className="text-slate-500">Cadastre e gerencie as marinas do sistema.</p>
        </div>
        <Button onClick={() => { setEditingMarina(null); setFormData({ name: '', owner_id: '', address: '', city: '', state: '', phone: '', email: '' }); setIsModalOpen(true); }}>
          <Plus size={18} /> Nova Marina
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Nome da Marina</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {marinas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    Nenhuma marina cadastrada.
                  </td>
                </tr>
              ) : (
                marinas.map(marina => (
                  <tr key={marina.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-lg">
                          <Building2 size={20} />
                        </div>
                        {marina.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {marina.city}, {marina.state}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <div>{marina.email}</div>
                      <div className="text-xs opacity-70">{marina.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingMarina(marina);
                            setFormData({
                              name: marina.name || '',
                              owner_id: marina.owner_id || '',
                              address: marina.address || '',
                              city: marina.city || '',
                              state: marina.state || '',
                              phone: marina.phone || '',
                              email: marina.email || ''
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-500 rounded bg-slate-50 dark:bg-slate-800 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setMarinaToDelete(marina)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded bg-slate-50 dark:bg-slate-800 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingMarina(null); }} title={editingMarina ? "Editar Marina" : "Nova Marina"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome da Marina</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Marina Tropical"
            />
          </div>
          <div>
            <Label>Dono da Marina (E-mail)</Label>
            <Input
              required
              value={formData.owner_id}
              onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
              placeholder="ID do Perfil do Dono"
            />
            <p className="text-[10px] text-slate-400 mt-1">* Para esta demo, insira o ID UUID do usuário dono.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cidade</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ex: Angra dos Reis"
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Ex: RJ"
              />
            </div>
          </div>
          <div>
            <Label>E-mail de Contato</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contato@marina.com"
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editingMarina ? 'Salvar Alterações' : 'Cadastrar Marina'}</Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={!!marinaToDelete}
        onClose={() => setMarinaToDelete(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p>Você excluir a marina <strong>{marinaToDelete?.name}</strong>?</p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setMarinaToDelete(null)}>Cancelar</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (marinaToDelete) {
                  deleteMarina(marinaToDelete.id);
                  setMarinaToDelete(null);
                }
              }}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
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
    case 'marinas': return <Marinas />;
    case 'agents': return <Agents />;
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
