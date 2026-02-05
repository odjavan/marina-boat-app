import React from 'react';
import { ServiceRequest, ServiceStatus, Vessel, User } from '../types';
import { Card, Button, Badge } from './ui';
import { Clock, CheckCircle2, AlertTriangle, XCircle, ChevronLeft, Calendar, Ship, User as UserIcon } from 'lucide-react';

interface ServiceDetailsProps {
    service: ServiceRequest;
    vessel?: Vessel;
    requester?: User;
    onBack: () => void;
    onStatusUpdate?: (id: string, status: ServiceStatus) => void;
    isAdmin: boolean;
}

const statusSteps: ServiceStatus[] = ['Pendente', 'Em Análise', 'Agendado', 'Em Andamento', 'Concluído'];

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
    service,
    vessel,
    requester,
    onBack,
    onStatusUpdate,
    isAdmin
}) => {
    const currentStepIndex = statusSteps.indexOf(service.status);
    const isCancelled = service.status === 'Cancelado';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} className="p-2">
                    <ChevronLeft size={24} />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{service.category}</h2>
                    <p className="text-slate-500 text-sm flex items-center gap-2">
                        #{service.id.slice(0, 8)} • Solicitado em {new Date(service.created_at).toLocaleDateString('pt-BR')}
                    </p>
                </div>
                <div className="ml-auto">
                    <Badge
                        color={
                            service.status === 'Concluído' ? 'green' :
                                service.status === 'Cancelado' ? 'red' :
                                    service.status === 'Pendente' ? 'slate' : 'blue'
                        }
                        className="text-sm px-3 py-1"
                    >
                        {service.status}
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    {/* Timeline Visual */}
                    <Card className="p-6">
                        <h3 className="font-bold text-lg mb-6">Progresso do Serviço</h3>
                        {isCancelled ? (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-300">
                                <XCircle size={24} />
                                <div>
                                    <p className="font-bold">Serviço Cancelado</p>
                                    <p className="text-sm">Este serviço foi cancelado e não terá mais atualizações.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex justify-between">
                                {/* Connecting Line */}
                                <div className="absolute top-4 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-10"></div>
                                <div
                                    className="absolute top-4 left-0 h-1 bg-cyan-500 transition-all duration-500 -z-10"
                                    style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%` }}
                                ></div>

                                {statusSteps.map((step, idx) => {
                                    const isCompleted = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;

                                    return (
                                        <div key={step} className="flex flex-col items-center gap-2">
                                            <div
                                                className={`
                          w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white dark:bg-slate-900
                          ${isCompleted ? 'border-cyan-500 text-cyan-500' : 'border-slate-200 dark:border-slate-700 text-slate-300'}
                          ${isCurrent ? 'ring-4 ring-cyan-100 dark:ring-cyan-900/30' : ''}
                        `}
                                            >
                                                {isCompleted ? <CheckCircle2 size={16} fill="currentColor" className="text-white bg-cyan-500 rounded-full" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                                            </div>
                                            <span className={`text-xs font-medium ${isCompleted ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-400'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>

                    {/* Details */}
                    <Card className="p-6 space-y-4">
                        <h3 className="font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-2">Detalhes da Solicitação</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</label>
                                <p className="text-slate-700 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    {service.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Preferencial</label>
                                    <div className="flex items-center gap-2 mt-1 text-slate-700 dark:text-slate-300">
                                        <Calendar size={18} className="text-cyan-500" />
                                        {new Date(service.preferred_date).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urgência</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <AlertTriangle size={18} className={
                                            service.urgency === 'Emergencial' ? 'text-red-500' :
                                                service.urgency === 'Urgente' ? 'text-yellow-500' : 'text-blue-500'
                                        } />
                                        <span className="font-medium">{service.urgency}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Actions */}
                            {isAdmin && !isCancelled && service.status !== 'Concluído' && onStatusUpdate && (
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Ações Administrativas</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {service.status === 'Pendente' && (
                                            <Button size="sm" onClick={() => onStatusUpdate(service.id, 'Em Análise')}>Aceitar / Analisar</Button>
                                        )}
                                        {(service.status === 'Pendente' || service.status === 'Em Análise') && (
                                            <Button size="sm" variant="outline" onClick={() => onStatusUpdate(service.id, 'Agendado')}>Agendar</Button>
                                        )}
                                        {service.status === 'Agendado' && (
                                            <Button size="sm" onClick={() => onStatusUpdate(service.id, 'Em Andamento')}>Iniciar Serviço</Button>
                                        )}
                                        {service.status === 'Em Andamento' && (
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onStatusUpdate(service.id, 'Concluído')}>Concluir Serviço</Button>
                                        )}
                                        <Button size="sm" variant="danger" onClick={() => onStatusUpdate(service.id, 'Cancelado')}>Cancelar</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Related Vessel */}
                    <Card className="p-5">
                        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-4">Embarcação</h3>
                        {vessel ? (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-cyan-600 dark:text-cyan-400">
                                    <Ship size={32} />
                                </div>
                                <h4 className="font-bold text-lg">{vessel.name}</h4>
                                <p className="text-sm text-slate-500">{vessel.brand} {vessel.model}</p>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-left">
                                    <div>
                                        <span className="text-slate-400">Tipo:</span>
                                        <p className="font-medium">{vessel.type}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Tamanho:</span>
                                        <p className="font-medium">{vessel.length} pés</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 italic text-sm">Embarcação não encontrada.</p>
                        )}
                    </Card>

                    {/* Requester Info (Admin Only) */}
                    {isAdmin && requester && (
                        <Card className="p-5">
                            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-4">Solicitante</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold">
                                    {requester.avatar_initial}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{requester.name}</p>
                                    <p className="text-xs text-slate-500">{requester.email}</p>
                                </div>
                            </div>
                            <div className="mt-3 text-xs flex items-center gap-2 text-slate-500">
                                <UserIcon size={12} />
                                <span>{requester.user_type === 'funcionario' ? 'Administrador' : 'Cliente'}</span>
                            </div>
                        </Card>
                    )}

                    {/* Helpful Tip */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                        <div className="flex items-start gap-2">
                            <Clock size={16} className="mt-0.5 shrink-0" />
                            <p>O tempo médio de conclusão para este tipo de serviço é de <strong>2 dias úteis</strong> após a aprovação.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
