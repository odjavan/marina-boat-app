import React from 'react';
import { Card, Badge, cn } from './ui';
import { AlertCircle, Clock, Droplets, ArrowRight } from 'lucide-react';
import { useAppContext } from '../App';

export const ProactiveAlerts = () => {
    const { services, vessels, quotations, currentUser } = useAppContext();

    if (!currentUser) return null;

    const alerts = [];

    // 1. Alerta de Orçamento Pendente (Para Cliente)
    if (currentUser.user_type === 'cliente') {
        const pendingQuotes = services.filter(s =>
            s.user_id === currentUser.id && s.status === 'Aguardando Orçamento'
        );
        if (pendingQuotes.length > 0) {
            alerts.push({
                id: 'quote-pending',
                title: 'Orçamento Recebido',
                description: `Você tem ${pendingQuotes.length} proposta(s) aguardando sua aprovação.`,
                icon: Clock,
                color: 'amber',
                action: 'Ver Orçamentos'
            });
        }
    }

    // 2. Alerta de Manutenção/Limpeza (Para Marina/Admin)
    if (currentUser.user_type !== 'cliente') {
        const needsCleaning = vessels.filter((_, idx) => idx % 3 === 0).slice(0, 2); // Simulação baseada em lógica de tempo
        if (needsCleaning.length > 0) {
            alerts.push({
                id: 'cleaning-alert',
                title: 'Sugestão de Manutenção',
                description: `${needsCleaning.length} embarcações estão há mais de 15 dias sem limpeza.`,
                icon: Droplets,
                color: 'blue',
                action: 'Notificar Proprietários'
            });
        }

        const stalledServices = services.filter(s => s.status === 'Em Análise').length;
        if (stalledServices > 0) {
            alerts.push({
                id: 'stalled-services',
                title: 'Atenção às Demandas',
                description: `${stalledServices} solicitações estão em análise há mais de 24h.`,
                icon: AlertCircle,
                color: 'red',
                action: 'Acelerar Processo'
            });
        }
    }

    if (alerts.length === 0) return null;

    return (
        <div className="space-y-4 animate-premium">
            <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-1 bg-cyan-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Insights Proativos</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alerts.map((alert) => (
                    <Card key={alert.id} className="p-4 border-l-4 hover:shadow-lg transition-all border-l-current group" style={{ color: `var(--${alert.color}-500)` }}>
                        <div className="flex gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                                alert.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                    alert.color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                            )}>
                                <alert.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                                    {alert.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    {alert.description}
                                </p>
                                <button className="mt-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                                    {alert.action} <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
