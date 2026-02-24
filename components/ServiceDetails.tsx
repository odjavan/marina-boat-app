import React from 'react';
import { ServiceRequest, ServiceStatus, Vessel, User } from '../types';
import { useAppContext } from '../App';
import { Card, Button, Badge, Label, Select, Input, cn } from './ui';
import { Clock, CheckCircle2, AlertTriangle, XCircle, ChevronLeft, Calendar, Ship, User as UserIcon, Briefcase, FileText, DollarSign } from 'lucide-react';

interface ServiceDetailsProps {
    service: ServiceRequest;
    vessel?: Vessel;
    requester?: User;
    onBack: () => void;
    onStatusUpdate?: (id: string, status: ServiceStatus) => void;
    isAdmin: boolean;
}

const statusSteps: ServiceStatus[] = ['Pendente', 'Em Análise', 'Aguardando Orçamento', 'Agendado', 'Em Andamento', 'Concluído'];

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
    service,
    vessel,
    requester,
    onBack,
    onStatusUpdate,
    isAdmin
}) => {
    const { agents, updateService, quotations, addQuotation, updateQuotationStatus, currentUser, currentMarina } = useAppContext();
    const [quoteForm, setQuoteForm] = React.useState({ amount: 0, days: 1, description: '' });
    const [showQuoteForm, setShowQuoteForm] = React.useState(false);
    const currentStepIndex = statusSteps.indexOf(service.status);
    const isCancelled = service.status === 'Cancelado';

    const handleAssignAgent = (agentId: string) => {
        updateService(service.id, { assigned_to: agentId });
    };

    const assignedAgent = agents.find(a => a.id === service.assigned_to);

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

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Responsável Técnico</label>
                                    {isAdmin && !service.assigned_to && (
                                        <Badge color="blue" className="text-[10px] animate-pulse">IA: Sugestão Disponível</Badge>
                                    )}
                                </div>
                                {isAdmin ? (
                                    <div className="space-y-2">
                                        <Select
                                            value={service.assigned_to || ''}
                                            onChange={(e) => handleAssignAgent(e.target.value)}
                                            className={cn(!service.assigned_to && "border-cyan-200 dark:border-cyan-900 shadow-sm shadow-cyan-500/10")}
                                        >
                                            <option value="">Selecione um responsável...</option>
                                            {agents.map(agent => {
                                                // Lógica Simples de Sugestão
                                                const isSuggested =
                                                    (service.category.toLowerCase().includes('limp') && agent.name.toLowerCase().includes('carlos')) ||
                                                    (service.category.toLowerCase().includes('mecan') && agent.name.toLowerCase().includes('marcelo')) ||
                                                    (service.category.toLowerCase().includes('elet') && agent.name.toLowerCase().includes('henrique'));

                                                return (
                                                    <option key={agent.id} value={agent.id}>
                                                        {agent.name} {isSuggested ? '⭐ (Recomendado para esta categoria)' : ''}
                                                    </option>
                                                );
                                            })}
                                        </Select>
                                        {isAdmin && !service.assigned_to && (
                                            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium italic">
                                                * Nossa IA sugere o profissional com maior expertise em <strong>{service.category}</strong>.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <Briefcase size={18} className="text-slate-400" />
                                        {assignedAgent ? (
                                            <span className="font-medium">{assignedAgent.name}</span>
                                        ) : (
                                            <span className="text-slate-400 italic">Não atribuído</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Admin Actions */}
                            {isAdmin && !isCancelled && service.status !== 'Concluído' && onStatusUpdate && (
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Ações Administrativas</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {service.status === 'Pendente' && (
                                            <Button size="sm" onClick={() => onStatusUpdate(service.id, 'Em Análise')}>Aceitar / Analisar</Button>
                                        )}
                                        {service.status === 'Em Análise' && !showQuoteForm && (
                                            <Button size="sm" variant="primary" onClick={() => setShowQuoteForm(true)}>Enviar Orçamento</Button>
                                        )}
                                        {(service.status === 'Pendente' || service.status === 'Em Análise') && (
                                            <Button size="sm" variant="outline" onClick={() => onStatusUpdate(service.id, 'Agendado')}>Agendar Direto</Button>
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

                            {/* Quotation Flow - Marina Side */}
                            {isAdmin && showQuoteForm && (
                                <Card className="p-4 bg-slate-50 dark:bg-slate-800/50 border-cyan-200 dark:border-cyan-900 animate-in zoom-in-95 duration-200 mt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
                                            <DollarSign size={18} /> Novo Orçamento
                                        </h4>
                                        <button onClick={() => setShowQuoteForm(false)} className="text-slate-400 hover:text-slate-600">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Valor do Serviço (R$)</Label>
                                                <div className="relative">
                                                    <DollarSign size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                                    <Input
                                                        type="number"
                                                        className="pl-9"
                                                        value={quoteForm.amount}
                                                        onChange={(e) => setQuoteForm({ ...quoteForm, amount: parseFloat(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Prazo (Dias)</Label>
                                                <Input
                                                    type="number"
                                                    value={quoteForm.days}
                                                    onChange={(e) => setQuoteForm({ ...quoteForm, days: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Notas do Orçamento</Label>
                                            <textarea
                                                className="w-full h-20 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                                                placeholder="Inclua o que está coberto no valor..."
                                                value={quoteForm.description}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })}
                                            />
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={async () => {
                                                if (currentMarina) {
                                                    await addQuotation({
                                                        service_request_id: service.id,
                                                        marina_id: currentMarina.id,
                                                        amount: quoteForm.amount,
                                                        description: quoteForm.description,
                                                        estimated_days: quoteForm.days,
                                                        status: 'Aguardando'
                                                    });
                                                    setShowQuoteForm(false);
                                                }
                                            }}
                                        >
                                            Enviar Orçamento para o Cliente
                                        </Button>
                                    </div>
                                </Card>
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
                                <span>{requester.user_type === 'admin' ? 'Administrador' : requester.user_type === 'marina' ? 'Dono da Marina' : 'Dono de Embarcação'}</span>
                            </div>
                        </Card>
                    )}

                    {/* Quotation Info - Client Side */}
                    {!isAdmin && service.status === 'Aguardando Orçamento' && (
                        <Card className="p-5 border-2 border-cyan-500 ring-4 ring-cyan-500/10 animate-pulse-subtle">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                <DollarSign className="text-cyan-500" /> Orçamento Recebido!
                            </h3>
                            {quotations.filter(q => q.service_request_id === service.id && q.status === 'Aguardando').map(quote => (
                                <div key={quote.id} className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs text-slate-500">Valor Total:</span>
                                            <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Prazo Estimado:</span>
                                            <span className="font-bold">{quote.estimated_days} dias</span>
                                        </div>
                                    </div>
                                    {quote.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{quote.description}"</p>
                                    )}
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="primary"
                                            className="w-full bg-cyan-600 hover:bg-cyan-700"
                                            onClick={() => updateQuotationStatus(quote.id, 'Aprovado')}
                                        >
                                            Aprovar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => updateQuotationStatus(quote.id, 'Recusado')}
                                        >
                                            Recusar
                                        </Button>
                                    </div>
                                </div>
                            ))}
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
